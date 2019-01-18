import React from 'react';
import SocketIOClient from 'socket.io-client';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import axios from 'axios';

// import Login from './Login';

//FSA IP, need to change to dev location
const IP = 'http://172.16.21.34:3000';
//Heroku IP
// const IP = 'https://turfwar-io.herokuapp.com';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: { id: 1, username: 'eric', name: 'Eric', teamId: 1 },
      latitude: 0,
      longitude: 0,
      caps: [],
    };
    //SOCKET
    this.socket = SocketIOClient(IP);

    this.updateState = this.updateState.bind(this);
    this.captureArea = this.captureArea.bind(this);
    this.gotCapInfoFromServer = this.gotCapInfoFromServer.bind(this);
    // this.login = this.login.bind(this);
    this.subscribe = this.subscribe;
  }

  // async login(username, password) {
  //   try {
  //     console.log('attempting to log in');
  //     const user = await axios.post(`${IP}/login`, { username, password });
  //     this.setState({
  //       user: user.data,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

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

  componentDidMount() {
    this.socket.on('all-captures', this.gotCapInfoFromServer);
    this.socket.on('new-cap', cap => {
      let caps = this.state.caps;
      caps.push(cap);
      this.setState({
        caps,
      });
    });
    this.socket.on('destroy-cap', capToDestroy => {
      let caps = this.state.caps;
      caps = caps.filter(cap => {
        if (cap.id !== capToDestroy.id) {
          return cap;
        } else {
          console.log('found cap to destroy');
        }
      });
      this.setState({
        caps,
      });
    });
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this.updateState);
  }

  async captureArea() {
    console.log('emitting capture');
    await this.socket.emit('capture', {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      userId: this.state.user.id,
    });
  }

  render() {
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    return (
      <View style={StyleSheet.absoluteFillObject}>
        {this.state.latitude ? (
          <MapView
            style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            // onUserLocationChange={pos => {
            //   console.log('position', pos);
            // }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {this.state.caps.map(cap => {
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
            {/* Where you are */}
            {/* Will this circle move with you? */}
            <Circle
              center={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              }}
              strokeWidth={4}
              strokeColor={'#00000030'}
              radius={200}
            />
          </MapView>
        ) : (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Determing your location...</Text>
          </View>
        )}
        {this.state.latitude ? (
          <View style={styles.footer}>
            <View style={styles.button}>
              <Button title="Capture" onPress={() => this.captureArea()} />
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
  },
  button: {
    padding: 5,
  },
});
