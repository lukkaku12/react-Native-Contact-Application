import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import LoginForm from '../components/loginForm';
import RegisterForm from '../components/registerForm';
import { RootStackParamList } from '../types/navigation.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LogInRegisterViewNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RegisterLogin'>;

type LogInRegisterViewProps = {
  navigation: LogInRegisterViewNavigationProp; 
};

const LogInRegisterView = ({ navigation }: LogInRegisterViewProps) => {
  const [toggleForm, setToggleForm] = useState(false);

  return (
    <View style={styles.container}>
      {toggleForm ? (
        <>
          <LoginForm navigation={navigation} />
          <Text style={styles.text}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => setToggleForm(false)}>
            <Text style={styles.link}>Register</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <RegisterForm />
          <Text style={styles.text}>Have an account?</Text>
          <TouchableOpacity onPress={() => setToggleForm(true)}>
            <Text style={styles.link}>Log in</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default LogInRegisterView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
  link: {
    color: '#87CEEB',
    fontSize: 16,
    marginTop: 5,
    textDecorationLine: 'underline',
  },
});