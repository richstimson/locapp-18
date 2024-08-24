import appsyncClient from './appsyncClient';
import { createUser } from '../../src/graphql/mutations';
import { GraphQLResult } from 'aws-amplify/api';
import { getUser, listUsers } from '../../src/graphql/queries';

import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'; // not sure if this is needed

// Interfaces ---------------------------------------------------------------
export interface GeoFence {
    name: string;
    lat: number;
    long: number;
    radius: number;
}

export interface UserDetails {
    id: string;
    username: string;
    postcode: string;
    geofence: GeoFence | null;
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
    private userDetails: UserDetails;
    
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

        this.userDetails = {
            id: '',
            username: '',
            postcode: '',
            geofence: null
        };

        this.userDetails.username = UserService.usernames['user1']; // is this needed?
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
        geofence.name = this.getGeofenceName(username) || ''; // CHECK THIS <<<<<<

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
                this.userDetails.id = resp.data.createUser.id;
                console.log(`Assigned ID: ${this.userDetails.id}`);

                this.userDetails.username = username;
                this.userDetails.postcode = postcode;
                this.userDetails.geofence = geofence;
            } else {
                console.error('Failed to create user: No data returned');
            }
    
        } catch (error) {
            console.error('Error creating user:', error);
        }
    } 

    // getUserDetails
    // Get the user details (inc geofence) based on the user ID
    private async getUserDetailsById(id: string): Promise<UserDetails | null> {
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
                this.userDetails.id = resp.data.getUser.id.toString();
                this.userDetails.username = resp.data.getUser.userName.toString();
                this.userDetails.postcode = resp.data.getUser.postcode.toString();
                this.userDetails.geofence = resp.data.getUser.geofence;

                console.log( "User details: ");
                console.log( this.userDetails );
/*
                console.log(`Assigned ID: ${this.userDetails.id}`);
                console.log(`Assigned Name: ${this.userDetails.username}`);
                console.log('Assigned Geofence: ', this.userDetails.geofence);
*/
                return this.userDetails;

            } else {
                console.error('No user data found');
            }
    
        } catch (error) {
            console.error('Error getting user:', error);
        }
        return null;
    }

    public async getUserDetailsByName(username: string): Promise<UserDetails | null> {
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

                const userDetails = await this.getUserDetailsById(user.id);
                if (!userDetails) {
                    console.log(`User details is null`);
                }
                return userDetails; // return userDetails or null
            } 
            else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
        return null;
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
            console.log(`Switched to user: ${this.userDetails.username}`);
        } else {
            console.error(`User ${userKey} not found`);
        }
    }
    
    // getGeofenceNameFromUserId
    // Returns a geofence name based on the user ID
    // e.g. 'user1' -> 'Bob-geofence
    getGeofenceNameFromUserId(userId: string): string | null {
        console.log(`getGeofenceNameFromUserId ${userId}`);

        let userName: string | null = null;

        userName = UserService.usernames[userId];
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
    getGeofenceName(name: string): string | null{
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
