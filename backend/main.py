"""Colorize grayscale photos.

This script colorizes grayscale images using the pre-trained colorization model
from Richard Zhang et al. If the model files are not present, it will attempt
to download them. If downloading fails, it falls back to a simple colormap
based colorization (visual effect but not true restoration).

Usage examples:
  python main.py --input path/to/gray.jpg --output path/to/out.png
  python main.py --test            # create a synthetic test image and colorize it

Requirements (see requirements.txt): opencv-python, numpy, requests, tqdm
"""

from __future__ import annotations

import argparse
import os
import sys
import shutil
from pathlib import Path
from typing import Optional

import cv2
import numpy as np

try:
	import requests
	from tqdm import tqdm
except Exception:
	# We'll handle missing packages at runtime with an instructive error later.
	requests = None  # type: ignore
	tqdm = None  # type: ignore


MODEL_URLS = {
	"prototxt": "https://raw.githubusercontent.com/richzhang/colorization/master/models/colorization_deploy_v2.prototxt",
	"caffemodel": "http://eecs.berkeley.edu/~rich.zhang/projects/2016_colorization/files/demo_v2/colorization_release_v2.caffemodel",
	"pts_in_hull": "https://raw.githubusercontent.com/richzhang/colorization/master/resources/pts_in_hull.npy",
}


def download_file(url: str, dest: Path) -> None:
	if requests is None or tqdm is None:
		raise RuntimeError("Missing 'requests' or 'tqdm' packages. Install from requirements.txt")

	dest.parent.mkdir(parents=True, exist_ok=True)
	resp = requests.get(url, stream=True, timeout=30)
	resp.raise_for_status()
	total = int(resp.headers.get("content-length", 0))
	with open(dest, "wb") as f, tqdm(total=total, unit="B", unit_scale=True, desc=dest.name) as pbar:
		for chunk in resp.iter_content(chunk_size=8192):
			if not chunk:
				continue
			f.write(chunk)
			pbar.update(len(chunk))


def ensure_models(models_dir: Path) -> bool:
	"""Ensure model files are present. Returns True if models available."""
	prototxt = models_dir / "colorization_deploy_v2.prototxt"
	caffemodel = models_dir / "colorization_release_v2.caffemodel"
	pts = models_dir / "pts_in_hull.npy"

	missing = [p for p in (prototxt, caffemodel, pts) if not p.exists()]
	if not missing:
		return True

	print("Model files not found. Attempting to download (~80 MB for caffemodel)...")
	try:
		for key, url in MODEL_URLS.items():
			out = models_dir / ("pts_in_hull.npy" if key == "pts_in_hull" else ("colorization_deploy_v2.prototxt" if key == "prototxt" else "colorization_release_v2.caffemodel"))
			if not out.exists():
				download_file(url, out)
	except Exception as ex:
		print(f"Model download failed: {ex}")
		print("Proceeding without pretrained model — a fallback colormap will be used.")
		return False

	return True


class Colorizer:
	def __init__(self, models_dir: Path):
		self.models_dir = models_dir
		self.net = None
		self.pts_in_hull = None
		self.model_ready = False
		self._load_model_if_present()

	def _load_model_if_present(self) -> None:
		prototxt = self.models_dir / "colorization_deploy_v2.prototxt"
		caffemodel = self.models_dir / "colorization_release_v2.caffemodel"
		pts = self.models_dir / "pts_in_hull.npy"

		if not (prototxt.exists() and caffemodel.exists() and pts.exists()):
			self.model_ready = False
			return

		# Load network
		net = cv2.dnn.readNetFromCaffe(str(prototxt), str(caffemodel))

		# Load cluster centers
		pts_in_hull = np.load(str(pts))  # (313,2)

		# add the cluster centers as 1x1 convolution kernel to the model
		class8 = net.getLayerId("class8_ab") if isinstance(net.getLayerId, object) else None
		# The OpenCV DNN binding expects these layer names from the original prototxt.
		# See https://github.com/richzhang/colorization for details.
		pts = pts_in_hull.transpose().reshape(2, 313, 1, 1)
		net.getLayer(net.getLayerId("class8_ab")).blobs = [pts.astype(np.float32)]
		net.getLayer(net.getLayerId("conv8_313_rh")).blobs = [np.full((1, 313), 2.606, dtype=np.float32)]

		self.net = net
		self.pts_in_hull = pts_in_hull
		self.model_ready = True

	def colorize(self, img_bgr: np.ndarray) -> np.ndarray:
		"""Return colorized BGR image for a grayscale or BGR input."""
		if not self.model_ready:
			return fallback_colormap(img_bgr)

		img_rgb = (img_bgr[:, :, ::-1]).astype(np.float32) / 255.0
		img_lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2LAB)
		l_channel = img_lab[:, :, 0]

		# Resize L to network input size
		h_orig, w_orig = l_channel.shape
		l_rs = cv2.resize(l_channel, (224, 224))
		l_rs -= 50  # mean-centering as used by the original model

		net = self.net
		net.setInput(cv2.dnn.blobFromImage(l_rs))
		ab_dec = net.forward()[0, :, :, :].transpose((1, 2, 0))  # 224x224x2

		ab_us = cv2.resize(ab_dec, (w_orig, h_orig))
		lab_out = np.concatenate((l_channel[:, :, np.newaxis], ab_us), axis=2)
		img_bgr_out = cv2.cvtColor(lab_out.astype(np.float32), cv2.COLOR_LAB2BGR)
		img_bgr_out = np.clip(img_bgr_out, 0, 1)
		img_bgr_out = (255 * img_bgr_out).astype(np.uint8)
		return img_bgr_out


