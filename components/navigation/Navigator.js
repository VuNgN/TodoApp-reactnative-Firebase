import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import HomeScreen from '../screens/Home';
import useUser from '../context/userContext';
const Stack = createNativeStackNavigator();
export default function Navigator() {
  const {userInfo} = useUser();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userInfo ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{title: 'Đăng ký'}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
