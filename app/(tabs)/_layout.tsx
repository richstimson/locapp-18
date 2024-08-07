import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{
                headerTitle: "Home Page",
            }}/>
            <Tabs.Screen name="App" options={{
                headerTitle: "App Page",
            }}/>
        </Tabs>
    );
};

// Remove the export statement
export default TabsLayout;