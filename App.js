/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Navigator from './components/navigation/Navigator';
import UserContextProvider from './components/context/userContext';
import {StatusBar} from 'react-native';

const App = () => {
  return (
    <UserContextProvider>
      <StatusBar
        animated={true}
        backgroundColor="white"
        barStyle="dark-content"
        showHideTransition="fade"
        hidden={false}
      />
      <Navigator />
    </UserContextProvider>
  );
};

export default App;
