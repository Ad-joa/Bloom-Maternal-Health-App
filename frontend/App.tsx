import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import TrimesterScreen from './src/screens/TrimesterScreen';
import AdvisoryScreen from './src/screens/AdvisoryScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type RootStackParamList = {
  Home: undefined;
  Trimester: { trimesterId: number };
  Advisory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#D47285',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Bloom' }} 
          />
          <Stack.Screen 
            name="Trimester" 
            component={TrimesterScreen} 
            options={({ route }) => ({ title: `Trimester ${route.params.trimesterId}` })}
          />
          <Stack.Screen 
            name="Advisory" 
            component={AdvisoryScreen} 
            options={{ title: 'Health Advisory' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
