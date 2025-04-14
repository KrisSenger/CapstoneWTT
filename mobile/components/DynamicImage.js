import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';

const DynamicImage = ({ imageUri }) => {
  const [height, setHeight] = useState(200); // default value

  useEffect(() => {
    Image.getSize(imageUri, (width, height) => {
      // Calculate the height based on the fixed width of 200 while preserving aspect ratio.
      const computedHeight = 200 * (height / width);
      setHeight(computedHeight);
    }, (error) => {
      console.error("Failed to get image dimensions:", error);
    });
  }, [imageUri]);

  return (
    <Image
      source={{ uri: imageUri }}
      style={{ width: 200, height, resizeMode: 'contain', margin: 10 }}
    />
  );
};

export default DynamicImage;
