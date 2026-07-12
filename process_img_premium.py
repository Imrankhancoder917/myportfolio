import sys
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw

def apply_vignette(img, vignette_strength=0.3):
    width, height = img.size
    vignette = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(vignette)
    
    # Create a radial gradient for vignette
    import math
    center_x, center_y = width / 2, height / 2
    max_radius = math.sqrt(center_x**2 + center_y**2)
    
    pixels = vignette.load()
    for y in range(height):
        for x in range(width):
            dist = math.sqrt((x - center_x)**2 + (y - center_y)**2)
            alpha = int(255 * (dist / max_radius) * vignette_strength)
            pixels[x, y] = 255 - min(alpha, 255)
            
    vignette = vignette.filter(ImageFilter.GaussianBlur(min(width, height) * 0.1))
    
    r, g, b, a = img.split()
    # Apply vignette by multiplying the alpha
    a_new = Image.blend(a, vignette, 0.5)
    return Image.merge("RGBA", (r, g, b, a))

def process_image(input_path, output_path):
    print("Processing image for premium cinematic look...")
    img = Image.open(input_path).convert("RGBA")
    
    # Cinematic HDR enhancements
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.6)  # Better sharpness
    
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.15)  # Premium HDR contrast
    
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.08)  # Cinematic color
    
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.02)  # Slight lighting correction
    
    # Soft vignette
    img = apply_vignette(img, 0.25)
    
    img.save(output_path, "PNG")
    print(f"Saved premium image to {output_path}")

if __name__ == "__main__":
    process_image(sys.argv[1], sys.argv[2])
