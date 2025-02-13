import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
    // const { authState } = useAuth();

    // // If not logged in, redirect to login page
    // if (!authState.authenticated) {
    //     return <Redirect href="/user/login" />;
    // }

    // If logged in, show the home page
    return <Redirect href="/(tabs)/search" />;
}
