import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="userConfigScreen" options={{
                headerTitle: "User Config",
            }}/>
            <Tabs.Screen name="App" options={{
                headerTitle: "Map",
            }}/>
        </Tabs>
    );
};

// Remove the export statement
export default TabsLayout;