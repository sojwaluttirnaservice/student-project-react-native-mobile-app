import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastCotext';

import { Stack } from 'expo-router';
import { Platform, StatusBar } from 'react-native';

export default function RootLayout() {
    return (
        <>
            <ToastProvider>
                <AuthProvider>
                    <StatusBar barStyle="dark-content" />
                    <Stack
                        screenOptions={{
                            headerShown: true,
                            headerTitleAlign: 'center',
                        }}>
                        <Stack.Screen
                            name="index"
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name="user/login"
                            options={{
                                headerShown: false,

                                title: 'Login',
                            }}
                        />
                        <Stack.Screen
                            name="user/signup"
                            options={{
                                headerShown: false,

                                title: 'Sign Up',
                            }}
                        />
                        <Stack.Screen
                            name="(tabs)"
                            options={{
                                headerShown: false,
                            }}
                        />

                        <Stack.Screen
                            name="property/[id]"
                            options={{
                                title: 'Property Details',
                                headerTitleAlign: 'center',
                                headerShown: false,
                            }}
                        />
                    </Stack>
                </AuthProvider>
            </ToastProvider>
        </>
    );
}
