import appsyncClient from './appsyncClient';
import { createUser } from '../../src/graphql/mutations';
import { GraphQLResult } from 'aws-amplify/api';
import { getUser, listUsers } from '../../src/graphql/queries';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

// Interfaces ---------------------------------------------------------------
export interface GeoFence {
    name: string;
    lat: number;
    long: number;
    radius: number;
}

interface CreateUserResponse {
    createUser: {
        id: string;
    };
}

interface Usernames {
    [key: string]: string;
}

interface GetUserResponse {
    getUser: {
        id: string;
        userName: string;
        postcode: string;
        geofence: GeoFence;
    };
}

interface UserEntry {
    id: string;
    userName: string;
    postcode: string;
    email: string;
}

interface ListUsersResponse {
    listUsers: {
        items: UserEntry[];
    };
}

/*
// Data structures
export type userDetails = {
    id: string;
    username: string;
    geofence: GeoFence;
}
*/

// Constants ---------------------------------------------------------------
// const geofenceNameSuffix = '-geofence';

// Class --------------------------------------------------------------------

class UserService {
    // Class variables -------------------------------------------------------
    id: string = '';
    username: string = '';
    postcode: string = '';
    geofence: GeoFence | null = null;

    // Class static variables ------------------------------------------------
    // Constant across all instances of the class
    private static readonly geofenceNameSuffix: string = '-geofence';
    private static usernames: { [key: string]: string } = {
        'user1': 'Bob',
        'user2': 'Jeff',
        'user3': 'Fred',
    };

    // Class constructor ------------------------------------------------------
    constructor() {
        console.log('UserService constructor');
        console.log('usernames: ', UserService.usernames);

        this.username = UserService.usernames['user1'];
    }

    // Class methods -----------------------------------------------------------

    // createUser
    // Create a new user with a given name and geofence
    async createUser(username: string, postcode: string, geofence: GeoFence): Promise<void> {
        console.log(`createUser ${username} ${postcode} ${geofence}`);
    
        let resp: GraphQLResult<CreateUserResponse> | null = null;
    
        if (!username) {
            console.error('username is undefined');
            return;
        }
    
        if (!geofence) {
            console.error('Geofence is undefined');
            return;
        }
    
        console.log("createUser() geofence: ");
        console.log(geofence);
    
        // Set the geofence name based on the user name
        //const geofenceName = name + '-geofence';
        geofence.name = this.getGeofenceName(username);

        console.log(`geofenceName: ${geofence.name}`);
    
        try {
            resp = await appsyncClient.graphql({
                query: createUser,
                variables: {
                    input: {
                        userName: username,
                        postcode: postcode,
                        geofence: {
                            name: geofence.name,
                            lat: geofence.lat,
                            long: geofence.long,
                            radius: geofence.radius
                        }
                    }
                }
            }) as GraphQLResult<CreateUserResponse>;
    
            console.log(`createUser response`);
            console.log(resp);
    
            if (resp.data && resp.data.createUser) {
                this.id = resp.data.createUser.id;
                console.log(`Assigned ID: ${this.id}`);

                this.username = username;
                this.postcode = postcode;
                this.geofence = geofence;
            } else {
                console.error('Failed to create user: No data returned');
            }
    
        } catch (error) {
            console.error('Error creating user:', error);
        }
    } 

    // getUserDetails
    // Get the user details (inc geofence) based on the user ID
    private async getUserDetailsById(id: string): Promise<boolean> {
        let success: boolean = false;
        console.log(`getUser ${id}`);
    
        try {
            const resp = await appsyncClient.graphql({
                query: getUser,
                variables: {
                    id: id
                }
            }) as GraphQLResult<GetUserResponse>;

            console.log(`createUser response`);
            console.log(resp);
            // This is getuser response
    
            if (resp.data && resp.data.getUser) {
                this.id = resp.data.getUser.id.toString();
                this.username = resp.data.getUser.userName.toString();
                this.postcode = resp.data.getUser.postcode.toString();
                this.geofence = resp.data.getUser.geofence;
    
                console.log(`Assigned ID: ${this.id}`);
                console.log(`Assigned Name: ${this.username}`);
                console.log('Assigned Geofence: ', this.geofence);

                success = true;
            } else {
                console.error('No user data found');
            }
    
        } catch (error) {
            console.error('Error getting user:', error);
        }

        return success;
    }

