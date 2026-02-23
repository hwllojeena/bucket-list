from PIL import Image
import os

input_path = r"d:\REGINA\Web App\bucket-list\public\images\polaroid-template.png"

def get_dimensions(img_path):
    if not os.path.exists(img_path):
        print(f"File not found: {img_path}")
        return

    img = Image.open(img_path)
    width, height = img.size
    print(f"Dimensions: {width}x{height}")
    
    # Try to find the black cutout boundaries
    img = img.convert("RGBA")
    datas = img.getdata()

    # Find white frame boundaries
    white_min_x, white_min_y = width, height
    white_max_x, white_max_y = 0, 0
    
    # "White" pixels (high values)
    white_threshold = 200
    
    for y in range(height):
        for x in range(width):
            pixel = datas[y * width + x]
            if pixel[0] > white_threshold and pixel[1] > white_threshold and pixel[2] > white_threshold:
                if x < white_min_x: white_min_x = x
                if y < white_min_y: white_min_y = y
                if x > white_max_x: white_max_x = x
                if y > white_max_y: white_max_y = y
    
    print(f"White Frame: top={white_min_y}, left={white_min_x}, width={white_max_x-white_min_x}, height={white_max_y-white_min_y}")
    
    # Find inner black cutout boundaries (within the white frame)
    inner_min_x, inner_min_y = width, height
    inner_max_x, inner_max_y = 0, 0
    black_threshold = 50
    
    for y in range(white_min_y + 10, white_max_y - 10):
        for x in range(white_min_x + 10, white_max_x - 10):
            pixel = datas[y * width + x]
            if pixel[0] < black_threshold and pixel[1] < black_threshold and pixel[2] < black_threshold:
                if x < inner_min_x: inner_min_x = x
                if y < inner_min_y: inner_min_y = y
                if x > inner_max_x: inner_max_x = x
                if y > inner_max_y: inner_max_y = y
                
    if inner_max_x > inner_min_x:
        print(f"Inner Cutout (relative to frame):")
        print(f"  top: {(inner_min_y - white_min_y)/(white_max_y - white_min_y):.2%}")
        print(f"  left: {(inner_min_x - white_min_x)/(white_max_x - white_min_x):.2%}")
        print(f"  width: {(inner_max_x - inner_min_x)/(white_max_x - white_min_x):.2%}")
        print(f"  height: {(inner_max_y - inner_min_y)/(white_max_y - white_min_y):.2%}")

if __name__ == "__main__":
    get_dimensions(input_path)
