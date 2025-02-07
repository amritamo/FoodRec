# Overview
The Smart Fridge Food Recommender is a mobile application that uses YOLOv5, an object detection model to identify foods inside a refrigerator, fetches their nutritional information, and recommends meals based on the user’s macronutrient goals. This project aims to provide a convenient way for users to manage their diet and make informed food choices.


## Steps to run the app

Clone the Repository
```
git clone https://github.com/yourusername/smart-food-recommender.git
cd FoodRec
```
Install Dependencies

Frontend
```
cd GetHealth
npm install
```
Backend
```
cd flask-backend
pip install -r requirements.txt
```
Run the Application

Start Backend (Flask Server)
```
cd flask-backend
python app.py
```
Start Frontend (Expo)
```
cd Get-Health
expo start
```
## Usage

Open the app on your mobile device.

Capture an image of your refrigerator using the camera.

The YOLOv5 model detects and classifies the food items, returning nutritional information.


## Future Improvements

Integrate a larger dataset for improved food classification.

Train model on a wider range of refrigerator views.

Integrate food API for a wider range of nutritional information.

Enhance UI/UX for better user experience.
