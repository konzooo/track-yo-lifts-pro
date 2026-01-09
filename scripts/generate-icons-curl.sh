#!/bin/bash
# Generate icons using curl and a web-based SVG to PNG converter

PUBLIC_DIR="$(cd "$(dirname "$0")/.." && pwd)/public"
SVG_FILE="$PUBLIC_DIR/icon.svg"

if [ ! -f "$SVG_FILE" ]; then
  echo "Error: icon.svg not found at $SVG_FILE"
  exit 1
fi

echo "Generating icons..."

# Encode SVG to base64
SVG_BASE64=$(base64 < "$SVG_FILE")

# Sizes to generate
sizes=(32 180 192 512)
names=("favicon-32.png" "apple-touch-icon.png" "icon-192.png" "icon-512.png")

for i in "${!sizes[@]}"; do
  size=${sizes[$i]}
  name=${names[$i]}
  
  echo "Generating $name (${size}x${size})..."
  
  # Use a simple SVG to PNG conversion service
  # Note: This is a placeholder - you may need to use a different service
  curl -s "https://api.svg2png.com/v1/convert" \
    -H "Content-Type: application/json" \
    -d "{\"svg\":\"$SVG_BASE64\",\"width\":$size,\"height\":$size}" \
    --output "$PUBLIC_DIR/$name" 2>/dev/null || {
    echo "  ⚠️  Could not generate $name automatically"
    echo "  Please use the HTML generator at http://localhost:8080/generate-icons.html"
  }
done

echo ""
echo "Icon generation complete!"
echo "If any icons failed, please use the HTML generator at:"
echo "  http://localhost:8080/generate-icons.html"
