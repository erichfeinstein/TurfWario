import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { StackActions } from 'react-navigation';
import axios from 'axios';
import { Button, Icon } from 'react-native-elements';
import SocketIOClient from 'socket.io-client';
import MapView, { Circle } from 'react-native-maps';
import { getStatusBarHeight } from 'react-native-status-bar-height';

//FSA IP, need to change to dev location
const IP = 'http://192.168.1.55:3000';
//Heroku IP
// const IP = 'https://turfwar-io.herokuapp.com';

const sBarHeight = getStatusBarHeight();

export default class World extends React.Component {
  constructor() {
    super();
    this.state = {
      latitude: 0,
      longitude: 0,
      caps: {},
      playerRadius: 0, //Radius that player sees of their effective area
    };
    //SOCKET
    this.socket = SocketIOClient(IP);

    //Binds
    this.updateState = this.updateState.bind(this);
    this.rememberMe = this.rememberMe.bind(this);
    this.captureArea = this.captureArea.bind(this);
    this.gotCapInfoFromServer = this.gotCapInfoFromServer.bind(this);
  }

  updateState(coords) {
    const latitude = coords.coords.latitude;
    const longitude = coords.coords.longitude;
    this.setState({
      latitude,
      longitude,
    });
  }

  gotCapInfoFromServer(caps, radius) {
    let mapOfCaps = {};
    caps.map(cap => {
      mapOfCaps[cap.id] = cap;
    });
    this.setState({
      caps: mapOfCaps,
      playerRadius: radius,
    });
  }

  async rememberMe() {
    const user = await axios.get(`${IP}/rememberme`);
    let outOfCaps = user.data.capCount < 1;
    this.props.navigation.dispatch(
      StackActions.push({
        routeName: 'World',
        params: {
          user: user.data,
          outOfCaps,
        },
      })
    );
    this.props.navigation.navigate('World', { user: user.data, outOfCaps });
  }

  componentDidMount() {
    this.rememberMe();
    this.socket.on('all-captures', this.gotCapInfoFromServer);
    this.socket.on('new-cap', cap => {
      let caps = this.state.caps;
      caps[cap.id] = cap;
      this.setState({
        caps,
      });
    });
    this.socket.on('destroy-cap', capToDestroy => {
      let caps = this.state.caps;
      delete caps[capToDestroy.id];
      this.setState({
        caps,
      });
    });
    this.socket.on('out-of-caps', () => {
      this.props.navigation.navigate('World', { outOfCaps: true });
    });
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this.updateState);
  }

  async captureArea() {
    console.log('Attempting to capture area');
    const user = this.props.navigation.getParam('user', false);
    if (user) {
      await this.socket.emit('capture', {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        userId: user.id,
      });
    }
  }

  render() {
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <StatusBar hidden={false} />
        {this.state.latitude ? (
          <MapView
            style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onUserLocationChange={pos => {
              this.setState({
                latitude: pos.nativeEvent.coordinate.latitude,
                longitude: pos.nativeEvent.coordinate.longitude,
              });
            }}
            showsCompass={false}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {Object.values(this.state.caps).map(cap => {
              return (
                <Circle
                  key={cap.id}
                  strokeWidth={1}
                  fillColor={cap.user.team.color}
                  radius={cap.radius}
                  center={{
                    latitude: cap.latitude,
                    longitude: cap.longitude,
                  }}
                />
              );
            })}
            <Circle
              center={{
                latitude,
                longitude,
              }}
              strokeWidth={4}
              strokeColor={'#00000030'}
              radius={this.state.playerRadius}
            />
          </MapView>
        ) : (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Determing your location...</Text>
          </View>
        )}
        {this.state.latitude ? (
          <View>
            {this.props.navigation.getParam('user', false) &&
            !this.props.navigation.state.params.outOfCaps ? (
              <View style={styles.footer}>
                <Button
                  buttonStyle={{
                    borderRadius: 35,
                    width: 70,
                    height: 70,
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: this.props.navigation.getParam('user', 0)
                      .team.color,
                  }}
                  title="Capture"
                  onPress={() => this.captureArea()}
                />
              </View>
            ) : (
              <View
                style={{
                  ...styles.footer,
                  height: 50,
                  backgroundColor: '#bcbcbc50',
                }}
              >
                <Text>
                  {this.props.navigation.state.params &&
                  this.props.navigation.state.params.outOfCaps
                    ? 'Out of captures'
                    : 'Sign in to play!'}
                </Text>
              </View>
            )}
            {/* Menu Button */}
            <View
              style={{
                top: sBarHeight + 20,
                left: 20,
                width: 40,
                height: 40,
              }}
            >
              <Icon
                size={40}
                name="menu"
                color="#000000"
                onPress={() => this.props.navigation.openDrawer()}
              />
            </View>
          </View>
        ) : (
          <View />
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
    top: Dimensions.get('window').height - 150,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    position: 'absolute',
    top: 50,
    width: 50,
  },
});
