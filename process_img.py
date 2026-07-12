import sys
from PIL import Image, ImageEnhance, ImageFilter

def process_image(input_path, output_path):
    print("Processing image with Pillow...")
    img = Image.open(input_path).convert("RGBA")
    
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.5)
    
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.1)
    
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.05)
    
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.05)
    
    alpha = img.split()[-1]
    alpha = alpha.filter(ImageFilter.GaussianBlur(radius=1.5))
    
    r, g, b, _ = img.split()
    img = Image.merge("RGBA", (r, g, b, alpha))
    
    img.save(output_path, "PNG")
    print(f"Saved enhanced image to {output_path}")

if __name__ == "__main__":
    process_image(sys.argv[1], sys.argv[2])
