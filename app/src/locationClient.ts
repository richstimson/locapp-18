//import AWS from 'aws-sdk';
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
import amplifyconfig from '../../src/aws-exports.js';
import Main from '../src/main.js';

// -------------------------------------------------

// Globals
let locationClient; // LocationClient
let updatesEnabled = true; // Enable updates to the aws location tracker
// let pollTracker = true;    // Poll the aws location tracker for updates
const trackerName = 'MobileTracker';

// -------
Amplify.configure(amplifyconfig);

// globalThis.ReadableStream = ReadableStream;

class AwsLocationClient {
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
    private locationClient: LocationClient | undefined;

    constructor() {
        this.updatePosParams = {
            TrackerName: 'MobileTracker',
            Updates: [{
                Position: [-1.423, 52.92],
                SampleTime: new Date(),
                Accuracy: {
                    Horizontal: 1,
                },
                DeviceId: '01c62898-a024-4824-ab68-0a65416e1069',
            }]
        };
        
        this.updatePosCommand = new BatchUpdateDevicePositionCommand(this.updatePosParams);
    }

    async createClient(): Promise<void> {
        console.log('createClient()');

        const session = await fetchAuthSession();
        console.log(session);

        try {    
            this.locationClient = new LocationClient({
                credentials: session.credentials,
                region: amplifyconfig.aws_project_region
            });    
            console.log('New location client created');
        } catch (error) {
            console.log('create location client error');
            console.log(error);
        }

        console.log('createClient() return');
    }
/*
    // UpdateDevicePosition API
    updatePosParams = {
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
    
    updatePosCommand = new BatchUpdateDevicePositionCommand(this.updatePosParams);
*/
    /*
    ** updatePosition(lat, long)
    ** Update the tracker with new co-ordinates (of the mobike device)
    */
async updatePosition(lat: number, long: number): Promise<void> {
    console.log(`updatesEnabled: ${this.updatesEnabled}`);

    if (this.updatesEnabled) {
        console.log('updatePosition()');

        if (this.updatePosCommand?.input?.Updates?.[0]?.Position) {
            this.updatePosCommand.input.Updates[0].Position[0] = long;
            this.updatePosCommand.input.Updates[0].Position[1] = lat;
            this.updatePosCommand.input.Updates[0].SampleTime = new Date();

            console.log(`DeviceId: ${this.updatePosCommand.input.Updates[0].DeviceId}`);

            if (this.locationClient) {
                try {
                    const data = await this.locationClient.send(this.updatePosCommand);
                    console.log(`Tx Pos: ${this.updatePosCommand.input.Updates[0].Position}`);
                    console.log('data');
                    console.log(data);
                } catch (error) {
                    // error handling.
                    console.log('error');
                    console.log(error);
                }
            }
        }
    } else {
        // console.log('update not sent');
    }
}
    async getPosition(): Promise<void> { 
        // Implement your logic to get position
        // Send messages to AWS Location client
    }

    async createGeofence(): Promise<void> {
        // Implement your logic to create a geofence
        // Send messages to AWS Location client
    }
}

export default AwsLocationClient;