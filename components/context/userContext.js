import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Dimensions, Image, StyleSheet} from 'react-native';
import {getKeychain} from '../Keychain';

export const UserContext = createContext();

export function UserContextProvider({children}) {
  const [userInfo, setUserInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    let isMounted = true;
    getKeychain(isMounted, setUserInfo, setIsLoading);
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <UserContext.Provider value={{userInfo, setUserInfo}}>
      {isLoading ? (
        <Image
          style={styles.signature}
          source={require('../../public/images/signature.png')}
        />
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}

export default function useUser() {
  return useContext(UserContext);
}

const styles = StyleSheet.create({
  signature: {
    width: Dimensions.get('window').width,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
