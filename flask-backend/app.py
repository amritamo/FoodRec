from flask import Flask, request, jsonify
from inference_sdk import InferenceHTTPClient
import os

app = Flask(__name__)
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="MVFQf6G5SPZkEEqT013F"
)

# Define the path to the directory where uploaded images will be stored
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/classify', methods=['POST'])
def classify_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file found'}), 400
    
    file = request.files['image']
    file_path = os.path.join(UPLOAD_FOLDER, 'photo.jpg')
    file.save(file_path)

    # Perform inference
    result = CLIENT.infer(file_path, model_id='aicook-lcv4d/3')

    # Process and structure the results
    food_items = []
    for prediction in result['predictions']:
        food_items.append({
            'name': prediction['class'],
            # 'nutritional_facts': {
            #     'calories': 100,  # Example value, replace with actual facts
            #     'protein': 1,     # Example value, replace with actual facts
            #     'fat': 0.5,       # Example value, replace with actual facts
            #     'carbs': 25       # Example value, replace with actual facts
            # }
        })

    return jsonify({'food_items': food_items})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)


