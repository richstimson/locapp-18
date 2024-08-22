import { Tabs } from 'expo-router';
import { UserConfigProvider } from '../src/UserConfigContext';


const TabsLayout = () => {
    return (
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
    );
};

// Remove the export statementr
export default TabsLayout;