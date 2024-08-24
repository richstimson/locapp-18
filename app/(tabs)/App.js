// React & Expo Imports
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, Image } from 'react-native';

// ---
//import { EventEmitter } from 'react-native';
//import { NativeEventEmitter } from 'react-native';
//import { appsyncClient } from  './src/device';
//import * as subscriptions from './src/graphql/subscriptions';
import { pollTracker } from '../src/device.js';
// ---

import React, { useState, useEffect, useRef, useContext } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import { FAB, Title } from 'react-native-paper';

// AWS & Amplify
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import {
  LocationClient,
  AssociateTrackerConsumerCommand,
  BatchUpdateDevicePositionCommand,
  GetDevicePositionCommand,
  PutGeofenceCommand,
  UpdateTrackerCommand
} from '@aws-sdk/client-location';


// Fix ReadableStream error
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill/ponyfill';


// Local imports
import amplifyconfig from '../src/aws-exports';
//import Main from '../src/main.js';
import { userSvc } from '../src/user';
import { UserConfigContext } from '../src/UserConfigContext'; // Import the context hook
import LocationService from '../src/locationClient';

// -------------------------------------------------

// Globals
let locationClient; // LocationClient // multiplr declarations of locationClient <<<<<<<<<<<<<<
let updatesEnabled = true; // Enable updates to the aws location tracker

const trackerName = 'MobileTracker';

const locationSvc = new LocationService();

// Create an instance of LocationService and pass the setMyLocation function
//const locationSvc = new LocationService(setMyLocation);



// -------
Amplify.configure(amplifyconfig);

globalThis.ReadableStream = ReadableStream;

/*
const createClient = async () => {
    console.log( 'createClient()');

    const session = await fetchAuthSession();

    console.log( session );

    let myClient;

    try {    
        myClient = new LocationClient({
            credentials: session.credentials,
            region: amplifyconfig.aws_project_region
        });    
        console.log( 'New location client created' );
    } catch (error) {
        // error handling.
        console.log( 'create location client error' );
//        console.log (myClient);
    }

  console.log( 'createClient() return');  
  return myClient;
};
*/
/*
// UpdateDevicePosition API
const updatePosParams = {
    TrackerName: 'MobileTracker',
    Updates: [
      {
        DeviceId: '01c62898-a024-4824-ab68-0a65416e1069',
        Position: [-1.423, 52.92],
        SampleTime: new Date(),
        Accuracy: { // PositionalAccuracy
          Horizontal: 1, // required
      }}
    ]
  };
//        DeviceId: 'edf95663-1824-46ca-b37c-40d6e6ec8853',
  
const updatePosCommand = new BatchUpdateDevicePositionCommand(updatePosParams);
*/
/*
/*
** updatePosition(lat, long)
** Update the tracker with new co-ordinates (of the mobike device)
*
async function updatePosition(lat, long) {
   console.log( `updatesEnabled: ${updatesEnabled}` );

  if( updatesEnabled ) {
    console.log('updatePosition()');

    updatePosCommand.input.Updates[0].Position[0] = long;
    updatePosCommand.input.Updates[0].Position[1] = lat;
    updatePosCommand.input.Updates[0].SampleTime = new Date();

   console.log( `DeviceId: ${updatePosCommand.input.Updates[0].DeviceId}` );
    

    if(locationClient) {  
      try {
        const data = await locationClient.send(updatePosCommand);
        console.log( `Tx Pos: ${updatePosCommand.input.Updates[0].Position}` );
        console.log( 'data' );
        console.log (data);
      } catch (error) {
          // error handling.
          console.log( 'error' );
          console.log (error);
      }
    }
  }
  else {
//    console.log('update not sent');
  }
}

module.exports.updatePosition = updatePosition;
*/

