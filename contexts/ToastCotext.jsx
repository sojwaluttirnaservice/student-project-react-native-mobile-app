// ToastContext.js
import CustomToast from '@/components/utils/CustomToast';
import React, { createContext, useContext, useState } from 'react';

// Create a context for Toast Notifications
const ToastContext = createContext();

// Provider to manage the Toast state globally
export const useToast = () => {
    return useContext(ToastContext);
};

// ToastProvider to wrap your app
export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', type: '', visible: false });

    // Function to show success toast
    const showSuccessToast = (message) => {
        setToast({ message, type: 'success', visible: true });
    };

    // Function to show error toast
    const showErrorToast = (message) => {
        setToast({ message, type: 'error', visible: true });
    };

    // Function to show warning toast
    const showWarningToast = (message) => {
        setToast({ message, type: 'warning', visible: true });
    };

    // Function to hide the toast
    const hideToast = () => {
        setToast({ ...toast, visible: false });
    };

    return (
        <ToastContext.Provider value={{ showSuccessToast, showErrorToast, showWarningToast }}>
            {children}
            <CustomToast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={hideToast}
            />
        </ToastContext.Provider>
    );
};
