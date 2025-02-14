import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Linking,
    ActivityIndicator,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

import ServerImage from '@/components/image/ServerImage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastCotext';

const { width } = Dimensions.get('window');

export default function PropertyDetails() {
    const { id } = useLocalSearchParams();

    const { showSuccessToast, showErrorToast, showWarningToast } = useToast();

    const { authState } = useAuth();

    let [property, setProperty] = useState(null);
    let [thumbnailPath, setThumbnailPath] = useState('');
    let [galleryPath, setGalleryPath] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            const response = await axios.get(`/property/p/${id}`);

            const { success, statusCode, message, data } = response.data;
            console.log(data.thumbnailPath);
            if (success) {
                setProperty(data.property);
                setThumbnailPath(data.thumbnailPath);
                setGalleryPath(data.galleryPath);
            } else {
                // TODO: Implement this later show message from backend
            }
        };

        fetchProperty();

        return () => {
            setProperty(null);
        };
    }, [id]);

    const handleCallAgent = async () => {
        try {
            if (!authState?.authenticated) {
                // console.error('Kindly login first for calling');
                showWarningToast('Kindly login first for calling');
                return;
            }
            const phoneNumber = property?.owner_contact.replace(/\s+/g, ''); // Remove spaces
            await Linking.openURL(`tel:${phoneNumber}`);
        } catch (err) {
            console.error('Error opening phone dialer:', err);
        }
    };

    return (
        <View style={styles.container}>
            {!property ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading property details...</Text>
                </View>
            ) : (
                <>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Image Gallery */}
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            style={styles.imageGallery}>
                            <ServerImage
                                path={`${thumbnailPath}/${property.thumbnail_image}`}
                                style={styles.propertyImage}
                            />
                        </ScrollView>

                        {/* Property Details */}
                        <View style={styles.detailsContainer}>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{property.status}</Text>
                                <Text style={styles.propertyType}>{property.type}</Text>
                            </View>

                            <Text style={styles.title}>{property.title}</Text>
                            <Text style={styles.price}>{property.price.toLocaleString()} INR</Text>

                            {/* Location */}
                            <View style={styles.locationContainer}>
                                <Ionicons name="location" size={20} color="#007AFF" />
                                <Text
                                    style={
                                        styles.location
                                    }>{`${property.address}, ${property.city}, ${property.state}, ${property.country}, ${property.zipcode}`}</Text>
                            </View>

                            {/* Key Features */}
                            <View style={styles.featuresGrid}>
                                <View style={styles.featureItem}>
                                    <Ionicons name="expand-outline" size={24} color="#666" />
                                    <Text style={styles.featureValue}>{property.area_sqft}</Text>
                                    <Text style={styles.featureLabel}>Sq Ft</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="bed-outline" size={24} color="#666" />
                                    <Text style={styles.featureValue}>{property.bedrooms}</Text>
                                    <Text style={styles.featureLabel}>Beds</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="water-outline" size={24} color="#666" />
                                    <Text style={styles.featureValue}>{property.bathrooms}</Text>
                                    <Text style={styles.featureLabel}>Baths</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="car-outline" size={24} color="#666" />
                                    <Text style={styles.featureValue}>
                                        {property.parking_spaces}
                                    </Text>
                                    <Text style={styles.featureLabel}>Parking</Text>
                                </View>
                            </View>

                            {/* Description */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>About This Property</Text>
                                <Text style={styles.description}>{property.description}</Text>
                            </View>

                            {/* Amenities Section */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Amenities</Text>
                                <View style={styles.amenitiesContainer}>
                                    {property.amenities &&
                                        property.amenities.map((amenity, index) => (
                                            <View key={index} style={styles.amenityItem}>
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={20}
                                                    color="#007AFF"
                                                />
                                                <Text style={styles.amenityText}>{amenity}</Text>
                                            </View>
                                        ))}
                                </View>
                            </View>

                            {/* Agent Info */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Owner</Text>
                                <View style={styles.agentContainer}>
                                    <Ionicons name="person-circle" size={50} color="#007AFF" />
                                    <View style={styles.agentInfo}>
                                        <Text style={styles.agentName}>{property.owner_name}</Text>
                                        <Text style={styles.agentContact}>
                                            {authState.authenticated
                                                ? property.owner_contact
                                                : property.owner_contact?.slice(0, -4) + 'XXXX'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Floating Contact Button */}
                    <TouchableOpacity style={styles.floatingButton} onPress={handleCallAgent}>
                        <Ionicons name="chatbubble-ellipses" size={24} color="white" />
                        <Text style={styles.buttonText}>Contact Agent</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageGallery: {
        height: 300,
    },
    propertyImage: {
        width: width,
        height: 300,
    },
    detailsContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    price: {
        fontSize: 22,
        color: '#007AFF',
        fontWeight: '600',
        marginBottom: 15,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    location: {
        fontSize: 16,
        color: '#666',
        marginLeft: 5,
        flex: 1,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    featuresGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        marginVertical: 20,
    },
    featureItem: {
        alignItems: 'center',
    },
    featureValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 5,
    },
    featureLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },

    amenitiesContainer: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
    },
    amenityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        width: '50%',
    },
    amenityText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
    },
    agentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
    },
    agentInfo: {
        marginLeft: 15,
    },
    agentName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    agentContact: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#666',
        fontWeight: '800',
    },
    statusBadge: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    statusText: {
        backgroundColor: '#007AFF',
        color: 'white',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        fontSize: 14,
        fontWeight: '600',
    },
    propertyType: {
        backgroundColor: '#34C759',
        color: 'white',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        fontSize: 14,
        fontWeight: '600',
    },
    ownerContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    ownerInfo: {
        marginLeft: 15,
        flex: 1,
    },
    ownerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    ownerContact: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    reraContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    reraText: {
        color: '#4CAF50',
        marginLeft: 5,
        fontSize: 14,
        fontWeight: '500',
    },
});
