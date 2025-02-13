import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import ServerImage from '@/components/image/ServerImage';

// Using your dummy properties format
const dummyProperties = [
    {
        id: 1,
        title: 'Property 1',
        location: 'Location 1',
        price: 100000,
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 2,
        title: 'Property 2',
        location: 'Location 2',
        price: 200000,
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 3,
        title: 'Property 3',
        location: 'Location 3',
        price: 300000,
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 4,
        title: 'Property 4',
        location: 'Location 4',
        price: 400000,
        image: 'https://via.placeholder.com/150',
    },
    {
        id: 5,
        title: 'Property 5',
        location: 'Location 5',
        price: 500000,
        image: 'https://via.placeholder.com/150',
    },
];

export default function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [thumbnailPath, setThumbnailPath] = useState('');

    const [feedProperties, setFeedProperties] = useState([]);

    // When this component will mount for first time, it will
    // automatically fetch the properties from the database

    useEffect(() => {
        //TODO: IMPLEMENT THSI LATER

        const handleFetchProperties = async () => {
            try {
                // Fetch properties from the database

                const response = await axios.get('/property');

                setFeedProperties(response.data?.data?.properties || []);
                setThumbnailPath(response.data?.data?.thumbnailPath || '');
            } catch (err) {
                console.error('Error fetching properties:', err);
            }
        };
        handleFetchProperties();
    }, []);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle search when debounced query changes
    useEffect(() => {
        if (debouncedQuery) {
            handleSearch();
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [debouncedQuery]);

    const handleSearch = useCallback(async () => {
        try {
            setIsSearching(true);

            const response = await axios.get(`/property/search?q=${debouncedQuery}`);

            // console.log(response.data.data.properties)
            setSuggestions(response.data.data.properties || []);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    }, [debouncedQuery]);

    const handlePropertySelect = (property) => {
        setSearchQuery(property.title);
        setShowSuggestions(false);
        // Handle property selection (e.g., navigate to property details)
        // console.log('Selected property:', property);

        router.push(`/property/${property.id}`);
    };

    return (
        <View style={styles.container}>
            {/* Sticky Search Section */}
            <View style={styles.searchWrapper}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            setShowSuggestions(true);
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setSearchQuery('');
                                setSuggestions([]);
                                setShowSuggestions(false);
                            }}
                            style={styles.clearButton}>
                            <Ionicons name="close-circle" size={20} color="gray" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Suggestions */}

                {showSuggestions && suggestions.length > 0 ? (
                    <View style={styles.suggestionsContainer}>
                        {suggestions.map((property) => (
                            <TouchableOpacity
                                key={property.id}
                                style={styles.suggestionItem}
                                onPress={() => handlePropertySelect(property)}>
                                <View style={styles.propertyInfo}>
                                    <Text style={styles.propertyTitle}>{property.title}</Text>
                                    {/* <Text style={styles.propertyLocation}>{property.location}</Text>
                                    <Text style={styles.propertyPrice}>
                                        ${property.price.toLocaleString()}
                                    </Text> */}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <>
                        {showSuggestions && (
                            <View style={styles.suggestionItem}>
                                <View style={styles.propertyInfo}>
                                    <Text style={styles.propertyTitle}>
                                        No matching results found
                                    </Text>
                                </View>
                            </View>
                        )}
                    </>
                )}
            </View>

            {/* Scrollable Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View>
                    {feedProperties.map((feedProperty, propertyIndex) => {
                        return (
                            <View key={feedProperty.id} style={styles.propertyCard}>
                                <ServerImage
                                    path={`${thumbnailPath}/${feedProperty.thumbnail_image}`}
                                    style={styles.propertyImage}
                                    contentFit="cover"
                                />
                                <View style={styles.cardOverlay} />
                                <View style={styles.priceTag}>
                                    <Text style={styles.propertyPrice}>
                                        {feedProperty.price.toLocaleString()} INR
                                    </Text>
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.propertyTitle} numberOfLines={1}>
                                        {feedProperty.title}
                                    </Text>
                                    <View style={styles.locationContainer}>
                                        <Ionicons name="location" size={16} color="#666" />
                                        <Text style={styles.propertyLocation} numberOfLines={1}>
                                            {feedProperty.location}
                                        </Text>
                                    </View>

                                    <View style={styles.propertyFeatures}>
                                        <View style={styles.featureItem}>
                                            <Ionicons name="bed-outline" size={16} color="#666" />
                                            <Text style={styles.featureText}>3 beds</Text>
                                        </View>
                                        <View style={styles.featureItem}>
                                            <Ionicons name="water-outline" size={16} color="#666" />
                                            <Text style={styles.featureText}>2 baths</Text>
                                        </View>
                                        <View style={styles.featureItem}>
                                            <Ionicons
                                                name="square-outline"
                                                size={16}
                                                color="#666"
                                            />
                                            <Text style={styles.featureText}>1,500 sqft</Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() =>
                                                router.push(`/property/${feedProperty.id}`)
                                            }
                                            style={styles.showMoreButton}>
                                            <Ionicons
                                                name="arrow-forward-circle"
                                                size={16}
                                                color="#007AFF"
                                            />
                                            <Text style={styles.showMoreText}>Show More</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchWrapper: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        zIndex: 1, // Ensure suggestions appear above content
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    clearButton: {
        padding: 5,
    },
    suggestionsContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    suggestionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    propertyInfo: {
        gap: 4,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#333',
    },
    propertyLocation: {
        fontSize: 14,
        color: '#666',
    },
    propertyPrice: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    content: {
        flex: 1,
        paddingTop: 20,
    },
    text: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
    },
    propertyCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 20,
        height: 320, // Fixed height
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
        position: 'relative',
    },
    propertyImage: {
        width: '100%',
        height: 180, // Fixed height for image
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    cardOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 180,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    priceTag: {
        position: 'absolute',
        top: 150,
        left: 15,
        backgroundColor: '#007AFF',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    propertyPrice: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardContent: {
        padding: 15,
        paddingTop: 20,
    },
    propertyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    propertyLocation: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
        flex: 1,
    },
    propertyFeatures: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#666',
    },
    showMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f8ff',
        padding: 8,
        borderRadius: 20,
        marginLeft: 'auto',
    },
    showMoreText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
});
