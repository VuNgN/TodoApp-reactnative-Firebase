import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebase/firebase-config';

export default function Register({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const registerUser = () => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(re => {
        setIsLoading(false);
        navigation.navigate('Login');
      })
      .catch(er => {
        console.log(er);
        Alert.alert('Register not successful', er[0], [
          {
            text: 'OK',
            onPress: () => console.log('ok pressed'),
          },
        ]);
        setIsLoading(false);
      });
  };
  return (
    <SafeAreaView>
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
        <Button title="Register" onPress={registerUser} />
      )}
    </SafeAreaView>
  );
}
