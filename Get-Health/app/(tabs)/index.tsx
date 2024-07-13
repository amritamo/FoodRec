import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Button, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [response, setResponse] = useState<any[]>([]);
  const [permission, setPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    if (permission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0];
        setSelectedImage(uri);
      }
    } else {
      alert('Permission to access media library is required!');
    }
  };

  const handleSendData = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      try {
        const response = await fetch('http://192.168.1.107:5001/api/classify', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const result = await response.json();

        // Check the format of the response
        if (result.food_items && Array.isArray(result.food_items)) {
          setResponse(result.food_items);
        } else {
          console.error('Unexpected response format:', result);
          setResponse([]);
        }
      } catch (error) {
        console.error('Error sending data to server:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
      <Button title="Send Data" onPress={handleSendData} />
      {response.length > 0 ? (
        <View>
          {response.map((item, index) => (
            <View key={index} style={styles.resultContainer}>
              <Text>Name: {item.name}</Text>
              <Text>Nutritional Facts: {JSON.stringify(item.nutritional_facts)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text>No results or an error occurred.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
});

