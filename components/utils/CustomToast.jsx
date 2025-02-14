import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const CustomToast = ({ message, type = "success", visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onClose());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, onClose]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, styles[type], { opacity: fadeAnim }]}>
      <Text style={[styles.text, styles[`${type}Text`]]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: '10%',
    right: '10%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backgroundColor: '#fff', // White background for full notification box
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  success: {
    borderWidth: 2,
    borderColor: '#10B981', // Green border
  },
  error: {
    borderWidth: 2,
    borderColor: '#EF4444', // Red border
  },
  warning: {
    borderWidth: 2,
    borderColor: '#F59E0B', // Yellow border
  },
  successText: {
    color: '#10B981', // Green text
  },
  errorText: {
    color: '#EF4444', // Red text
  },
  warningText: {
    color: '#F59E0B', // Yellow text
  },
});

export default CustomToast;
