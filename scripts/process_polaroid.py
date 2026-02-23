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
    
    # Detected white frame boundaries from analyze script:
    # White Frame: top=63, left=104, width=434, height=514
    crop_top, crop_left = 63, 104
    crop_width, crop_height = 434, 514
    
    # Crop the image to remove the black outer background
    img = img.crop((crop_left, crop_top, crop_left + crop_width, crop_top + crop_height))
    
    datas = img.getdata()
    newData = []
    
    # Aggressive threshold to catch noise in black areas
    threshold = 100 
    
    for item in datas:
        # If it's near-black, make it fully transparent
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            newData.append((0, 0, 0, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(out_path, "PNG")
    print(f"Saved cropped and cleaned image to {out_path}")

if __name__ == "__main__":
    make_transparent(input_path, output_path)
