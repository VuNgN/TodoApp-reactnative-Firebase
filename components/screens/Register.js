import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebase/firebase-config';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function Register({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMatched, setIsMatched] = useState(true);
  const [errorPassLessThan6, setErrorPassLessThan6] = useState('');
  const [errorRePassLessThan6, setErrorRePassLessThan6] = useState('');
  const registerUser = () => {
    setIsLoading(true);
    if (password === rePassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(re => {
          console.log(re);
          setIsLoading(false);
          Alert.alert('Đăng ký thành công', 'Chào mừng bạn!', [
            {
              text: 'Đăng nhập',
              onPress: () => console.log('ok pressed'),
            },
          ]);

          navigation.navigate('Login');
        })
        .catch(er => {
          Alert.alert(
            'Đăng ký thất bại',
            'Lưu ý, email phải hợp lệ, mật khẩu phải có từ 6 ký tự trở lên và không được để trống trường nào!',
            [
              {
                text: 'Xem lại',
                onPress: () => console.log('ok pressed'),
              },
            ],
          );
          setIsLoading(false);
        });
    } else {
      Alert.alert('Đăng ký thất bại', 'Mật khẩu không trùng nhau', [
        {
          text: 'Xem lại',
          onPress: () => console.log('ok pressed'),
        },
      ]);
      setIsLoading(false);
    }
  };
  const errorHandler = (text, index) => {
    if (index === 1) {
      if (text.length < 6) {
        setErrorPassLessThan6('Mật khẩu cần nhiều hơn 6 ký tự');
      } else {
        if (isMatched) setErrorPassLessThan6('');
      }
    } else {
      if (text.length < 6)
        setErrorRePassLessThan6('Nhập lại mật khẩu cần nhiều hơn 6 ký tự');
      else {
        if (isMatched) setErrorRePassLessThan6('');
      }
    }
  };
  useEffect(() => {
    if (password.length >= 6 && rePassword.length >= 6) {
      if (password !== rePassword) {
        setIsMatched(false);
      } else {
        setIsMatched(true);
      }
      if (!isMatched) {
        setErrorPassLessThan6(' ');
        setErrorRePassLessThan6(
          'Mật khẩu và nhập lại mật khẩu không giống nhau!',
        );
      } else {
        setErrorPassLessThan6('');
        setErrorRePassLessThan6('');
      }
    }
    return () => {
      setIsMatched(true);
    };
  });
  return (
    <KeyboardAwareScrollView>
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
          <Text />
          <TextInput
            placeholder="Mật khẩu"
            style={
              errorPassLessThan6 ? styles.errorTextInput : styles.textInput
            }
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
            onEndEditing={e => {
              errorHandler(e.nativeEvent.text, 1);
            }}
          />
          <Text style={styles.errorText}>
            {errorPassLessThan6 ? errorPassLessThan6 : ''}
          </Text>

          <TextInput
            placeholder="Nhập lại mật khẩu"
            style={
              errorRePassLessThan6 ? styles.errorTextInput : styles.textInput
            }
            secureTextEntry
            value={rePassword}
            onChangeText={text => setRePassword(text)}
            onEndEditing={e => {
              errorHandler(e.nativeEvent.text, 2);
            }}
          />
          <Text style={styles.errorText}>
            {errorRePassLessThan6 ? errorRePassLessThan6 : ''}
          </Text>
        </View>
        <View style={styles.btnSwrapper}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={registerUser}
            activeOpacity={0.6}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.textBtn}>Đăng ký</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const btn = {
  width: '40%',
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 30,
};
const textInput = {
  height: 50,
  width: '100%',
  borderBottomWidth: 2,
  borderStyle: 'solid',
  fontSize: 20,
  paddingLeft: 20,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  signature: {
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
    margin: -20,
    position: 'relative',
    top: -(Dimensions.get('window').height * 10) / 100,
  },
  inputSwrapper: {
    marginBottom: 100,
  },
  textInput: {
    ...textInput,
    borderBottomColor: 'green',
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
  errorTextInput: {
    ...textInput,
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
  },
});
