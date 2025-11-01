from flask import Blueprint, request, current_app, Response

from PIL import Image
from io import BytesIO
import base64
import re
import numpy as np

from mlp import MLP

image_bp = Blueprint("image", __name__, template_folder="templates", url_prefix="/api")  

train = MLP()

@image_bp.route("/send-image", methods=["POST"])  
def post_image():  
    """  
    Upsert a file-content associated with the given key owned by the user.    
    If there is no user-id `uid` or file-content `content` given in the request body, return error message and status.    
    Otherwise, return the success message and success status    
    """    
    request_body = request.form.get('file')
    number = int(request.form.get('number'))

    # Process and resize image.
    img_base64 = re.search("data:image/png;base64,(.*)", request_body).group(1)
    im = Image.open(BytesIO(base64.b64decode(img_base64))).convert("RGBA")
    
    new_size = (28, 28)
    im = im.resize(new_size, Image.LANCZOS)
    alpha = im.split()[-1]  # take alpha channel

    pixel_array = np.asarray(alpha)
    pixel_array = (pixel_array - 0)/(255)
    print(pixel_array)
    response = Response(status=200)
    response.headers.add('Access-Control-Allow=Origin', '*')

    print("Number", number)
    train.train(pixel_array, number)
    return response
  