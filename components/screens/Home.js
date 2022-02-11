import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import useUser from '../context/userContext';
import {signOut} from 'firebase/auth';
import {auth, db} from '../../firebase/firebase-config';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore/lite';
import nextId from 'react-id-generator';
import uuid from 'react-native-uuid';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {deleteKeychain} from '../Keychain';

export default function Home({navigation}) {
  const isMounted = useRef(false);
  const {userInfo, setUserInfo} = useUser();
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const uid = userInfo.user.uid;
  const todoId = uuid.v4();
  let current = new Date();
  let cDate =
    current.getFullYear() +
    '-' +
    (current.getMonth() + 1) +
    '-' +
    current.getDate();
  let cTime =
    current.getHours() +
    ':' +
    current.getMinutes() +
    ':' +
    current.getSeconds();
  let dateTime = cDate + ' ' + cTime;
  const getData = async database => {
    try {
      const todosCol = collection(database, uid);
      const todoSnapshot = await getDocs(todosCol);
      const todoListAysnc = todoSnapshot.docs.map(document => document.data());
      if (isMounted.current) {
        setTodoList(todoListAysnc);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const signOutHandler = () => {
    Alert.alert('Thông báo xác nhận', 'Bạn thật sự muốn đăng xuất?', [
      {
        text: 'Nhầm tý',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Chắc chắn!',
        onPress: () => {
          signOut(auth)
            .then(() => {
              deleteKeychain();
              setUserInfo(false);
              //navigation.navigate('Login');
            })
            .catch(error => {
              console.log(error);
            });
        },
      },
    ]);
  };
  const addTodoHandler = async () => {
    setTodo('');
    const text = todo.trim();
    if (text) {
      await setDoc(doc(db, uid, todoId), {
        id: todoId,
        uid: uid,
        todo: text,
        createAt: dateTime,
      });
      getData(db);
    }
  };
  const deleteTodoHandler = id => {
    Alert.alert(
      'Thông báo xác nhận',
      'Bạn đã thật sự hoàn thành công việc này?',
      [
        {
          text: 'Nhầm tý',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Chắc chắn!',
          onPress: async () => {
            await deleteDoc(doc(db, uid, id));
            getData(db);
          },
        },
      ],
    );
  };
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.itemSwapper}>
        <Text style={styles.itemContent}>{item.todo}</Text>
        <Text style={styles.timeTodoText}>[ {item.createAt} ]</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => deleteTodoHandler(item.id)}
          activeOpacity={0.6}>
          <Text style={styles.addBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  };
  useEffect(() => {
    setLoading(true);
    isMounted.current = true;
    getData(db);
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
          <View style={styles.todoWrapper}>
            <View style={styles.header}>
              <Text style={styles.titleText}>
                Welcome {userInfo.user.email}
              </Text>
              <TouchableOpacity
                style={styles.signOut}
                onPress={signOutHandler}
                activeOpacity={0.6}>
                <SimpleLineIcons name="logout" color="white" size={20} />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <ActivityIndicator style={styles.ActivityIndicator} />
            ) : todoList.length > 0 ? (
              <FlatList
                data={todoList}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            ) : (
              <Text style={styles.emptyText}>Bạn chưa có todo nào</Text>
            )}
            <View style={styles.todoInputWrapper}>
              <TextInput
                placeholder="Todo ..."
                value={todo}
                autoFocus
                onChangeText={text => setTodo(text)}
                style={styles.todoTextInput}
              />
              <TouchableOpacity
                style={styles.addBtn}
                onPress={addTodoHandler}
                activeOpacity={0.6}>
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    //justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  signOut: {
    borderColor: 'red',
    borderWidth: 1,
    borderStyle: 'solid',
    padding: 10,
    backgroundColor: 'red',
  },
  titleText: {
    margin: 20,
    fontSize: 30,
  },
  todoWrapper: {
    flex: 1,
  },
  todoInputWrapper: {
    flexDirection: 'row',
    margin: 20,
    paddingBottom: 20,
  },
  todoTextInput: {
    width: '80%',
    height: 40,
    borderColor: 'green',
    borderWidth: 1,
    borderStyle: 'solid',
    fontSize: 18,
    paddingLeft: 20,
  },
  addBtn: {
    width: '20%',
    height: 40,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {color: 'white', fontSize: 16},
  itemSwapper: {
    margin: 20,
    height: 'auto',
    borderBottomColor: 'green',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  itemContent: {
    fontSize: 20,
    width: '80%',
    paddingRight: 20,
  },
  timeTodoText: {
    position: 'absolute',
    bottom: -20,
    right: 0,
  },
  emptyText: {
    margin: 20,
    fontSize: 20,
    flex: 1,
  },
  ActivityIndicator: {
    flex: 1,
  },
});