/*
// GetDevicePosition API

const getPosParams = {
  TrackerName: 'MobileTracker',
  DeviceId: '01c62898-a024-4824-ab68-0a65416e1069',
};
// 

const getPosCommand = new GetDevicePositionCommand(getPosParams);
// ---
*/
/*
// GeoFence API -------------------------------------
const createGeofenceInput = { // PutGeofenceRequest
  CollectionName: "rs-geofence-collection", // required
  GeofenceId: "rs-geofence-2", // required
  Geometry: { // GeofenceGeometry
    Circle: { // Circle
      Center: [ // required
        -1.4301285333944764,
        52.94063620274229,
      ],
      Radius: 5, // required
    },
  },
};


const putGeoFenceCommand = new PutGeofenceCommand(createGeofenceInput);

/*
** createGeoFence()
** Create GeoFence using createGeoFenceInput
*
async function createGeoFence() {
  console.log( 'createGeoFence()' );
  console.log( createGeofenceInput );    

  if(locationClient) {  
    try {
      const putGeoFenceResponse = await locationClient.send(putGeoFenceCommand);
      console.log( putGeoFenceResponse );
      // { // PutGeofenceResponse
      //   GeofenceId: "STRING_VALUE", // required
      //   CreateTime: new Date("TIMESTAMP"), // required
      //   UpdateTime: new Date("TIMESTAMP"), // required
      // };
      } catch (error) {
          console.log( 'geofence error' );
          console.log( error );
    }
  }
  else {
    console.log('ERROR: no client ');
  }

}
*/
/*
// Update Tracker API -------------------------------------
const updateTrackerInput = { 
  TrackerName: 'MobileTracker',
  EventBridgeEnabled: true,
  Description: 'Bob Tracker',
};

/** NOTE: This command not be performed by unauth Role! *
const updateTrackerCommand = new UpdateTrackerCommand(updateTrackerInput);

async function updateTracker() {
  console.log( 'updateTracker()' );    

  if(locationClient) {  
    try {
      const updateTrackerResponse = await locationClient.send(updateTrackerCommand);
      console.log( updateTrackerResponse );

      } catch (error) {
          console.log( 'updateTracker error' );
          console.log( error );
    }
  }
  else {
    console.log('ERROR: no client ');
  }
}
*/
// -------------------------------------------------


