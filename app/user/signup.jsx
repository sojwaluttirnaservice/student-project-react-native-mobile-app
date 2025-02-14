import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUp() {
    const { onSignup } = useAuth();

    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        gender: '',
    });

    const handleSignUp = async () => {
        await onSignup(userDetails);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={styles.formContainer}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Create Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={userDetails.name}
                    onChangeText={(text) => setUserDetails((prev) => ({ ...prev, name: text }))}
                    autoCapitalize="words"
                    autoCorrect={false}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={userDetails.email}
                    onChangeText={(text) => setUserDetails((prev) => ({ ...prev, email: text }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    value={userDetails.mobile}
                    onChangeText={(text) => setUserDetails((prev) => ({ ...prev, mobile: text }))}
                    keyboardType="phone-pad"
                    maxLength={10}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={userDetails.password}
                    onChangeText={(text) => setUserDetails((prev) => ({ ...prev, password: text }))}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {/* Gender Selection */}
                <View style={styles.genderContainer}>
                    <Text style={styles.genderLabel}>Gender</Text>
                    <View style={styles.genderOptions}>
                        {['Male', 'Female', 'Other'].map((gender) => (
                            <TouchableOpacity
                                key={gender}
                                style={[
                                    styles.genderOption,
                                    userDetails.gender === gender && styles.genderOptionSelected,
                                ]}
                                onPress={() =>
                                    setUserDetails((prev) => ({ ...prev, gender: gender }))
                                }>
                                <Text
                                    style={[
                                        styles.genderOptionText,
                                        userDetails.gender === gender &&
                                            styles.genderOptionTextSelected,
                                    ]}>
                                    {gender}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

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
                    onPress={() => router.push('/(tabs)/search')}>
                    <Ionicons name="arrow-back" size={20} color="#666" />
                    <Text style={styles.backToHomeText}>Back to Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },

    formContainer: {
        width: '100%',
        flexDirection: 'column',
        gap: 15,
        paddingBottom: 20, // Ensure there's padding at the bottom to prevent the last element from being hidden by the keyboard
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

    genderContainer: {
        marginVertical: 10,
    },
    genderLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    genderOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    genderOption: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    genderOptionSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    genderOptionText: {
        color: '#666',
        fontSize: 16,
    },
    genderOptionTextSelected: {
        color: '#fff',
    },
});
