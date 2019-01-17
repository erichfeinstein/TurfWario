import React from 'react';
import SocketIOClient from 'socket.io-client';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import axios from 'axios';

import Login from './Login';

//FSA IP, need to change to dev location
const IP = 'http://172.16.21.34:3000';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      latitude: 0,
      longitude: 0,
      caps: [],
    };
    //SOCKET
    this.socket = SocketIOClient(IP);

    this.updateState = this.updateState.bind(this);
    this.captureArea = this.captureArea.bind(this);
    this.gotCapInfoFromServer = this.gotCapInfoFromServer.bind(this);
    this.login = this.login.bind(this);
  }

  async login(username, password) {
    try {
      console.log('attempting to log in');
      const user = await axios.post(`${IP}/login`, { username, password });
      // console.log('logged in', user);
      // this.setState({
      //   user,
      // });
    } catch (err) {
      console.error(err);
    }
  }

  updateState(coords) {
    const latitude = coords.coords.latitude;
    const longitude = coords.coords.longitude;
    this.setState({
      latitude,
      longitude,
    });
  }

  gotCapInfoFromServer(caps) {
    this.setState({
      caps,
    });
  }
  gotNewCapFromServer(cap) {
    let caps = this.state.caps;
    caps.push(cap);
    this.setState({
      caps,
    });
  }
  componentDidMount() {
    this.socket.on('all-captures', this.gotCapInfoFromServer);
    this.socket.on('new-cap');

    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this.updateState);
  }

  captureArea() {
    console.log('emitting capture');
    this.socket.emit('capture', {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    });
  }

  render() {
    const latitude = this.state.latitude;
    const longitude = this.state.longitude;
    return (
      <View style={StyleSheet.absoluteFillObject}>
        {this.state.user && this.state.user.id ? (
          <View style={StyleSheet.absoluteFillObject}>
            <MapView
              style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}
              region={{
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true}
            >
              {this.state.caps.map(cap => {
                return (
                  <Circle
                    key={cap.id}
                    strokeWidth={0}
                    fillColor={cap.team.color}
                    radius={cap.radius}
                    center={{
                      latitude: cap.latitude,
                      longitude: cap.longitude,
                    }}
                  />
                );
              })}
            </MapView>

            <View style={styles.footer}>
              <View style={styles.button}>
                <Button title="Capture" onPress={this.captureArea} />
              </View>
            </View>
          </View>
        ) : (
          <Login login={this.login} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    top: Dimensions.get('window').height - 50,
    width: Dimensions.get('window').width,
  },
  button: {
    padding: 5,
  },
});
