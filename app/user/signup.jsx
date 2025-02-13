import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        console.log('Sign Up:', { username, password });

        // Add your login logic here
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Create Account</Text>

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

                <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => router.push('/user/login')}>
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={styles.loginLink}>Login</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.backToHomeButton}
                    onPress={() => router.push('/(tabs)/search')}
                >
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

    signUpButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    signUpButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },

    loginButton: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
    },

    loginText: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },

    loginLink: {
        color: '#007AFF',
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
