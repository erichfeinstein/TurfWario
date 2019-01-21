import React from 'react';
import { withNavigation, StackActions } from 'react-navigation';
import { Button, Icon } from 'react-native-elements';
import axios from 'axios';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const IP = 'http://192.168.1.55:3000';
const sBarHeight = getStatusBarHeight();

import {
  Alert,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  Picker,
  Keyboard,
} from 'react-native';

class Login extends React.Component {
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
      <View>
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
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
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
          <View>
            {this.state.teams && this.state.signingUp ? (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>Team</Text>
                <Picker
                  style={{ width: 100 }}
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
                borderRadius: 5,
                width: 100,
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
      </View>
    );
  }

  async login(username, password) {
    try {
      console.log('Attempting to log in');
      const user = await axios.post(`${IP}/login`, { username, password });
      await this.setState({
        username: '',
        password: '',
      });
      this.props.navigation.navigate('World', { user: user.data });
    } catch (err) {
      console.log(err);
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
      this.props.setLoading();
      this.props.navigation.navigate('World', { user: user.data });
    } catch (err) {
      console.log(err);
      Alert.alert('Oops', 'There was a problem creating your account', [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ]);
    }
  }
}

export default withNavigation(Login);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00000030',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: sBarHeight + 40,
  },
  textInput: {
    margin: 10,
    backgroundColor: '#FFFFFF',
    width: 250,
    fontSize: 30,
  },
});
