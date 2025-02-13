import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';

const ServerImage = ({ path, style, alt, ...otherProps }) => {
    const imageUrl = process.env.EXPO_PUBLIC_BACKEND_URL + path;
    // const imageUrl =  path;

   

    return (
        <Image
            source={imageUrl} // Use the full URL to fetch the image
            style={style} // Merge styles if any are passed as props
            alt={alt}
            {...otherProps}
        />
    );
};

export default ServerImage;
