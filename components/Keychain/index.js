import * as Keychain from 'react-native-keychain';
export async function getKeychain(setUserInfo, setIsLoading) {
  try {
    setIsLoading(true);
    // Retrieve the credentials
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username,
      );
      const user = JSON.parse(credentials.password);
      setUserInfo(user);
    } else {
      console.log('No credentials stored');
    }
    setIsLoading(false);
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
}
export const storeKeychain = async (email, user) => {
  await Keychain.setGenericPassword(email, JSON.stringify(user));
};
export const deleteKeychain = async () => {
  await Keychain.resetGenericPassword();
};
