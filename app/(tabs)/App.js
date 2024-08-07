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

import React, { useState, useEffect } from 'react';
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
import amplifyconfig from '../src/aws-exports.js';
import Main from '../src/main.js';

// -------------------------------------------------

// Globals
let client;
let updatesEnabled = true; // Enable updates to the aws location tracker
// let pollTracker = true;    // Poll the aws location tracker for updates
const trackerName = 'MobileTracker';

// // Step 2: Create an instance of EventEmitter
// //const emitter = new EventEmitter();
// const emitter = new NativeEventEmitter();

// -------
Amplify.configure(amplifyconfig);

globalThis.ReadableStream = ReadableStream;


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

/*
** updatePosition(lat, long)
** Update the tracker with new co-ordinates (of the mobike device)
*/
async function updatePosition(lat, long) {
   console.log( `updatesEnabled: ${updatesEnabled}` );

  if( updatesEnabled ) {
    console.log('updatePosition()');

    updatePosCommand.input.Updates[0].Position[0] = long;
    updatePosCommand.input.Updates[0].Position[1] = lat;
    updatePosCommand.input.Updates[0].SampleTime = new Date();

   console.log( `DeviceId: ${updatePosCommand.input.Updates[0].DeviceId}` );
    

    if(client) {  
      try {
        const data = await client.send(updatePosCommand);
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

// GetDevicePosition API

const getPosParams = {
  TrackerName: 'MobileTracker',
  DeviceId: '01c62898-a024-4824-ab68-0a65416e1069',
};
// 

const getPosCommand = new GetDevicePositionCommand(getPosParams);
// ---

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
*/
async function createGeoFence() {
  console.log( 'createGeoFence()' );
  console.log( createGeofenceInput );    

  if(client) {  
    try {
      const putGeoFenceResponse = await client.send(putGeoFenceCommand);
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
    console.log('no client ');
  }

}

// Update Tracker API -------------------------------------
const updateTrackerInput = { 
  TrackerName: 'MobileTracker',
  EventBridgeEnabled: true,
  Description: 'Bob Tracker',
};

/** NOTE: This command not be performed by unauth Role! */
const updateTrackerCommand = new UpdateTrackerCommand(updateTrackerInput);

async function updateTracker() {
  console.log( 'updateTracker()' );    

  if(client) {  
    try {
      const updateTrackerResponse = await client.send(updateTrackerCommand);
      console.log( updateTrackerResponse );

      } catch (error) {
          console.log( 'updateTracker error' );
          console.log( error );
    }
  }
  else {
    console.log('no client ');
  }
}
// -------------------------------------------------

// export const startPolling = () => {
//   console.log('startPolling() - MARKER VISIBLE');
//   pollTracker = true;
// }

// export const stopPolling = () => {
//   console.log('stopPolling() - MARKER NOT VISIBLE');
//   pollTracker = false;
// }

// --- App () ---

export default function App() {
  console.log( 'App()');


  
  // --------------------------------------------

  function onPressFab() {
    updatesEnabled = !updatesEnabled;
    console.log( "Updates %s", updatesEnabled ? "enabled" : "disabled" );

    updatesEnabled ? setFabIcon( 'minus' ) : setFabIcon( 'plus' );
  }

  const [myLocation, setmyLocation] = useState({latitude: 0, longitude: 0});
  const [fabIcon, setFabIcon] = (updatesEnabled ? useState( 'minus' ) : useState( 'plus' ));

  const myMarker = {
    key: 1,
    title: "Ice Cream Van",
    description: "Michele's Ices"
  }

  // State to control marker visibility
  const [isMarkerVisible, setIsMarkerVisible] = useState(true);

  // Function to toggle marker visibility
  const setMarkerVisibility = ( visible ) => {
    console.log( 'setMarkerVisibility(%s)', visible ? "true" : "false" );
    setIsMarkerVisible(visible);
  }

  const toggleMarkerVisibility = () => {
    setIsMarkerVisible(!isMarkerVisible);
  };

  
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
      await getPosition();
    }
    else {
      setMarkerVisibility(false);
    }

    await new Promise(resolve => setTimeout(resolve, 10000));
    await pollTrackerForUpdates();
  }
    
  /*
  ** async function getPosition() {
  ** Get the current position of the device and update myLocation (used to update the p)
  */
  async function getPosition() {
    console.log('getPosition()');

    if(client) {
      client.send(getPosCommand, (err, data) => {
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

  useEffect(() => {
    console.log( 'App useEffect()');
    (async () => {
      client = await createClient();
      console.log( 'createGeoFence2' );  
      await createGeoFence();
     //      await updateTracker(); // not possible from unauth role!

// -------------------------------------------
/*
let subscription;

const subscribeToUpdates = async () => {
  subscription = await appsyncClient
    .graphql({ query: subscriptions.onPublishMsgFromEb })
    .subscribe({
      next: ({ data }) => {
        console.log("onPublishMsgFromEb (subscription) - msg received***********");
        console.log(data);

        if (data.onPublishMsgFromEb && data.onPublishMsgFromEb.msg) {
          const message = data.onPublishMsgFromEb.msg;
          if (message === "ENTER") {
            console.log("ENTER received");
            startPolling();
          } else if (message === "EXIT") {
            console.log("EXIT received");
            stopPolling();
          } else {
            console.log("UNKNOWN received");
          }
        } else {
          console.log("Message format unknown or missing 'msg' field");
        }
      },
      error: (error) => {
        console.error("Subscription error:", error);
      },
    });
};

subscribeToUpdates();
*/

// -------------------------------------------
/*     
      // Event emitter for marker visibility -------
      const onChangeMarkerVisibility = (visible) => {
        setIsMarkerVisible(visible);
      };

      emitter.addListener('changeMarkerVisibility', onChangeMarkerVisibility);

      // Cleanup
      return () => {
        emitter.removeListener('changeMarkerVisibility', onChangeMarkerVisibility);
      };
      // -------------------------------------------
*/
      await pollTrackerForUpdates(); // never returns
    })();
  }, []);
    
  return (
      <View style={styles.container}>
          <Main />
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
});
