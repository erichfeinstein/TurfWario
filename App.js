import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import {
  createAppContainer,
  createDrawerNavigator,
  DrawerItems,
  SafeAreaView,
} from 'react-navigation';

import World from './World';
import Scoreboard from './Scoreboard';
import ProfileLoginSwitch from './ProfileLoginSwitch';

const contentComponent = props => (
  <ScrollView>
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: 'always', horizontal: 'never' }}
    >
      <Text style={styles.titleText}>TurfWar.io</Text>
      <DrawerItems {...props} />
      <Scoreboard />
    </SafeAreaView>
  </ScrollView>
);

const DrawerNavigator = createDrawerNavigator(
  {
    World: {
      screen: World,
    },
    Profile: {
      screen: ProfileLoginSwitch,
    },
  },

  {
    drawerWidth: 180,
    contentComponent,
    contentOptions: {
      title: 'TurfWar.io',
      activeTintColor: '#e91e63',
      itemsContainerStyle: {
        marginVertical: 0,
      },
    },
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    padding: 20,
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default createAppContainer(DrawerNavigator);
