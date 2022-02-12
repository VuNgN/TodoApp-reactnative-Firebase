import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
} from 'react-native';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebase/firebase-config';
import useUser from '../context/userContext';
import {storeKeychain} from '../Keychain';

export default function LoginScreen({navigation}) {
  const isMounted = useRef(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {setUserInfo} = useUser();

  const loginUser = () => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(re => {
        if (isMounted.current) {
          setUserInfo(re);
          setEmail('');
          setPassword('');
          setIsLoading(false);
          storeKeychain(email, re);
        }
      })
      .catch(() => {
        Alert.alert(
          'Đăng nhập thất bại',
          'Tài khoản hoặc mật khẩu không chính xác',
          [
            {
              text: 'OK',
              onPress: () => console.log('ok pressed'),
            },
          ],
        );
        setIsLoading(false);
      });
  };
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Image
            style={styles.signature}
            source={require('../../public/images/signature.png')}
          />
          <View style={styles.inputSwrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
            />
            <TextInput
              placeholder="Mật khẩu"
              style={styles.textInput}
              secureTextEntry
              value={password}
              onChangeText={text => setPassword(text)}
            />
          </View>
          <View style={styles.btnSwrapper}>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => {
                navigation.navigate('Register');
              }}
              activeOpacity={0.6}>
              <Text style={styles.registerTextBtn}>Đăng ký</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={loginUser}
              activeOpacity={0.6}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.textBtn}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const btn = {
  width: '40%',
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 30,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'white',
  },
  signature: {
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
    margin: -40,
    position: 'relative',
    top: -(Dimensions.get('window').height * 20) / 100,
  },
  inputSwrapper: {
    marginBottom: 100,
  },
  textInput: {
    height: 50,
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: 'green',
    borderStyle: 'solid',
    fontSize: 20,
    paddingLeft: 20,
  },
  btnSwrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  loginBtn: {
    ...btn,
    backgroundColor: 'green',
  },
  registerBtn: {
    ...btn,
    borderColor: 'green',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  textBtn: {
    color: 'white',
    fontSize: 20,
  },
  registerTextBtn: {
    color: 'green',
    fontSize: 20,
  },
});
