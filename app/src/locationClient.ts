//import AWS from 'aws-sdk';
// AWS & Amplify
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import * as Location from 'expo-location';
//import Location from 'expo-location';
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
import amplifyconfig from '../../src/aws-exports.js';
import Main from '../src/main.js';
import React, { useState, useEffect } from 'react';
import { Marker } from 'react-native-maps'; // Adjust the import path as necessary
//import AwsLocationClient from './path/to/AwsLocationClient'; // Adjust the import path as necessary

// -------------------------------------------------

// Globals
//let locationClient; // LocationClient
let updatesEnabled = true; // Enable updates to the aws location tracker
// let pollTracker = true;    // Poll the aws location tracker for updates
const trackerName = 'MobileTracker';

// -------
Amplify.configure(amplifyconfig);

// globalThis.ReadableStream = ReadableStream;

interface Location {
    longitude: number,
    latitude: number
}

class LocationService {

    // locationClient API
    private locationClient: LocationClient | null;
 //   private setLocationCallback: (location: { latitude: number, longitude: number }) => void;

    // updatePosCommand API
    private updatePosParams: {
        TrackerName: string,
        Updates: {
            Position: [number, number],
            SampleTime: Date,
            Accuracy: {
                Horizontal: number
            },
            DeviceId: string
        }[]
    };
    private updatePosCommand: BatchUpdateDevicePositionCommand;
    private updatesEnabled: boolean = true;
 

    // GetDevicePosition API
    private getPosCommand: GetDevicePositionCommand;
    private getPosParams: {
        TrackerName: string,
        DeviceId: string
    };

    // GeoFence API
    private createGeofenceInput: {
        CollectionName: string,
        GeofenceId: string,
        Geometry: {
            Circle: {
                Center: [number, number],
                Radius: number
            }
        }
    };
    private putGeoFenceCommand: PutGeofenceCommand;


     // Update Tracker API     
     private updateTrackerInput: {
        TrackerName: string,
        EventBridgeEnabled: boolean,
        Description: string
    };

    /** NOTE: This command not be performed by unauth Role! */
    private updateTrackerCommand: UpdateTrackerCommand;

