import sys
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw

def create_feathered_mask(size, feather_amount):
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rectangle([feather_amount, feather_amount, size[0] - feather_amount, size[1] - feather_amount], fill=255)
    return mask.filter(ImageFilter.GaussianBlur(feather_amount))

def process_image(input_path, output_path):
    print("Processing image with Pillow...")
    img = Image.open(input_path).convert("RGBA")
    
    # Crop to 4:5 aspect ratio
    w, h = img.size
    target_aspect = 4/5
    if w/h > target_aspect:
        new_w = int(h * target_aspect)
        img = img.crop(((w - new_w) // 2, 0, (w + new_w) // 2, h))
    else:
        new_h = int(w / target_aspect)
        img = img.crop((0, (h - new_h) // 2, w, (h + new_h) // 2))
    
    # Enhancements
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.4)
    
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.1)
    
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.1)
    
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.03)
    
    # Soft edge feathering (alpha mask)
    mask = create_feathered_mask(img.size, feather_amount=int(min(img.size) * 0.08))
    
    r, g, b, a = img.split()
    img = Image.merge("RGBA", (r, g, b, mask))
    
    img.save(output_path, "PNG")
    print(f"Saved enhanced image to {output_path}")

if __name__ == "__main__":
    process_image(sys.argv[1], sys.argv[2])
