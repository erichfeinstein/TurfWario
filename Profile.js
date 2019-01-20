import React from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { withNavigation, StackActions } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import axios from 'axios';

const sBarHeight = getStatusBarHeight();

const IP = 'http://192.168.1.55:3000';

class Profile extends React.Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }
  async logout() {
    const res = await axios.post(`${IP}/logout`);
    // this.props.navigation.navigate('ProfileLoginSwitch');
    // this.props.navigation.dispatch(
    //   StackActions.push({
    //     routeName: 'World',
    //     params: {
    //       user: {},
    //       outOfCaps: false,
    //     },
    //   })
    // );
    this.props.setLoading();
    // this.props.navigation.setParams('user', {});
    // this.props.navigation.push('World');
  }

  render() {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        {/* Menu Button */}
        <View style={{ top: sBarHeight + 20, left: 20, width: 40, height: 40 }}>
          <Icon
            size={40}
            name="menu"
            color="#000000"
            onPress={() => {
              Keyboard.dismiss();
              this.props.navigation.openDrawer();
            }}
          />
        </View>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 25,
              backgroundColor: '#00000030',
            }}
          >
            <Icon
              size={45}
              name="square"
              type="font-awesome"
              color={this.props.user.team.color}
            />
            <View style={{ width: 25 }} />
            <Text style={styles.titleText}>{this.props.user.username}</Text>
          </View>
          <Text style={{ fontSize: 35, padding: 20 }}>
            Points: {this.props.user.capsPlaced.length}
          </Text>
          <Button
            buttonStyle={{ borderRadius: 10, backgroundColor: 'red' }}
            containerViewStyle={{ padding: 20 }}
            title="Log Out"
            onPress={() => this.logout()}
          />
        </View>
      </View>
    );
  }
}

export default withNavigation(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 45,
    fontWeight: 'bold',
  },
});
