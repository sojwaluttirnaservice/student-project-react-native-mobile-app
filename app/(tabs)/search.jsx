import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import ServerImage from '@/components/image/ServerImage';
import { toast } from '@/components/utils/toast';
import { useNotification } from '@/contexts/NotificationContext';
import { useToast } from '@/contexts/ToastCotext';

export default function Search() {
    const { showSuccessToast, showErrorToast, showWarningToast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [thumbnailPath, setThumbnailPath] = useState('');

    const [feedProperties, setFeedProperties] = useState(null);

    const [filters, setFilters] = useState({
        status: null,
        type: null,
        priceRange: null,
    });

    // Property status options
    const statusOptions = [
        { label: 'For Sale', value: 'For Sale' },
        { label: 'For Rent', value: 'For Rent' },
        { label: 'Sold', value: 'Sold' },
        { label: 'Rented', value: 'Rented' },
    ];

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
            // Set the state to indicate that the search is in progress
            setIsSearching(true);

            // Dynamically build the query parameters for the API request
            const queryParams = {
                // If debouncedQuery exists, add 'q' parameter to the query
                ...(debouncedQuery && { q: debouncedQuery }),

                // If filters.status exists, add 'status' parameter to the query
                ...(filters.status && { status: filters.status }),

                // If filters.type exists, add 'type' parameter to the query
                ...(filters.type && { type: filters.type }),

                // If filters.priceRange exists, add 'price' parameter to the query
                ...(filters.priceRange && { price: filters.priceRange }),

                // Always include a 'limit' parameter to limit the results
                limit: 5,
            };

            // Convert the queryParams object into a query string,
            // removing any null or undefined values
            const queryString = Object.entries(queryParams)
                .filter(([_, value]) => value != null) // Filter out any key-value pairs where the value is null or undefined
                .map(([key, value]) => `${key}=${value}`) // Convert the key-value pairs into a 'key=value' format
                .join('&'); // Join all the parameters together with '&'

            // Make the GET request to the backend with the constructed query string
            const response = await axios.get(`/property/search?${queryString}`);

            // If the response contains properties, set them as suggestions
            setSuggestions(response.data.data.properties || []);

            // Show the suggestions list after receiving the response
            setShowSuggestions(true);
        } catch (error) {
            // Log any errors that occur during the search request
            // console.error('Search error:', error);
            if (error.response) {
                showErrorToast(error.response.data.message);
            }
        } finally {
            // Set the state to indicate that the search is complete (whether successful or not)
            setIsSearching(false);
        }
    }, [debouncedQuery, filters]); // The search function depends on debouncedQuery and filters

    const handlePropertySelect = (property) => {
        setSearchQuery(
            `${property.address}, ${property.city}, ${property.state}, ${property.country}, ${property.zipcode}`
        );

        let queryParams = {
            address: property.address,
            city: property.city,
            state: property.state,
            country: property.country,
            zipcode: property.zipcode,
            status: filters.status || property.status,
        };

        let generateQuery = (object) => {
            return Object.entries(object)
                .map(([key, value]) => {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                })
                .join('&');
        };

        let searchQuery = generateQuery(queryParams);

        const handleSearch = async () => {
            try {
                const response = await axios.get(`/property/search?${searchQuery}&multiple=true`);

                console.log(response.data.data);
                setFeedProperties(response.data.data.properties || []);
            } catch (err) {
                console.error(err);
            }
        };

        handleSearch();

        setShowSuggestions(false);
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

                {/* Filter Pills */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterContainer}>
                    {statusOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.filterPill,
                                filters.status === option.value && styles.filterPillActive,
                            ]}
                            onPress={() => {
                                setFilters((prev) => ({
                                    ...prev,
                                    status: prev.status === option.value ? null : option.value,
                                }));
                            }}>
                            <Text
                                style={[
                                    styles.filterPillText,
                                    filters.status === option.value && styles.filterPillTextActive,
                                ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Suggestions */}

                {showSuggestions && suggestions.length > 0 ? (
                    <>
                        {/* <KeyboardAvoidingView
                            style={styles.container}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
                        <View style={styles.suggestionsContainer}>
                            {suggestions.map((property) => (
                                <TouchableOpacity
                                    key={property.id}
                                    style={styles.suggestionItem}
                                    onPress={() => handlePropertySelect(property)}>
                                    <View style={styles.propertyInfo}>
                                        <Text style={styles.propertyTitle}>{property.title}</Text>
                                        <Text style={styles.propertyLocation}>
                                            {`${property.address}, ${property.city}, ${property.state}, ${property.country}, ${property.zipcode}`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {/* </KeyboardAvoidingView> */}
                    </>
                ) : (
                    <>
                        {showSuggestions && (
                            <>
                                {/* <View style={styles.suggestionItem}>
                                    <View style={styles.propertyInfo}>
                                        <Text style={styles.propertyTitle}>
                                            No matching results found
                                        </Text>
                                    </View>
                                </View> */}
                            </>
                        )}
                    </>
                )}
            </View>

            {/* Scrollable Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View>
                    {!feedProperties && <ActivityIndicator size={40} />}
                    {feedProperties &&
                        feedProperties.map((feedProperty, propertyIndex) => {
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
                                                {`${feedProperty.address}, ${feedProperty.city}, ${feedProperty.state}, ${feedProperty.country}, ${feedProperty.zipcode}`}
                                            </Text>
                                        </View>

                                        <View style={styles.propertyFeatures}>
                                            <View style={styles.featureItem}>
                                                <Ionicons
                                                    name="bed-outline"
                                                    size={16}
                                                    color="#666"
                                                />
                                                <Text style={styles.featureText}>3 beds</Text>
                                            </View>
                                            <View style={styles.featureItem}>
                                                <Ionicons
                                                    name="water-outline"
                                                    size={16}
                                                    color="#666"
                                                />
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
        marginBottom: 6,
    },
    propertyLocation: {
        fontSize: 14,
        color: '#666',
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
    filterContainer: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    filterPillActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    filterPillText: {
        fontSize: 14,
        color: '#666',
    },
    filterPillTextActive: {
        color: '#fff',
    },
});
