import React, { useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
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
        <View>
            <Text style={styles.titleText}>User Config</Text>
            <Text style={styles.bodyText}>UserName:</Text>
            <TextInput
                style={styles.bodyText}
                placeholder="Enter a User name"
                value={userConfig?.username || ''}
                onChangeText={setUsername}
            />
            <Text style={styles.bodyText}>Postcode:</Text>
            <TextInput
                style={styles.bodyText}
                placeholder="Enter a Postcode"
                value={userConfig?.postcode || ''}
                onChangeText={setPostcode}
            />
            <Text style={styles.bodyText}>Geofence Name:</Text>
            <TextInput
                style={styles.bodyText}
                placeholder="Enter Geofence Name"
                value={userConfig?.geofence.name || ''}
                onChangeText={(text) => setGeofence({ name: text })}
            />
            <Text style={styles.bodyText}>Geofence Latitude:</Text>
            <TextInput
                style={styles.bodyText}
                placeholder="Enter Geofence Latitude"
                value={userConfig?.geofence.lat.toString() || ''}
                onChangeText={(text) => setGeofence({ lat: parseFloat(text) })}
            />
            <Text style={styles.bodyText}>Geofence Longitude:</Text>
            <TextInput
                style={styles.bodyText}
                placeholder="Enter Geofence Longitude"
                value={userConfig?.geofence.long.toString() || ''}
                onChangeText={(text) => setGeofence({ long: parseFloat(text) })}
            />
            <Text style={styles.bodyText}>Geofence Radius:</Text>
            <TextInput
                style={styles.bodyText}
                placeholder="Enter Geofence Radius"
                value={userConfig?.geofence.radius.toString() || ''}
                onChangeText={(text) => setGeofence({ radius: parseFloat(text) })}
            />
            <Button
                mode="contained"
                onPress={handleSubmitUserConfig}
                style={{ alignSelf: 'center' }}
            >
                <Text>Submit</Text>
            </Button>
        </View>
    );
/*
    return (
        <View>
            <Text style={styles.titleText}>User Config</Text>
            <Text style={styles.bodyText}>UserName:</Text>
            <TextInput
                style={styles.bodyText}
                placeholder="Enter a User name"
                value={userName}
                onChangeText={setUserName}
            />

            <Text style={styles.titleText}>Create Geofence</Text>

            <Text style={styles.bodyText}>Address:</Text>
            <TextInput
                style={styles.bodyText}
                placeholder="Enter your post code"
                value={address}
                onChangeText={setAddress}
            />

            <Text style={styles.bodyText}>Radius:</Text>
            <TextInput
                style={styles.bodyText}
                placeholder="Enter radius"
                value={radius.toString()}
                onChangeText={text => setRadius(Number(text))}
            />

            <Button
                mode="contained"
                onPress={handleSubmitUserConfig}
                style={{ alignSelf: 'center' }}
            >
                <Text>Submit</Text>
            </Button>
            <Text>Coords: {long}, {lat}</Text>
            <Text>Radius: {radius}</Text>
        </View>
    );
*/
};

const styles = StyleSheet.create({
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    bodyText: {
        fontSize: 20,
    },
});

/*
ConfigScreen.propTypes = {
    setUpdateUCStateCallback: PropTypes.func.isRequired,
};
*/
export default ConfigScreen;




/*
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';
//import { FloatingLabelInput } from 'react-native-floating-label-input';

import Device from '../src/device';
const deviceSvc = new Device();

// Import the User module or class
// import User from '../src/User';
import { userSvc } from '../src/user';

const ConfigScreen: React.FC = () => {
    const [address, setAddress] = useState('');
    const [{long, lat}, setCoords] = useState({'long': 0, 'lat': 0});
    const [geofence, setGeofence] = useState({	name: '', lat: 0, long: 0, radius: 0 });
    const [radius, setRadius] = useState(0);
    const [userName, setUserName] = useState('');

    const geocodeAddress = async (address: string) => {
        const results = await Location.geocodeAsync(address);
        console.log(`Latitude: ${results[0].latitude}`);
        console.log(`Longitude: ${results[0].longitude}`);
        console.log('accuracy:', results[0].accuracy);
        console.log('Geocoded Location:', results);

        setCoords({'long': results[0].longitude, 'lat': results[0].latitude});
        setGeofence({name: userName, lat: results[0].latitude, long: results[0].longitude, radius: radius});
      }
      
    // const geocodeEnteredAddress = () => {
    //     geocodeAddress(address);
    // }

    const handleSubmitUserConfig = () => {
        console.log('Submit User Config:', userName);
        geocodeAddress(address);
        userSvc.createUser(userName, { ...geofence, name: userName });
    }    
    
    return (
        <View>

            <Text style={styles.titleText}>User Config</Text>
            <Text style={styles.bodyText}>UserName:</Text>
            <TextInput style={styles.bodyText}
                placeholder="Enter an User name"
                value={userName}
                onChangeText={setUserName} />

            <Text style={styles.titleText}>Create Geofence</Text>

            <Text style={styles.bodyText}>Address:</Text>
            <TextInput style={styles.bodyText}
                placeholder="Enter an address"
                value={address}
                onChangeText={setAddress} />


            <Text style={styles.bodyText}>Radius:</Text>
            <TextInput style={styles.bodyText}
                placeholder="Enter radius"
                value={radius.toString()}
                onChangeText={text => setRadius(Number(text))} />

            <Button 
                mode="contained" 
                onPress={handleSubmitUserConfig}
                style={{alignSelf: 'center' }}
                >
                <Text>Submit</Text>
            </Button>
            <Text>Coords: {long}, {lat}</Text>
            <Text>Radius: {radius}</Text>
        </View>
    );
    
    
    // return (
    //     <View style={{ padding: 50, flex: 1, backgroundColor: '#fff' }}>
    //         <FloatingLabelInput
    //             label={'radius'}
    //             value={radius}
    //             onChangeText={value => setRadius(radius)}
    //         />
    //     </View>
    // );
    
};

const styles = StyleSheet.create({
    titleText: {
      fontSize: 30,
      fontWeight: 'bold',
    },
    bodyText: {
        fontSize: 20,
      },
  
  });

export default ConfigScreen;
*/