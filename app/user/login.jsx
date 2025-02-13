import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { onLogin } = useAuth();

    const handleLogin = async () => {
        // console.log('Login:', { username, password });
        // Add your login logic here
        await onLogin(username, password);
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={true}
                    keyboardType="default"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={true}
                />

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <Link href="/user/signup" asChild>
                        <TouchableOpacity>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <TouchableOpacity
                    style={styles.backToHomeButton}
                    onPress={() => router.push('/(tabs)/search')}>
                    <Ionicons name="arrow-back" size={20} color="#666" />
                    <Text style={styles.backToHomeText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 20,
    },

    formContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 15,
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },

    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
        color: '#000',
    },

    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },

    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },

    signupText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },

    signupLink: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },

    backToHomeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 20,
        gap: 8,
    },
    backToHomeText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
});
