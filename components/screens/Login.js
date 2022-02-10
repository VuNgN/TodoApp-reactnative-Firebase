import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebase/firebase-config';
import {UserContext} from '../context/userContext';
import {getKeychain, storeKeychain} from '../Keychain';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  useEffect(() => {
    getKeychain({setUserInfo, navigation});
  }, []);
  const loginUser = () => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(re => {
        setUserInfo(re);
        setEmail('');
        setPassword('');
        setIsLoading(false);
        storeKeychain(email, re);
        navigation.navigate('Home');
      })
      .catch(er => {
        Alert.alert('Login not successful', er[0], [
          {
            text: 'OK',
            onPress: () => console.log('ok pressed'),
          },
        ]);
        setIsLoading(false);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Login" onPress={loginUser} />
      )}
      <Button
        title="Register"
        onPress={() => {
          navigation.navigate('Register');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