    public async getUserDetailsByName(username: string): Promise<void> {
        console.log(`getUserByUsername ${username}`);

        try {
            const resp = await appsyncClient.graphql({
                query: listUsers,
                variables: {
                    filter: {
                        userName: { eq: username }
                    }
                }
            }) as GraphQLResult<ListUsersResponse>;

            console.log(`listUsers response`);
//            confirm.log(resp);

            if (resp.data && resp.data.listUsers && resp.data.listUsers.items.length > 0) {

                const user = resp.data.listUsers.items[0];
                console.log(`User found: ${user.userName}`);
                console.log(`User ID: ${user.id}`);

                await this.getUserDetailsById(user.id);
            }
            else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }


    // Helper functions -------------------------------------------------------

    // getUserName
    // Returns the user name based on the user ID
    // e.g. 'user1' -> 'Bob'
    getUserName(userId: string): string | null {
        console.log(`getUserName ${userId}`);

        const userName = UserService.usernames[userId];
        if (userName) {
            console.log(`User ${userId} found: ${userName}`);
            return userName;
        } else {
            console.error(`User ${userId} not found`);
            return null;
        }
    }

    // switchUser
    // Switches the current user based on the user ID
    // e.g
    // switchUser('user1') -> 'Bob'
    async switchUser(userKey: string): Promise<void> {
        console.log(`switchUser ${userKey}`);

        if (!userKey) {
            console.error('userId is undefined');
            return;
        }

        const userName = UserService.usernames[userKey];
        if (userName) {
            await this.getUserDetailsByName(userName);
            console.log(`Switched to user: ${this.username}`);
        } else {
            console.error(`User ${userKey} not found`);
        }
    }
    
    // getGeofenceNameFromUserId
    // Returns a geofence name based on the user ID
    // e.g. 'user1' -> 'Bob-geofence
    getGeofenceNameFromUserId(userId: string): string {
        console.log(`getGeofenceNameFromUserId ${userId}`);

        const userName = UserService.usernames[userId];
        if (userName) {
            console.log(`User ${userId} found: ${userName}`);
            const geofenceName = userName + UserService.geofenceNameSuffix;
            return geofenceName;
        } else {
            console.error(`User ${userId} not found`);
            return null;
        }
    }

    // getGeofenceName
    // Returns a geofence name based on the user name
    // e.g. 'Bob' -> 'Bob-geofence
    getGeofenceName(name: string): string {
        console.log(`getGeofenceName ${name}`);
        if (name) {
            return (name + UserService.geofenceNameSuffix);
        }
        return null;
    }

// End of class
}



const userSvc = new UserService();

export { userSvc };
export default UserService;


/*
// Same as Device.js Device class - but for a user..

import appsyncClient from './appsyncClient';
//import { createUser } from '../../../../src/graphql/mutations';
import { createUser } from '../../src/graphql/mutations';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
// import { v4 as uuidv4 } from 'uuid'; // Ensure correct import


//const { v4: uuidv4 } = require('uuid');

class User {
    // Class variables
    id = '';
    username = '';
    geofence = null;

    usernames = {
        'user1': 'Bob',
        'user2': 'Jeff',
        'user3': 'Fred',
    };

    // Class constructor
    constructor() {
        console.log('User constructor');
        console.log('usernames: ', this.usernames);

        this.userName = usernames['user1'];
    }

    // Class methods -----------------------------------------------------------
    async createUser(name, geofence) {
        console.log(`createUser ${name} ${geofence}`);

        if (!name) {
            console.error('name is undefined');
            return;
        }

        if (!geofence) {
            console.error('Geofence is undefined');
            return;
        }

        console.log( "createUser() geofence: ");
        console.log( geofence );

        const geofenceName = name + '-geofence'; // Create geofence name based on user name
        console.log( `geofenceName: ${geofenceName}` );
/*
        const userId = uuidv4(); // Generate a unique ID
        console.log(`Generated user ID: ${userId}`);

        const input = {
            id: userId,
            userName: name,
            geofence: {
                name: geofenceName,
                lat: geofence.lat,
                long: geofence.long,
                radius: geofence.radius
            }
        };

        console.log('Input object for createUser mutation:', input);

        try {
            const resp = await appsyncClient.graphql({
                query: createUser,
                variables: {
                    input: input
                }
            });
**

        try {
            const resp = await appsyncClient.graphql({
                query: createUser,
                variables: {
                    input: {
                        userName: name, // Changed from 'name' to 'userName'
                        geofence: {
                            name: geofenceName, // Changed to match the expected structure
                            lat: geofence.lat,
                            long: geofence.long,
                            radius: geofence.radius
                        } // Changed to match the expected structure
                    }
                }
            });

            console.log(`createUser response`);
            console.log(resp);

            // Assuming the response contains the ID in the expected format
            this.id = resp.data.createUser.id.toString();
            console.log(`Assigned ID: ${this.id}`);

            // Write the ID to the Expo File system (if needed)
            // await FileSystem.writeAsStringAsync(this.fileName, JSON.stringify({ id: this.id }));

        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    async getUserDetails(username) {
        console.log(`getUser ${username}`);

        try {
            const resp = await appsyncClient.graphql({
                query: getUser,
                variables: {
                    input: {
                        userName: username
                    }
                }
            });

            console.log(`createUser response`);
            console.log(resp);

            this.id = resp.data.getUser.id.toString(); 
            this.userName = resp.data.getUser.userName.toString();
            this.geofence = resp.data.getUser.geofence;

            console.log(`Assigned ID: ${this.id}`);
            console.log(`Assigned Name: ${this.name}`);
            console.log('Assigned Geofence: ', this.geofence);

            // Write the ID to the Expo File system (if needed)
            // await FileSystem.writeAsStringAsync(this.fileName, JSON.stringify({ id: this.id }));

        } catch (error) {
            console.error('Error getting user:', error);
        }
    }

    getUserName(userId) {
        const userName = this.usernames[userId];
        if (userName) {
            console.log(`User ${userId} found: ${userName}`);
            return userName;
        } else {
            console.error(`User ${userId} not found`);
            return null;
        }
    }    

    async switchUser(userId) {
        console.log(`switchUser ${userId}`);

        if (!userId) {
            console.error('userId is undefined');
            return;
        }
        
        userName = this.usernames[userId];
        getUserDetails(userName);

        console.log(`Switched to user: ${this.userName}`);
    }

}

const userSvc = new User();

export { userSvc };
export default User;

/*
import appsyncClient from './appsyncClient';

class User {
    async createUser(name, geofence) {
        console.log( `createUser ${name} ${geofence}`);

        const resp = await appsyncClient
        .graphql({
            query: this.createUser,
            variables: {    
                input: {
                    name: name,
                    geofence: geofence
                }
            }
        });

        console.log(`createUser response`);
        console.log(resp);
    //      this.id = resp.data.createUser.id.toString(); // TO DO: Change to: this.id = 'edf95663-1824-46ca-b37c-40d6e6ec8853';
                                                        // This would probably work for updateLocation - 
                                                        // but wouldn't work for any of the device/dynamoDB queries as I think these require the correct device ID.
                                                        // Possibly doesn't matter right now, but need to check. 
                                                        // Another option maybe to manually create a dynamoDB entry with name 'rs-device-01' and ID 'edf95663-1824-46ca-b37c-40d6e6ec8853'
                                                        // or find out how create creates an ID..
        // Write the ID to the Expo File system 
    //        await this.write({id: this.id});       // Note: We could call.. 
                                            // await deviceSvc.write({id: 'edf95663-1824-46ca-b37c-40d6e6ec8853'}); 
                                            // .. before calling init (or register?) in main.js
                                            // .. to write the ID to the file - then create() would never be called, it would call update instead..
    }
}
*/