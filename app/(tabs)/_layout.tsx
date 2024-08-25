import React from 'react';
import { Tabs } from 'expo-router';
import { UserConfigProvider } from '../src/UserConfigContext';
import { GeofenceProvider } from '../src/GeofenceContext';


const TabsLayout = () => {
    console.log('Rendering TabsLayout'); // Debugging statement
    return (
        <GeofenceProvider>
            <UserConfigProvider>
                <Tabs>
                <Tabs.Screen name="userConfigScreen" options={{
                        headerTitle: "User Config",
                    }}/>
                    <Tabs.Screen name="App" options={{
                        headerTitle: "Map",
                    }}/>
                    <Tabs.Screen name="index" options={{
                        tabBarButton: () => null, // Hide the index tab
                    }}/>
                </Tabs>
            </UserConfigProvider>
        </GeofenceProvider>
    );
};

// Remove the export statement
export default TabsLayout;