def fallback_colormap(img_bgr: np.ndarray) -> np.ndarray:
	"""Simple fallback: apply a visually pleasing colormap to grayscale luminance.

	This does not restore true colors, but produces a colorful visualization.
	"""
	if img_bgr.ndim == 3 and img_bgr.shape[2] == 3:
		gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
	else:
		gray = img_bgr

	# Normalize and convert to 8-bit
	norm = cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
	# Use a warm colormap
	colored = cv2.applyColorMap(norm, cv2.COLORMAP_AUTUMN)
	return colored


def colorize_file(input_path: Path, output_path: Path, models_dir: Path) -> Path:
	img = cv2.imread(str(input_path), cv2.IMREAD_UNCHANGED)
	if img is None:
		raise FileNotFoundError(f"Unable to read image: {input_path}")

	# If single-channel, convert to BGR for consistent pipeline
	if img.ndim == 2:
		img_bgr = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
	elif img.shape[2] == 4:
		img_bgr = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
	else:
		img_bgr = img

	colorizer = Colorizer(models_dir)
	out = colorizer.colorize(img_bgr)

	output_path.parent.mkdir(parents=True, exist_ok=True)
	cv2.imwrite(str(output_path), out)
	return output_path


def create_synthetic_test(path: Path) -> Path:
	# Create a simple gradient grayscale image
	w, h = 512, 256
	grad = np.tile(np.linspace(0, 255, w, dtype=np.uint8), (h, 1))
	img = cv2.merge([grad, grad, grad])
	cv2.imwrite(str(path), img)
	return path


def parse_args() -> argparse.Namespace:
	p = argparse.ArgumentParser(description="Colorize grayscale photos")
	p.add_argument("--input", "-i", type=Path, help="input grayscale image path")
	p.add_argument("--output", "-o", type=Path, help="output color image path")
	p.add_argument("--models", type=Path, default=Path.cwd() / "models", help="models directory")
	p.add_argument("--test", action="store_true", help="run a small self-test (creates test_input.png -> test_output.png)")
	return p.parse_args()


def main() -> int:
	args = parse_args()
	models_dir = args.models

	if args.test:
		print("Creating synthetic grayscale test image and colorizing it...")
		test_in = Path.cwd() / "test_input.png"
		test_out = Path.cwd() / "test_output.png"
		create_synthetic_test(test_in)
		# Try to ensure models (best-effort)
		ensure_models(models_dir)
		try:
			colorize_file(test_in, test_out, models_dir)
			print(f"Test complete. Output: {test_out}")
			return 0
		except Exception as ex:
			print(f"Colorization test failed: {ex}")
			return 2

	if not args.input or not args.output:
		print("Either provide --test or both --input and --output. See --help")
		return 1

	input_path = args.input
	output_path = args.output

	# Try to ensure models; if not available script will use fallback
	ensure_models(models_dir)
	try:
		out = colorize_file(input_path, output_path, models_dir)
		print(f"Saved colorized image to: {out}")
		return 0
	except Exception as ex:
		print(f"Failed to colorize: {ex}")
		return 2


if __name__ == "__main__":
	raise SystemExit(main())

