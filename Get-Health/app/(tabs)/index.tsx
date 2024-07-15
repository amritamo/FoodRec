import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Button, Text, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
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

        // Filter the response to only include unique food items
        const uniqueFoodItems = result.food_items.reduce((acc: any[], current: any) => {
          const x = acc.find(item => item.name === current.name);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        // Check the format of the response
        if (uniqueFoodItems && Array.isArray(uniqueFoodItems)) {
          setResponse(uniqueFoodItems);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
      <Button title="Upload Image" onPress={handleSendData} />
      {response && (
        <View style={styles.resultsContainer}>
          {response.map((item: any, index: number) => (
            <View key={index} style={styles.resultContainer}>
              <Text style={styles.resultText}>Name: {item.name}</Text>
              <Text style={styles.resultText}>Nutritional Facts: {JSON.stringify(item.nutritional_facts)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  resultsContainer: {
    width: '100%',
    marginTop: 20,
  },
  resultContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  resultText: {
    fontSize: 16,
  },
});

