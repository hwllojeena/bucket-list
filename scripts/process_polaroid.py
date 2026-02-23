from PIL import Image
import os

input_path = r"d:\REGINA\Web App\bucket-list\public\images\polaroid-template.png"
output_path = r"d:\REGINA\Web App\bucket-list\public\images\polaroid-template-transparent.png"

def make_transparent(img_path, out_path):
    if not os.path.exists(img_path):
        print(f"File not found: {img_path}")
        return

    img = Image.open(img_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    newData = []
    
    # Threshold for "black" pixels
    threshold = 80 # More aggressive to catch noise
    
    for item in datas:
        # Check if the pixel is near-black
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            # Set alpha to 0 (fully transparent)
            newData.append((0, 0, 0, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(out_path, "PNG")
    print(f"Saved transparent image to {out_path}")

if __name__ == "__main__":
    make_transparent(input_path, output_path)