// ----------------------------------------------------------------------------- \\
// --- App () ------------------------------------------------------------------ \\
// ----------------------------------------------------------------------------- \\
export default function App() {
  console.log( 'App()');
  const { userConfig, setUsername, setId, setPostcode, setGeofence } = useContext(UserConfigContext);

  useEffect(() => {
    console.log('App component re-rendered');
  });

  const handleFabPress = async (username) => {
    console.log(`handleFabPress(${username})`);
    const userDetails = await userSvc.getUserDetailsByName(username);

    setUsername(userDetails.username);
    setPostcode(userDetails.postcode);
    setGeofence(userDetails.geofence);
  }

  const onPressFabUserOne = () => handleFabPress('Bob');
  const onPressFabUserTwo = () => handleFabPress('Fred');
  const onPressFabUserThree = () => handleFabPress('Jeff');

  // Handle plus/minus fab button press
  function onPressFab() {
    updatesEnabled = !updatesEnabled;
    console.log( "Updates %s", updatesEnabled ? "enabled" : "disabled" );

    updatesEnabled ? setFabIcon( 'minus' ) : setFabIcon( 'plus' );
  }

  
  // --------------------------------------------


  const [myLocation, setmyLocation] = useState({latitude: 0, longitude: 0});
  const [fabIcon, setFabIcon] = (updatesEnabled ? useState( 'minus' ) : useState( 'plus' ));

  const myMarker = {
    key: 1,
    title: "Ice Cream Van",
    description: "Michele's Ices"
  }

 // const locationClient = new LocationService(setmyLocation); // multiplr declarations of locationClient <<<<<<<<<<<<<<


  // State to control marker visibility
  const [isMarkerVisible, setIsMarkerVisible] = useState(true);

  // Function to toggle marker visibility
  const setMarkerVisibility = ( visible ) => {
    console.log( 'setMarkerVisibility(%s)', visible ? "true" : "false" );

//    setIsMarkerVisible(visible);
    setIsMarkerVisible(true); // Force marker to be visible <<<<<<<<<<
  }


  
  const showMarker = () => {

    console.log( 'showMarker()');
    console.log( {myMarker} );
    console.log( myLocation );
    console.log( "isMarkerVisible: %s", isMarkerVisible ? "true" : "false" );
    
    return (
      isMarkerVisible && (
      <Marker
        key={myMarker.key}
        coordinate={myLocation}
        title={myMarker.title}
        description={myMarker.description}
        image={require('./assets/ice-cream-truck3.png')}
      >

      </Marker>
      )
    );
  }

  

  /* pollTrackerForUpdates
  ** Poll the aws location tracker for updates - if polling is enabled (when vendor is in my geofence)
  ** Note: RECURSIVE FUNCTION - never returns
  */
  async function pollTrackerForUpdates() {
    console.log('pollTrackerForUpdates()');

    if( pollTracker ) {
      setMarkerVisibility(true);
      try {
        loc = await locationSvc.getPosition();
        if (loc) {
          console.log( `Rx Pos: ${loc.longitude},${loc.latitude}`);
          setmyLocation(loc); // Update the marker position
        }
        else {
          console.log( 'No location data' );
        } 
      } catch (error) {
        console.log( 'pollTrackerForUpdates error' );
        console.log( error );
      }
    }
    else {
      setMarkerVisibility(false);
    }

    await new Promise(resolve => setTimeout(resolve, 10000));
    await pollTrackerForUpdates();
  }
 /*   
  /*
  ** async function getPosition() {
  ** Get the current position of the device and update myLocation (used to update the p)
  *
  async function getPosition() {
    console.log('getPosition()');

    if(locationClient) {
      locationClient.send(getPosCommand, (err, data) => {
        if (err) 
        {
            console.log( 'error:' );
            console.error(err);
        }
        
        if (data && data.Position) 
        { 
            console.log(`Rx Pos: ${data.Position[0]},${data.Position[1]}`);
            setmyLocation({ longitude: data.Position[0], latitude: data.Position[1] });
        }
      });
    }
  }
*/
  useEffect(() => {
    // NOTE: This is only called when Map is first rendered
    
    console.log( 'App useEffect() **************************************************************' );
    (async () => {
/*
      locationClient = await locationSvc.createClient(); 
      if (locationClient) {
        console.log( 'locationClient created' );
      }
      else {
        console.log( 'ERROR: locationClient not created' );
      }

      
      console.log( 'createGeoFence2 - move to locationClient *****' ); 

      await locationSvc.createGeoFence();
     //      await updateTracker(); // not possible from unauth role!

*/
      await pollTrackerForUpdates(); // never returns
      
    })();
  }, []);
    
  /*
  // Call updateTracker with locationClient
  useEffect(() => {
    updateTracker(locationClient);
  }, [locationClient]);
*/
  //           <Main />

  return (
      <View style={styles.container}>
          <MapView style={styles.map}>
            {showMarker()}
            <Circle
              center={{
                longitude: -1.4301285333944764,
                latitude: 52.94063620274229,
              }}
              radius={5}
              strokeWidth={2}
              strokeColor="#3399ff"
              fillColor="rgba(50,50,255,0.1)"
//              fillColor="#80bfff"
            />
          </MapView>
          <FAB
            icon={fabIcon}
            style={styles.fab}
            onPress={onPressFab}
          />
          <FAB
            icon={'numeric-1'}
            style={styles.fabUserOne}
            onPress={onPressFabUserOne}
          />
          <FAB
            icon={'numeric-2'}
            style={styles.fabUserTwo}
            onPress={onPressFabUserTwo}
        />
        <FAB
            icon={'numeric-3'}
            style={styles.fabUserThree}
            onPress={onPressFabUserThree}
        />

      </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
      width: '100%',
      height: '100%',
  },
  markerImage: {
    width: 35,
    height: 35,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: 30,
  },
  fabUserOne: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: 100,
  },
  fabUserTwo: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: 170,
  },
  fabUserThree: {
      position: 'absolute',
      margin: 16,
      right: 0,
      top: 240,
},
});
