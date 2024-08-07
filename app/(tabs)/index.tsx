import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';
//import { FloatingLabelInput } from 'react-native-floating-label-input';

const ConfigScreen: React.FC = () => {
    const [address, setAddress] = useState('');
    const [{long, lat}, setCoords] = useState({'long': 0, 'lat': 0});
    const [radius, setRadius] = useState(0);

    const geocodeAddress = async (address: string) => {
        const results = await Location.geocodeAsync(address);
        console.log(`Latitude: ${results[0].latitude}`);
        console.log(`Longitude: ${results[0].longitude}`);
        console.log('accuracy:', results[0].accuracy);
        // console.log('Geocoded Location:', results);

        setCoords({'long': results[0].longitude, 'lat': results[0].latitude});
      }
      
    const geocodeEnteredAddress = () => {
        geocodeAddress(address);
    }
    
    return (
        <View>
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
                onPress={geocodeEnteredAddress}
                style={{alignSelf: 'center' }}
                >
                <Text>Create!</Text>
            </Button>
            <Text>Coords: {long}, {lat}</Text>
            <Text>Radius: {radius}</Text>
        </View>
    );
    
    /*
    return (
        <View style={{ padding: 50, flex: 1, backgroundColor: '#fff' }}>
            <FloatingLabelInput
                label={'radius'}
                value={radius}
                onChangeText={value => setRadius(radius)}
            />
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

export default ConfigScreen;
