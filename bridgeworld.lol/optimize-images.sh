#!/bin/bash
# Image Optimization Script for Bridgeworld.lol
# Converts large PNG images to optimized WebP format

echo "🖼️  Optimizing Bridgeworld images..."

# Check if imagemagick or cwebp is available
if command -v cwebp &> /dev/null; then
    echo "Using cwebp for optimization..."
    
    # Optimize legion1.png
    if [ -f "img/legion1.png" ]; then
        echo "Converting legion1.png to WebP..."
        cwebp -q 85 -resize 2000 0 "img/legion1.png" -o "img/legion1.webp"
        if [ -f "img/legion1.webp" ]; then
            SIZE_OLD=$(du -h "img/legion1.png" | cut -f1)
            SIZE_NEW=$(du -h "img/legion1.webp" | cut -f1)
            echo "✅ legion1: $SIZE_OLD → $SIZE_NEW"
        fi
    fi
    
    # Optimize legion2.png
    if [ -f "img/legion2.png" ]; then
        echo "Converting legion2.png to WebP..."
        cwebp -q 85 -resize 2000 0 "img/legion2.png" -o "img/legion2.webp"
        if [ -f "img/legion2.webp" ]; then
            SIZE_OLD=$(du -h "img/legion2.png" | cut -f1)
            SIZE_NEW=$(du -h "img/legion2.webp" | cut -f1)
            echo "✅ legion2: $SIZE_OLD → $SIZE_NEW"
        fi
    fi
    
elif command -v convert &> /dev/null; then
    echo "Using ImageMagick for optimization..."
    
    # Optimize legion1.png
    if [ -f "img/legion1.png" ]; then
        echo "Converting legion1.png to WebP..."
        convert "img/legion1.png" -resize 2000x2000\> -quality 85 "img/legion1.webp"
        if [ -f "img/legion1.webp" ]; then
            SIZE_OLD=$(du -h "img/legion1.png" | cut -f1)
            SIZE_NEW=$(du -h "img/legion1.webp" | cut -f1)
            echo "✅ legion1: $SIZE_OLD → $SIZE_NEW"
        fi
    fi
    
    # Optimize legion2.png
    if [ -f "img/legion2.png" ]; then
        echo "Converting legion2.png to WebP..."
        convert "img/legion2.png" -resize 2000x2000\> -quality 85 "img/legion2.webp"
        if [ -f "img/legion2.webp" ]; then
            SIZE_OLD=$(du -h "img/legion2.png" | cut -f1)
            SIZE_NEW=$(du -h "img/legion2.webp" | cut -f1)
            echo "✅ legion2: $SIZE_OLD → $SIZE_NEW"
        fi
    fi
    
else
    echo "⚠️  No image optimization tools found (cwebp or ImageMagick)"
    echo "Install with:"
    echo "  Ubuntu/Debian: sudo apt-get install webp imagemagick"
    echo "  macOS: brew install webp imagemagick"
    echo "  Or use online tools to convert PNG to WebP"
fi

echo ""
echo "📊 Image sizes:"
du -h img/legion*.png img/legion*.webp 2>/dev/null | sort -h

echo ""
echo "💡 Tip: Update HTML to use .webp versions with .png fallback:"
echo '  <picture>'
echo '    <source srcset="img/legion1.webp" type="image/webp">'
echo '    <img src="img/legion1.png" alt="Legion">'
echo '  </picture>'
