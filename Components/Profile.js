import React from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import SocketIOClient from 'socket.io-client';
import axios from 'axios';

const sBarHeight = getStatusBarHeight();

import { IP } from '../global';

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      points: 0,
    };
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.setState({ points: this.props.user.capsPlaced.length });
    //SOCKET
    this.socket = SocketIOClient(IP);
    this.socket.on('new-cap', cap => {
      if (this.props.user.id === cap.user.id)
        this.setState({
          points: this.state.points + 1,
        });
    });
    this.socket.on('destroy-cap', capToDestroy => {
      if (this.props.user.id === capToDestroy.cap.user.id)
        this.setState({
          points: this.state.points + 1,
        });
    });
  }
  componentWillUnmount() {
    this.socket.emit('disconnect');
  }
  async logout() {
    try {
      await axios.post(`${IP}/logout`);
      this.props.setLoading();
      this.props.navigation.navigate('World', { user: {} });
    } catch (err) {
      console.log(err);
    }
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
              //   this.socket.emit('disconnect');
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
            Points: {this.state.points}
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
