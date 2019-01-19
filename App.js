import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { createAppContainer, createDrawerNavigator } from 'react-navigation';

import World from './World';
import Login from './Login';
class Auth extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }
}
const DrawerNavigator = createDrawerNavigator(
  {
    World: {
      screen: World,
    },
    'Login/Sign Up': {
      screen: Login,
    },
  }
  // {
  //   initialRouteName: Auth,
  // }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default createAppContainer(DrawerNavigator);
