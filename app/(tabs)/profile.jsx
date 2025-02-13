import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function Profile() {
    const { authState, onLogout } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={80} color="#007AFF" />
                </View>
                <Text style={styles.username}>
                    {authState.authenticated && authState?.user ? authState.user.name : 'Guest'}
                </Text>
                {authState.authenticated && authState?.user && (
                    <Text style={styles.email}>{authState?.user?.email}</Text>
                )}
            </View>

            <View style={styles.menuContainer}>
                {/* <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity> */}
                {/* 
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="help-circle-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>Help</Text>
                </TouchableOpacity> */}

                {authState.authenticated && (
                    <TouchableOpacity onPress={() => onLogout()} style={styles.menuItem}>
                        <Ionicons name="log-out-outline" size={24} color="#333" />
                        <Text style={styles.menuText}>Logout</Text>
                    </TouchableOpacity>
                )}

                {!authState.authenticated && (
                    <>
                        <TouchableOpacity
                            onPress={() => router.push('/user/login')}
                            style={styles.menuItem}>
                            <Ionicons name="log-out-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/user/signup')}
                            style={styles.menuItem}>
                            <Ionicons name="log-out-outline" size={24} color="#333" />
                            <Text style={styles.menuText}>Sign Up</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarContainer: {
        marginBottom: 10,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: 'gray',
        marginTop: 5,
    },
    menuContainer: {
        padding: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        fontSize: 16,
        marginLeft: 15,
        color: '#333',
    },
});
