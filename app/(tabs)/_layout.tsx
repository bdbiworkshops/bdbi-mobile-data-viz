import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <Tabs screenOptions={{ tabBarActiveTintColor: '#373D20', headerShown: false }}>
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: 'Home',
                            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name="garden"
                        options={{
                            title: 'Garden',
                            tabBarIcon: ({ color }) => <FontAwesome size={28} name="leaf" color={color} />,
                        }}
                    />
                </Tabs>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
