import React from 'react';
import { StackActions } from 'react-navigation';
import { Button, Icon } from 'react-native-elements';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const IP = 'http://192.168.1.55:3000';
const sBarHeight = getStatusBarHeight();

import {
  Alert,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Text,
  Container,
  Label,
  TextInput,
  Picker,
  Keyboard,
} from 'react-native';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      teamId: 1,
      teams: [],
      signingUp: false,
    };
    this.login = this.login.bind(this);
  }

  async componentDidMount() {
    const teams = await axios.get(`${IP}/teams`);
    this.setState({ teams: teams.data });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding">
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

        {/* Form */}
        <View style={styles.container}>
          <TextInput
            onChangeText={password => {
              this.setState({
                password,
              });
            }}
          />
          <Text>Username</Text>
          <TextInput
            value={this.state.username}
            onChangeText={username =>
              this.setState({
                username,
              })
            }
            style={styles.textInput}
          />
          <Text>Password</Text>
          <TextInput
            value={this.state.password}
            onChangeText={password =>
              this.setState({
                password,
              })
            }
            secureTextEntry={true}
            style={styles.textInput}
          />
          {this.state.teams && this.state.signingUp ? (
            <View>
              <Text>Team</Text>
              <Picker
                style={{ height: 50, width: 100 }}
                selectedValue={this.state.teamId}
                onValueChange={teamId => this.setState({ teamId })}
              >
                {this.state.teams.map((team, key) => (
                  <Picker.Item key={key} value={team.id} label={team.name} />
                ))}
              </Picker>
            </View>
          ) : (
            undefined
          )}
          <Button
            title={this.state.signingUp ? 'Sign Up' : 'Log In'}
            buttonStyle={{
              backgroundColor: '#3D81CA',
              borderRadius: 10,
              margin: 20,
            }}
            onPress={
              this.state.signingUp
                ? () =>
                    this.signUp(
                      this.state.username,
                      this.state.password,
                      this.state.teamId
                    )
                : () => this.login(this.state.username, this.state.password)
            }
          />
          {!this.state.signingUp ? (
            <Button
              title="Signup Form"
              onPress={() => this.setState({ signingUp: true })}
            />
          ) : (
            <Button
              title="Login Form"
              onPress={() => this.setState({ signingUp: false })}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }

  async login(username, password) {
    try {
      console.log('attempting to log in');
      const user = await axios.post(`${IP}/login`, { username, password });
      this.setState({
        username: '',
        password: '',
      });
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
    } catch (err) {
      Alert.alert('Oops', 'There was a problem signing in', [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ]);
    }
  }
  async signUp(username, password, teamId) {
    try {
      const user = await axios.post(`${IP}/signup`, {
        username,
        password,
        teamId,
      });
      this.setState({
        username: '',
        password: '',
      });
      this.props.navigation.navigate('World', { user: user.data });
    } catch (err) {
      Alert.alert('Oops', 'There was a problem creating your account', [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ]);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00000030',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    marginTop: sBarHeight + 40,
  },
  textInput: {
    margin: 10,
    backgroundColor: '#FFFFFF',
    width: 250,
    fontSize: 30,
  },
});
