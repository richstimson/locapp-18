import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';
import { GeoFence } from '../src/user';

import Device from '../src/device';
const deviceSvc = new Device();

import { userSvc } from '../src/user';

const ConfigScreen: React.FC = () => {
    const [address, setAddress] = useState('');
    const [{ long, lat }, setCoords] = useState({ long: 0, lat: 0 });
 //   const [geofence, setGeofence] = useState({ name: '', lat: 0, long: 0, radius: 0 });
    const [radius, setRadius] = useState(0);
    const [userName, setUserName] = useState('');

    const getCurrentLine = () => {
        const error = new Error();
        const stack = error.stack?.split('\n')[2] || '';
        const match = stack.match(/:(\d+):\d+/);
        return match ? match[1] : 'unknown';
    };

    const getCurrentFileAndLine = () => {
        const error = new Error();
        const stack = error.stack?.split('\n')[2] || '';
        const match = stack.match(/\((.*):(\d+):\d+\)/);
        return match ? `${match[1]} at line ${match[2]}` : 'unknown location';
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                await userSvc.getUserDetailsByName('Bob');
                
                if (userSvc.username) {            // these fields need sorting out to update the correct state variables ********    
                    console.log('User details found:', userSvc.username);
                    console.log('Postcode:', userSvc.postcode);
                    console.log('geofence:', userSvc.geofence);
                    console.log('name:', userSvc.geofence?.name);
                    console.log('lat:', userSvc.geofence?.lat);
                    console.log('long:', userSvc.geofence?.long);
                    console.log('radius:', userSvc.geofence?.radius);
                    
                    setUserName(userSvc.username);
                    setAddress(userSvc.postcode || ''); // postcode maps to address in User object
                    setCoords({ long: userSvc.geofence?.long || 0, lat: userSvc.geofence?.lat || 0 });
                    setRadius(userSvc.geofence?.radius || 0);
                }
                else {
                    console.error('No user details found');
                }   
            } catch (error) {
                console.error('Error fetching user details:', error);
                console.log(new Error().stack.split(":")[3]); // This will log the stack trace including the line number
                console.log('Error occurred at line:', getCurrentLine());
                console.log('Error occurred at:', getCurrentFileAndLine());

            }
        };
    
        fetchUserDetails();
    }, []);

    const geocodeAddress = async (address: string, geofence: GeoFence) => {
        try {
            const results = await Location.geocodeAsync(address);
            if (results.length > 0) {
                const { latitude, longitude } = results[0];
                console.log(`Latitude: ${latitude}`);
                console.log(`Longitude: ${longitude}`);
                console.log('accuracy:', results[0].accuracy);
                console.log('Geocoded Location:', results);

                console.log( "geocodeAddress() results: ", userName, latitude, longitude, radius );

                setCoords({ long: longitude, lat: latitude });
//                setGeofence({ name: userName, lat: latitude, long: longitude, radius: radius });
                geofence.lat = latitude;
                geofence.long = longitude;
                geofence.radius = radius;

                // geofence = { lat: latitude, long: longitude, radius: radius };

                console.log( "geocodeAddress() coords: ");
                console.log( long, lat );

                console.log( "geocodeAddress() geofence: ");
                console.log( geofence );
//                return geofence;
        
            } else {
                console.error('No results found for the given address.');
//                return null;
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
//            return null;
        }
    };

    const handleSubmitUserConfig = async () => {
        console.log('Submit User Config:', userName);

        let geofence: GeoFence = { name: '', lat: 0, long: 0, radius: 0 };
        
        //const geofence = await geocodeAddress(address);
        await geocodeAddress(address, geofence);


        console.log( "geofence: ");
        console.log( geofence );

        if (!geofence.lat || !geofence.long || !geofence.radius) {
            console.error('handleSubmitUserConfig(): Geofence object is missing required fields', geofence);
            return;
        }
        
        // Call the createUser function
        // address maps to postcode in User object
        userSvc.createUser(userName, address, geofence)
        .then(() => {
            console.log("User created successfully");
        })
        .catch((error) => {
            console.error("Error creating user:", JSON.stringify(error, null, 2));
        });

    };
    
/*
        // Ensure the input object matches the CreateUserInput type
        const input = {
            userName: userName,
            geofence: {
                name: geofence.name,
                lat: geofence.lat,
                long: geofence.long,
                radius: geofence.radius,
            },
        };

        try {
            await userSvc.createUser(input);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };
*/

    // const handleSubmitUserConfig = async () => {
    //     console.log('Submit User Config:', userName);
    //     await geocodeAddress(address);
    //     userSvc.createUser(userName, geofence);
    // };

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