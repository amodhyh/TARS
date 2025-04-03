
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import{location} from "./app/location";
import{attendance} from "./app/attendance";
import{index} from "./app/index";

import 'expo-router/entry';



export default function App() {
  const Stack = createStackNavigator();
   
  return (

    <NavigationContainer>

    <Stack.Navigator>
    <Stack.Screen name="index" component={index} />
    <Stack.Screen name="location" component={location} />
    <Stack.Screen name="attendance" component={attendance} />
    
  </Stack.Navigator>
  </NavigationContainer>
   
  );
}