    // Constructor ------------------------------------------------
//    constructor(setLocationCallback: (location: { latitude: number, longitude: number }) => void) {
//        this.setLocationCallback = setLocationCallback;
    constructor() {

        // Initialisation for updatePosCommand API
        this.updatePosParams = {
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
          /*
        this.updatePosParams = {
            TrackerName: 'MobileTracker',
            Updates: [{
                Position: [0, 0],
                SampleTime: new Date(),
                Accuracy: {
                    Horizontal: 0
                },
                DeviceId: '01c62898-a024-4824-ab68-0a65416e1069'
            }]
        };
*/
        this.updatePosCommand = new BatchUpdateDevicePositionCommand(this.updatePosParams);

        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>> updatePosParams: ', this.updatePosParams);
        console.log( 'Updates: ', this.updatePosCommand?.input?.Updates );

        // Initialisation for getPosCommand API
        this.getPosParams = {
            TrackerName: 'MobileTracker',
            DeviceId: '01c62898-a024-4824-ab68-0a65416e1069',
          };
          
          this.getPosCommand = new GetDevicePositionCommand(this.getPosParams);

          // Initialisation for updateTracker API
          this.updateTrackerInput = { 
            TrackerName: 'MobileTracker',
            EventBridgeEnabled: true,
            Description: 'Bob Tracker',
          };
          
          /** NOTE: This command not be performed by unauth Role! */
          this.updateTrackerCommand = new UpdateTrackerCommand(this.updateTrackerInput);

          // GeoFence API
          this.createGeofenceInput = { // PutGeofenceRequest
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
          
          
          this.putGeoFenceCommand = new PutGeofenceCommand(this.createGeofenceInput);

          // Async initialisation
          (async () => {
                // Create AWS Location Client
                this.locationClient = await this.createClient(); 

                if (this.locationClient) {
                    console.log( 'locationClient created' );
                }
                else {
                    console.log( 'ERROR: locationClient not created' );
                }

                console.log( 'createGeoFence2' ); 

                // Create GeoFence
                await this.createGeoFence();
               //      await updateTracker(); // not possible from unauth role!
                          
                // Phone/Device location services
                try {
                    let { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        console.log('Permission to access location was denied');
                        return;
                    }
                } catch (error) {
                    console.log('Error getting location permissions:', error);
                }
                

//                } else {
                    try {

                    let isLocationServicesEnabled = await Location.hasServicesEnabledAsync();
                    let locationProviderStatus = await Location.getProviderStatusAsync();
        //          console.log(`loc status: ${JSON.stringify(locationProviderStatus)}`);

                    if(isLocationServicesEnabled){
                
                        // Get initial device location and update tracker
                        let loc = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
                        if(loc.coords !== null){
            //                console.log(`location: ${loc.coords.longitude}, ${loc.coords.latitude}`);
                            //setLocation(loc);
            //                deviceSvc.setLocation(loc.coords.latitude, loc.coords.longitude);
                            this.updatePosition(loc.coords.latitude, loc.coords.longitude);
                        }

                        // Watch device location for changes and update tracker
                        await Location.watchPositionAsync({
            //                  enableHighAccuracy: true,
                            distanceInterval: 1,
                            timeInterval: 30000}, newLoc => {
                                try {
                                    console.log(`NEW location: ${newLoc.coords.longitude}, ${newLoc.coords.latitude}`);
                                    // setLocation(newLoc);
                                    // deviceSvc.setLocation(newLoc.coords.latitude, newLoc.coords.longitude);
                                    this.updatePosition(newLoc.coords.latitude, newLoc.coords.longitude);
                                } catch (error) {
                                    console.error('Error updating position:', error);
                                }
                        });
                    }
                    else {
                        console.log('Location services are not enabled');
                    }
                }
                catch (error) {
                    console.log('Error getting location:', error);
                }

        })();

        
    }

    // Methods -----------------------------------------------------

    async createClient(): Promise<LocationClient | null> { 
        console.log( 'createClient()');
    
        const session = await fetchAuthSession();
    
        console.log( session );
    
        try {    
            this.locationClient = new LocationClient({
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
      return this.locationClient;
    };
    

    async getPosition(): Promise<Location | null> { 
        console.log('getPosition()=====================');
        let location: Location;

        if (this.locationClient) {
            try {
                console.log('getPosCommand:', this.getPosCommand);

                const data = await this.locationClient.send(this.getPosCommand);
                
                if (data && data.Position) { 
                    console.log(`Rx Pos: ${data.Position[0]},${data.Position[1]}`);

                    location = { longitude: data.Position[0], latitude: data.Position[1] };
                    console.log('location:', location);
                    return location;

                    // this.setLocationCallback({ longitude: data.Position[0], latitude: data.Position[1] });
                }
                else {
                    console.log('data.Position is not initialized.', data);
                }
            } catch (err) {
                console.log('error:');
                console.error(err);
            }
        }
        else {
            console.log('locationClient is not initialized.');
        }
        return null;
    }

    /*
    ** updatePosition(lat, long)
    ** Update the tracker with new co-ordinates (of the mobike device)
    */

    async updatePosition(lat: number, long: number): Promise<void> { 
        console.log(`updatesEnabled: ${this.updatesEnabled}`);

        if (this.updatesEnabled) {
            console.log('updatePosition()+++++++++++++++++++++++++++++');

            if (this.updatePosCommand?.input?.Updates) {
                const updates = this.updatePosCommand.input.Updates;
                if (updates[0]?.Position) {
                    updates[0].Position[0] = long;
                    updates[0].Position[1] = lat;
                    updates[0].SampleTime = new Date();

                    console.log(`DeviceId: ${updates[0].DeviceId}`);
                    console.log(`Updated Position: ${updates[0].Position}`);
                    console.log(`SampleTime: ${updates[0].SampleTime}`);

                    if (this.locationClient) {  
                        try {
                            const data = await this.locationClient.send(this.updatePosCommand);
                            console.log(`Tx Pos: ${updates[0].Position}`);
                            console.log('data', data);
                            console.log(`--DeviceId: ${updates[0].DeviceId}`);
                        } catch (error) {
                            console.error('Error sending updatePosCommand:', error);
                            console.log(`-- --DeviceId: ${updates[0].DeviceId}`);
                        }
                } else {
                    console.error('locationClient is not initialized.');
                }
            } else {
                console.error('updates[0]?.Position is not initialized.');
            }
        } else {
            console.log('this.updatePosCommand?.input?.Updates is not initialized.');
        }
    }
    else {
        console.log('Updates are not enabled.');
    }
} 


    // GeoFence API -------------------------------------
  
    /*
    ** createGeoFence()
    ** Create GeoFence using createGeoFenceInput
    */
    async createGeoFence(): Promise<void> { 
    console.log( 'createGeoFence()' );
    console.log( this.createGeofenceInput );    
  
    if(this.locationClient) {  
      try {
        const putGeoFenceResponse = await this.locationClient.send(this.putGeoFenceCommand);
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
      console.log('createGeoFence() ERROR: no client ');
    }
  
  }
  

    // Update Tracker API -------------------------------------  
    // Is this called?
    async updateTracker(): Promise<void> { 
        console.log( 'updateTracker()' );    
    
        if(this.locationClient) {  
        try {
            const updateTrackerResponse = await this.locationClient.send(this.updateTrackerCommand);
            console.log( updateTrackerResponse );
    
            } catch (error) {
                console.log( 'updateTracker error' );
                console.log( error );
        }
        }
        else {
            console.log('updateTracker() ERROR: no client ');
        }
  }
}

const locationSvc = new LocationService();

export default locationSvc;
//export default LocationService;