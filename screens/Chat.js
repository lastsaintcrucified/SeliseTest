import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';

function Chat({navigation, route, users}) {
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState();

  const onSignOut = () => {
    auth()
      .signOut()
      .then(() => console.log('signedOut'))
      .catch(error => console.log('Error logging out: ', error));
  };
  useEffect(() => {
    setPartner(route.params.user);
    console.log(partner);
  }, []);
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
  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .where('_id', '==', route.params.user.email)
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        setMessages(
          querySnapshot.docs.map(doc => ({
            _id: route.params.user.email,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          })),
        );
      });

    return unsubscribe;
  });

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];
    console.log(messages);
    firestore().collection('chats').add({
      _id,
      createdAt,
      text,
      user,
    });
  }, []);
  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth().currentUser?.email,
        avatar:
          'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Free-Image.png',
      }}
      textInputStyle={{color: 'black'}}
    />
  );
}
const mapStateToProps = ({users}) => {
  return {
    users: users,
  };
};

export default connect(mapStateToProps)(Chat);