// React & Expo Imports
import { StyleSheet, View } from 'react-native';
import React, { useState, useEffect, useRef, useContext } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import { FAB } from 'react-native-paper';

// AWS & Amplify
import { Amplify } from 'aws-amplify';

// Fix ReadableStream error
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill/ponyfill';


// Local imports
import amplifyconfig from '../src/aws-exports';
//import Main from '../src/main.js';
import { userSvc } from '../src/user';
import { UserConfigContext } from '../src/UserConfigContext'; // Import the user config context hook
import { pollTracker } from '../src/device.js';
import locationSvc from '../src/locationClient';
import GeofenceContext from '../src/GeofenceContext'; // Geofence context hook


// -------------------------------------------------

// Globals

let updatesEnabled = true; // Enable updates to the aws location tracker

const trackerName = 'MobileTracker';

// Initialise AWS Amplify
Amplify.configure(amplifyconfig);

// Fix ReadableStream error
globalThis.ReadableStream = ReadableStream;

// -------------------------------------------------


// ----------------------------------------------------------------------------- \\
// --- App () ------------------------------------------------------------------ \\
// ----------------------------------------------------------------------------- \\
export default function App() {
  console.log( 'App()');
  const { userConfig, setUsername, setId, setPostcode, setGeofence } = useContext(UserConfigContext);
  const appgeo = useContext(GeofenceContext);

  useEffect(() => {
    console.log('App component re-rendered');
    console.log( 'geofence: ', appgeo );
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

  // State to control marker visibility
  const [isMarkerVisible, setIsMarkerVisible] = useState(true);

  // Function to toggle marker visibility
  const setMarkerVisibility = ( visible ) => {
    console.log( 'setMarkerVisibility(%s)', visible ? "true" : "false" );

//    setIsMarkerVisible(visible); // Temporarily disabled <<<<<<<<<<
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

    // Set an interval to call pollTrackerForUpdates every 10 seconds  
    // NOTE: A better way to do this would be to clear the interval when pollTracker is false, 
    // and then restart the interval when pollTracker is true
    // // NOTE: This seems to cause excisve callback - so I've commented it out for no
    // const intervalId = setInterval(pollTrackerForUpdates, 10000);
    // console.log( '************** New timer running - intervalId: ', intervalId );
  // Optionally, you can clear the interval when you no longer need to poll
  // clearInterval(intervalId);

    // Recursive call to pollTrackerForUpdates
    await new Promise(resolve => setTimeout(resolve, 10000));
    await pollTrackerForUpdates();
  }

  useEffect(() => {
    // NOTE: This is only called when Map is first rendered
    
    console.log( 'App useEffect()'  );
    (async () => {

      await pollTrackerForUpdates(); // never returns
      
    })();
  }, []);

  // {geofence && (
  //   <Circle
  //   center={{
  //     longitude: -1.4300408,
  //     latitude: 52.9401777,
  //   }}
  //   radius={geofence.radius}
  //   strokeWidth={2}
  //   strokeColor="#3399ff"
  //   fillColor="rgba(50,50,255,0.1)"
  // />
  // )}

//   <Circle
//   center={{
//     longitude: -1.4301285333944764,
//     latitude: 52.94063620274229,
//   }}
//   radius={geofence2.radius}
//   strokeWidth={2}
//   strokeColor="#3399ff"
//   fillColor="rgba(50,50,255,0.1)"
// //              fillColor="#80bfff"
// />

  const geofence2 = {
    name: "Bob-geofence",
    lat: 52.9401777,
    long: -1.4300408,
    radius: 4,
    __typename: "GeoFence"
  };

  console.log( 'appgeo: ', appgeo );
  console.log( 'appgeo.geo.radius: ', appgeo.geo.radius ); 

  console.log( 'appgeo.geo.long: ', appgeo.geo.long ); 
  console.log( 'appgeo.geo.lat: ', appgeo.geo.lat );
  
  const { geo } = appgeo;               // Destructure the geofence object        - KEEP!
  console.log('Destructured geo.lat: ', geo.lat);
  console.log('Destructured geo.long: ', geo.long);
  console.log('Destructured geo.radius: ', geo.radius);

  console.log( 'geofence2: ', geofence2);
  console.log( 'geofence2radius: ', geofence2.radius );

    
  return (
      <View style={styles.container}>
          <MapView style={styles.map}>
            {showMarker()}
            {geo && (
              <Circle
              center={{
                longitude: geo.long,
                latitude: geo.lat,
              }}
              radius={geo.radius}
              strokeWidth={2}
              strokeColor="#3399ff"
              fillColor="rgba(50,50,255,0.1)"
             />
            )}


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
