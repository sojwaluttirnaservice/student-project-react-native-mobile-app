// Importing necessary functions from React
import axios from 'axios';
import { router } from 'expo-router';

import * as SecureStore from 'expo-secure-store';

// Set default base URL for all axios requests
axios.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://your-api-url.com';

import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './ToastCotext';

// Creating an AuthContext using createContext() function
// This will be used to share authentication state throughout the app
const AuthContext = createContext();

// Custom hook that allows other components to easily access the AuthContext
// It uses `useContext` to get the current context value
export const useAuth = () => {
    return useContext(AuthContext); // This will return the current context value
};

let initialAuthState = {
    token: null, // string | null
    authenticated: null, // boolean | null
    user: null,
};
// AuthProvider component is a context provider that wraps around the components that need access to the AuthContext
// It provides the context value (authentication data) to its child components

const TOKEN_KEY = 'jwtToken';

export const AuthProvider = ({ children }) => {
    const { showSuccessToast, showErrorToast, showWarningToast } = useToast();

    const [authState, setAuthState] = useState(initialAuthState);

    let isDevProjectMode = process.env.EXPO_PUBLIC_PROJECT_ENV == 'DEV';

    // Use useEffect to load the token from the secure store if present
    useEffect(() => {
        const loadToken = async () => {
            let storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

            if (storedToken) {
                setAuthState((prevState) => ({
                    ...prevState,
                    token: storedToken,
                    authenticated: true,
                }));

                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
        };
        loadToken();
    }, []);

    const signup = async (signupData) => {
        try {
            const _response = await axios.post(`/auth/signup`, signupData);

            const { success, message, data } = _response.data;

            if (success) {
                // TODO: ADD THE TOASTIFY MESSAGE IN HERE
                showSuccessToast(message);
                router.push('/user/login');
            } else {
                console.log(message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const login = async (email, password, role = 'user') => {
        // Setting dummy values for testing when mode is of DEV
        // if (isDevProjectMode) {
        //     (email = 'john.doe@example.com'), (password = 'password123');
        // }

        try {
            const result = await axios.post(`/auth/login`, {
                email,
                password,
                role,
            });

            console.log(result.data.data);

            const { success, message, data } = result.data;

            const { token, user } = data;

            if (success) {
                showSuccessToast(message);
                // TODO: ADD THE TOASTIFY MESSAGE IN HERE
                setAuthState({
                    token,
                    authenticated: true,
                    user: user,
                });

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                await SecureStore.setItemAsync(TOKEN_KEY, token);

                router.push('/(tabs)/search');
            } else {
                //TODO: SHOW THE MESSAGE LATER
                showWarningToast(message);
            }

            return result;
        } catch (err) {
            // console.error(`Error while authenticating`, err.message);
            if (err?.response) {
                showErrorToast(err.response.data.message);
            }
            return err;
        }
    };

    const logout = async () => {
        try {
            // console.log('Clicking on logout');
            // DELETE THE TOKEN KEY
            await SecureStore.deleteItemAsync(TOKEN_KEY);

            // REMOVE THE HEADERS FROM THE AXIOS

            axios.defaults.headers.common['Authorization'] = '';

            // SET THE AUTH STATE TO INIITIAL LIKE WITHOUT LOGIN
            setAuthState(initialAuthState);
            showSuccessToast('Logged out successfully');
            router.push('/(tabs)/search');
        } catch (err) {
            // console.error(err);
            if (err?.response) {
                showErrorToast(err.response.data.message);
            }
        }
    };

    let value = {
        onSignup: signup,
        onLogin: login,
        onLogout: logout,
        authState,
        user: authState.user,
    }; // Value can hold authentication-related data (like user, token, etc.)

    // The AuthContext.Provider provides the `value` to all child components that call `useAuth`
    // Any child component inside AuthProvider can access the auth context via `useAuth`
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Exporting an empty object to avoid a warning in Expo Go when there are no exports
