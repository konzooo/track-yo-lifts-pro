#!/usr/bin/env python3
"""
Generate PNG icons from SVG for TrackYoLifts Pro
Requires: cairosvg or svglib (install with: pip install cairosvg)
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    import cairosvg
except ImportError:
    print("Installing cairosvg...")
    os.system("pip3 install cairosvg")
    import cairosvg

public_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public')
svg_path = os.path.join(public_dir, 'icon.svg')

if not os.path.exists(svg_path):
    print(f"Error: {svg_path} not found")
    sys.exit(1)

# Generate icons
sizes = [
    (32, 'favicon-32.png'),
    (180, 'apple-touch-icon.png'),
    (192, 'icon-192.png'),
    (512, 'icon-512.png'),
]

print("Generating icons...")
for size, filename in sizes:
    output_path = os.path.join(public_dir, filename)
    cairosvg.svg2png(url=svg_path, write_to=output_path, output_width=size, output_height=size)
    print(f"✓ Generated {filename} ({size}x{size})")

print("\nAll icons generated successfully!")
