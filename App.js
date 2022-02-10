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

const App = () => {
  return (
    <UserContextProvider>
      <Navigator />
    </UserContextProvider>
  );
};

export default App;
