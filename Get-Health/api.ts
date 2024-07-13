import axios from 'axios';

// Replace with your Flask backend URL and port
const API_URL = 'http://192.168.1.107:5001/api/data';  // Change the port if necessary

export const sendDataToServer = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error sending data to server:', error);
        throw error;
    }
};
