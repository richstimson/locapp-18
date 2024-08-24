import React, { createContext, useState, ReactNode, useContext } from 'react';

interface UserDetails {
    id: string;
    username: string;
    postcode: string;
    geofence: {
        name: string;
        lat: number;
        long: number;
        radius: number;
    };
}

interface UserConfigContextType {
    userConfig: UserDetails | null;
    setUserConfig: React.Dispatch<React.SetStateAction<UserDetails | null>>;
    setUsername: (newUserName: string) => void;
    setId: (newId: string) => void;
    setPostcode: (newPostcode: string) => void;
    setGeofence: (newGeofence: Partial<UserDetails['geofence']> | null) => void;
}

const UserConfigContext = createContext<UserConfigContextType | null>(null);

export const UserConfigProvider = ({ children }: { children: ReactNode }) => {
//    const [userConfig, setUserConfig] = useState<UserDetails | null>(null);

    const [userConfig, setUserConfig] = useState<UserDetails | null>({
        id: '',
        username: '',
        postcode: '',
        geofence: {
            name: '',
            lat: 0,
            long: 0,
            radius: 0,
        },
    });

    const setUsername = (newUserName: string) => {
        console.log('New Username:', newUserName);
        setUserConfig((prev) => {
            console.log('Previous State:', prev);
            return prev ? ({ ...prev, username: newUserName }) : prev;
        });
    };

    
    const setId = (newId: string) => {
        setUserConfig((prev) => prev ? ({ ...prev, id: newId }) : prev);
    };

    const setPostcode = (newPostcode: string) => {
        setUserConfig((prev) => prev ? ({ ...prev, postcode: newPostcode }) : prev);
    };

    const setGeofence = (newGeofence: Partial<UserDetails['geofence']> | null) => {
        if (newGeofence) {
            setUserConfig((prev) => prev ? ({ 
                ...prev, 
                geofence: prev.geofence ? { 
                    ...prev.geofence, 
                    ...newGeofence, 
                    name: newGeofence.name ?? prev.geofence.name, 
                    lat: newGeofence.lat ?? prev.geofence.lat, 
                    long: newGeofence.long ?? prev.geofence.long, 
                    radius: newGeofence.radius ?? prev.geofence.radius 
                } : { 
                    ...newGeofence, 
                    name: newGeofence.name ?? '', 
                    lat: newGeofence.lat ?? 0,
                    long: newGeofence.long ?? 0,
                    radius: newGeofence.radius ?? 0
                }
            }) : prev);
        }
    };

    return (
        <UserConfigContext.Provider value={{ userConfig, setUserConfig, setUsername, setId, setPostcode, setGeofence }}>
            {children}
        </UserConfigContext.Provider>
    );
};

export { UserConfigContext };
export const useUserConfig = () => {
    const context = useContext(UserConfigContext);
    if (!context) {
        throw new Error('useUserConfig must be used within a UserConfigProvider');
    }
    return context;
};

/*
import React, { createContext, useState, useContext } from 'react';

import { UserDetails } from './user';

export const UserConfigContext = createContext(null);

export const UserConfigProvider = ({ children }) => {
    const [userConfig, setUserConfig] = useState<UserDetails | null>({
        id: '',
        username: '',
        postcode: '',
        geofence: {
            name: '',
            lat: 0,
            long: 0,
            radius: 0,
        },
    });

    const setUsername = (newUserName: string) => {
        setUserConfig((prev) => prev ? ({ ...prev, username: newUserName }) : prev);
    };


    const setId = (newId: string) => {
        setUserConfig((prev) => prev ? ({ ...prev, id: newId }) : prev);
    };

    const setPostcode = (newPostcode: string) => {
        setUserConfig((prev) => prev ? ({ ...prev, postcode: newPostcode }) : prev);
    };
    
    const setGeofence = (newGeofence: Partial<UserDetails['geofence']> | null) => {
        if (newGeofence) {
            setUserConfig((prev) => prev ? ({ 
                ...prev, 
                geofence: prev.geofence ? { 
                    ...prev.geofence, 
                    ...newGeofence, 
                    name: newGeofence.name ?? prev.geofence.name, // Ensure name is a string
                    lat: newGeofence.lat ?? prev.geofence.lat, // Ensure lat is a number
                    long: newGeofence.long ?? prev.geofence.long, // Ensure long is a number
                    radius: newGeofence.radius ?? prev.geofence.radius // Ensure radius is a number
                } : { 
                    ...newGeofence, 
                    name: newGeofence.name ?? '', // Provide default values
                    lat: newGeofence.lat ?? 0,
                    long: newGeofence.long ?? 0,
                    radius: newGeofence.radius ?? 0
                }
            }) : prev);
        }
    };
/*
    const setGeofence = (newGeofence: Partial<UserDetails['geofence']>) => {
        setUserConfig((prev) => prev ? ({ 
            ...prev, 
            geofence: { 
                ...prev.geofence, 
                ...newGeofence, 
                name: newGeofence.name ?? prev.geofence.name // Ensure name is a string
            } 
        }) : prev);
    };
    */
    /*
    const setGeofence = (newGeofence: Partial<UserDetails['geofence']>) => {
        setUserConfig((prev) => prev ? ({ ...prev, geofence: { ...prev.geofence, ...newGeofence } }) : prev);
    };
*

    /*
    const setUsername = (newUserName: string) => {
        if (userConfig) {
            setUserConfig((prev) => ({ ...prev, username: newUserName }));
        }
    };


    const setId = (newId: string) => {
        if (userConfig) {
            setUserConfig((prev) => ({ ...prev, id: newId }));
        }
    };

    const setPostcode = (newPostcode: string) => {
        if (userConfig) {
            setUserConfig((prev) => ({ ...prev, postcode: newPostcode }));
        }
    };

    const setGeofence = (newGeofence: Partial<UserDetails['geofence']>) => {
        if (userConfig) {
            setUserConfig((prev) => ({ ...prev, geofence: { ...prev.geofence, ...newGeofence } }));
        }
    };
*
    return (
        <UserConfigContext.Provider value={{ userConfig, setUserConfig, setUsername, setId, setPostcode, setGeofence }}>
            {children}
        </UserConfigContext.Provider>
    );
};

export const useUserConfig = () => {
    const context = useContext(UserConfigContext);
    if (!context) {
        throw new Error('useUserConfig must be used within a UserConfigProvider');
    }
    return context;
};

//export const useUserConfig = () => useContext(UserConfigContext);
*/