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