from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

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
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    try:
        file.save(file_path)
        # Dummy response - replace with actual classification logic
        response = {
        "food_items": [
            {
            "name": "Apple",
            "nutritional_facts": {
                "calories": 52,
                "protein": 0.3
            }
            },
            {
            "name": "Banana",
            "nutritional_facts": {
                "calories": 89,
                "protein": 1.1
            }
            }
        ]
        }

        return jsonify(response), 200
    except Exception as e:
        print(f'Error saving file: {e}')
        return jsonify({'error': 'Failed to save file'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)


