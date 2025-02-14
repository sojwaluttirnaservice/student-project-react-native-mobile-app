import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Create a context
const NotificationContext = createContext();

// Provider to wrap your components
export const useNotification = () => {
    return useContext(NotificationContext);
};

// NotificationProvider component to wrap around app
export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);
    const [notificationResponse, setNotificationResponse] = useState(null);

    // Request Notification Permission on app load
    useEffect(() => {
        const requestPermission = async () => {
            await Notifications.requestPermissionsAsync();
        };
        requestPermission();

        // Listen to notifications while app is running in the foreground
        const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        // Listen for notification responses (when tapped)
        const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
            setNotificationResponse(response);
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    // Function to send notification
    const sendNotification = async (title, body, status) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: 'default',
                priority: 'high',
                badge: 1,
            },
            trigger: null, // Immediately trigger the notification
        });
    };

    const sendSuccessNotification = async () => {
        await sendNotification("Success", "Your operation was successful!", "success");
    };

    const sendErrorNotification = async () => {
        await sendNotification("Error", "Something went wrong. Please try again.", "error");
    };

    return (
        <NotificationContext.Provider value={{
            notification,
            notificationResponse,
            sendSuccessNotification,
            sendErrorNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
