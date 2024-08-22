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
        </Tabs>
        </UserConfigProvider>
    );
};

// Remove the export statement
export default TabsLayout;