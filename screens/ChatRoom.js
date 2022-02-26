import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ChatRoom({navigation}) {
  const [users, setUsers] = useState([]);
  const handleClick = user => {
    navigation.navigate('Chat', {user});
  };
  useEffect(() => {
    firestore()
      .collection('users')
      .get()
      .then(p => setUsers(p.docs));
  }, []);
  const onSignOut = () => {
    auth()
      .signOut()
      .then(() => console.log('signedOut'))
      .catch(error => console.log('Error logging out: ', error));
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
            backgroundColor: 'red',
            padding: 7,
            borderRadius: 3,
          }}
          onPress={onSignOut}>
          <Text style={{color: 'white'}}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return users.length > 0 ? (
    <View>
      <Text style={styles.title}>Click on any user to start chat!</Text>
      {users.map((item, index) => (
        <Text
          onPress={() => handleClick(item.data())}
          key={index}
          style={styles.inpt}>
          Email:{item.data().email}
        </Text>
      ))}
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>
        You haven't joined any chat rooms yet :'(
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dee2eb',
  },
  inpt: {
    marginTop: 20,
    fontSize: 20,
    borderWidth: 1,
    fontWeight: '500',
    color: 'black',
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 28,
    fontWeight: '500',
    color: 'black',
  },
  //   button: {
  //     backgroundColor: '#2196F3',
  //     textAlign: 'center',
  //     alignSelf: 'center',
  //     paddingHorizontal: 40,
  //     paddingVertical: 10,
  //     borderRadius: 5,
  //     marginTop: 10,
  //   },
  //   buttonText: {
  //     color: '#fff',
  //     fontSize: 18,
  //   },
  //   textInput: {
  //     backgroundColor: '#fff',
  //     marginHorizontal: 20,
  //     fontSize: 18,
  //     paddingVertical: 10,
  //     paddingHorizontal: 10,
  //     borderColor: '#aaa',
  //     borderRadius: 10,
  //     borderWidth: 1,
  //     marginBottom: 5,
  //     width: 225,
  //   },
});
