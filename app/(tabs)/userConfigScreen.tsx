import React, { useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from 'react-native-paper';
//import { Button } from 'react-native';
import * as Location from 'expo-location';

import Device from '../src/device';
const deviceSvc = new Device();

import { userSvc } from '../src/user';
import { UserConfigContext, useUserConfig } from '../src/UserConfigContext'; // Import the context hook



// -----------


const ConfigScreen = () => {
    const { userConfig, setUsername, setId, setPostcode, setGeofence } = useContext(UserConfigContext);

    
    useEffect(() => {{
            if (userConfig) {
                console.log('userConfig updated:', userConfig);
            }
        }
      }, [userConfig]);

    useEffect(() => {
        // Called on iniiial render to fetch the user details and update the state variables
        const fetchUserDetails = async () => {
            try {
                const userDetails = await userSvc.getUserDetailsByName('Bob');
                if (userDetails.username) {
                    setId(userDetails?.id);
                    setUsername(userDetails?.username);
                    setPostcode(userDetails?.postcode);
                    setGeofence(userDetails.geofence);
                } else {
                    console.error('No user details found');
                }
              } catch (error) {
                console.error('Error fetching user details:', error);
                console.log(new Error().stack.split(":")[3]); // This will log the stack trace including the line number
            }
        };
    
        fetchUserDetails();
    }, []);

    /*
    ** handleSubmitUserConfig()
    ** Function to handle the user config submission
    ** This function will call the geocodeAddress function to get the latitude and longitude of the given address
    ** and then create the user with the given details 
    */
    const handleSubmitUserConfig = async () => {
        console.log('Submit User Config:', userConfig?.username);

        // Call the geocodeAddress function
        try {
            const results = await Location.geocodeAsync(userConfig?.postcode);
        
            if (results.length > 0) {
                console.log('Geocoded Location:', results);

                // Update the context with geocoded location
                const { latitude, longitude } = results[0];
                userConfig.geofence.lat = latitude;
                userConfig.geofence.long = longitude;

                // Create the user
                userSvc.createUser(userConfig.username, userConfig.postcpde, userConfig.geofence)
                    .then(() => {
                        console.log("User created successfully");
                    })
                    .catch((error) => {
                        console.error("Error creating user:", JSON.stringify(error, null, 2));
                    });

            } else {
                console.error('Geocode not found for the given address.');
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
        }
    };

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // *******
        style={{ flex: 1 }} // *******
    >
        <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
            <Text style={styles.titleText}>User Config</Text>
            <View style={styles.inputGroup}>
                <Text style={styles.labelText}>UserName:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter a User name"
                    value={userConfig?.username || ''}
                    onChangeText={setUsername}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.labelText}>Postcode:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter a Postcode"
                    value={userConfig?.postcode || ''}
                    onChangeText={setPostcode}
                />
            </View>
            <View style={styles.geofenceGroup}>
                <Text style={styles.sectionTitle}>Geofence</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Geofence Name"
                        value={userConfig?.geofence.name || ''}
                        onChangeText={(text) => setGeofence({ name: text })}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Latitude:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Geofence Latitude"
                        value={userConfig?.geofence.lat.toString() || ''}
                        onChangeText={(text) => setGeofence({ lat: parseFloat(text) })}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Longitude:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Geofence Longitude"
                        value={userConfig?.geofence.long.toString() || ''}
                        onChangeText={(text) => setGeofence({ long: parseFloat(text) })}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Radius:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Geofence Radius"
                        value={userConfig?.geofence.radius.toString() || ''}
                        onChangeText={(text) => setGeofence({ radius: parseFloat(text) })}
                    />
                </View>
            </View>
            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitUserConfig}
            >
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
         </ScrollView>
         </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 15,
        backgroundColor: '#e0f7fa', // Light blue background
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#01579b', // Dark blue text
        marginBottom: 15,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0277bd', // Medium blue text
        marginBottom: 8,
    },
    inputGroup: {
        marginBottom: 10,
    },
    labelText: {
        fontSize: 16,
        color: '#0288d1', // Light blue text
        marginBottom: 4,
    },
    input: {
        fontSize: 14,
        padding: 8,
        borderWidth: 1,
        borderColor: '#81d4fa', // Light blue border
        borderRadius: 5,
        backgroundColor: '#ffffff', // White background for inputs
    },
    geofenceGroup: {
        marginTop: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#4fc3f7', // Light blue border
        borderRadius: 10,
        backgroundColor: '#b3e5fc', // Very light blue background
    },
    submitButton: {
        marginTop: 15,
        padding: 8,
        backgroundColor: '#0288d1', // Light blue button
        borderRadius: 5,
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#ffffff', // White text for button
    },
});

export default ConfigScreen;
