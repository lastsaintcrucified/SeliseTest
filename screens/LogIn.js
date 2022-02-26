import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {addUser} from '../redux/actions/userAction';
import {connect} from 'react-redux';

function Login({navigation, addUser}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '61136779716-4r356ols9mfo9aljj7uu9dmi1qff8mje.apps.googleusercontent.com',
    });
  }, []);

  const onHandleLogin = () => {
    if (email !== '' && password !== '') {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() =>
          firestore()
            .collection('users')
            .where('email', '==', email)
            .get()
            .then(p => {
              if (p.docs.length < 1) {
                firestore().collection('users').add({email});
                addUser({email});
              } else {
                firestore().collection('users').doc(p.docs[0]?.id).set({email});
                addUser({email});
              }
            }),
        )
        .catch(err => console.log(`Login err: ${err}`));
    }
  };
  const onHandleGoogleLogin = async () => {
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    auth()
      .signInWithCredential(googleCredential)
      .then(async item =>
        firestore()
          .collection('users')
          .where('email', '==', item.additionalUserInfo.profile.email)
          .get()
          .then(snapShot => {
            // console.log(snapShot.docs);
            if (snapShot.docs.length < 1) {
              firestore()
                .collection('users')
                .add({email: item.additionalUserInfo.profile.email});
              addUser({email: item.additionalUserInfo.profile.email});
            } else {
              firestore()
                .collection('users')
                .doc(snapShot.docs[0]?.id)
                .set({email: item.additionalUserInfo.profile.email});
              addUser({email: item.additionalUserInfo.profile.email});
            }
          }),
      );
  };
  const onHandleFBLogin = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    auth()
      .signInWithCredential(facebookCredential)
      .then(async item =>
        firestore()
          .collection('users')
          .where('email', '==', item.additionalUserInfo.profile.email)
          .get()
          .then(snapShot => {
            // console.log(snapShot.docs);
            if (snapShot.docs.length < 1) {
              firestore()
                .collection('users')
                .add({email: item.additionalUserInfo.profile.email});
              addUser({email: item.additionalUserInfo.profile.email});
            } else {
              firestore()
                .collection('users')
                .doc(snapShot.docs[0]?.id)
                .set({email: item.additionalUserInfo.profile.email});
              addUser({email: item.additionalUserInfo.profile.email});
            }
          }),
      );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>
      <Text style={{color: 'black'}}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoFocus={true}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <Text style={{color: 'black'}}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <View style={styles.btn}>
        <Button onPress={onHandleLogin} color="green" title="Login" />
      </View>
      <View style={styles.btn}>
        <Button
          onPress={onHandleGoogleLogin}
          color="#f57c00"
          title="Google Login"
        />
      </View>
      <View style={styles.btn}>
        <Button onPress={onHandleFBLogin} color="blue" title="FB Login" />
      </View>
      <View style={styles.btn}>
        <Button
          style={styles.btn}
          onPress={() => navigation.navigate('Signup')}
          color="black"
          title="Go to Signup"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#444',
    alignSelf: 'center',
    paddingBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: 'black',
  },
  btn: {
    marginBottom: 10,
  },
});
const mapDispatchToProps = dispatch => ({
  addUser: user => dispatch(addCart(user)),
});
export default connect(null, mapDispatchToProps)(Login);
