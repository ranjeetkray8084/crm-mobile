import React, { useState, useEffect } from 'react';
import { Image, ImageProps } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthenticatedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  fallbackSource?: any;
  onError?: (error: any) => void;
  onLoad?: () => void;
}

const AuthenticatedImage: React.FC<AuthenticatedImageProps> = ({
  uri,
  fallbackSource,
  onError,
  onLoad,
  ...props
}) => {
  const [imageSource, setImageSource] = useState<any>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadAuthenticatedImage();
  }, [uri]);

  const loadAuthenticatedImage = async () => {
    try {
      setHasError(false);

      // Get the auth token
      const token = await AsyncStorage.getItem('token');
      
      if (token) {
        // Use the token in the image source headers
        console.log('🔧 Using authenticated image source');
        setImageSource({
          uri: uri,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // No token, use regular URI
        console.log('🔧 No token found, using regular URI');
        setImageSource({ uri: uri });
      }
    } catch (error) {
      console.log('🔧 Error setting up authenticated image:', error);
      // Fallback to regular URI
      setImageSource({ uri: uri });
    }
  };

  const handleError = (error: any) => {
    console.log('🔧 Image error:', error);
    setHasError(true);
    if (onError) {
      onError(error);
    }
  };

  const handleLoad = () => {
    console.log('🔧 Image loaded successfully');
    if (onLoad) {
      onLoad();
    }
  };

  // If we have an error and a fallback, use the fallback
  if (hasError && fallbackSource) {
    return (
      <Image
        source={fallbackSource}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    );
  }

  // If we have a valid image source, use it
  if (imageSource) {
    return (
      <Image
        source={imageSource}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    );
  }

  // Loading state - show fallback
  return (
    <Image
      source={fallbackSource || require('../../../assets/images/icon.png')}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default AuthenticatedImage;
