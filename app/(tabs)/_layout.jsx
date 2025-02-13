import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            styles={styles.tabs}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0',
                },
                headerStyle: {
                    backgroundColor: 'white',
                },
                headerTitleAlign: 'center',
            }}>
            <Tabs.Screen
                name="search"
                screenOptions={{ headerShown: false }}
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                screenOptions={{ headerShown: false }}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabs: {
        paddingTop: 10,
        paddingBottom: 10,
    },
});
