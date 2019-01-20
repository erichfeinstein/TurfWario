import React from 'react';
import { StackActions } from 'react-navigation';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

import Profile from './Profile';
import Login from './Login';

const IP = 'http://192.168.1.55:3000';

export default class ProfileLoginSwitch extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      user: {},
    };
    this.rememberMe = this.rememberMe.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  async rememberMe() {
    const user = await axios.get(`${IP}/rememberme`);
    this.setState({
      user: user.data,
      loading: false,
    });
  }
  setLoading() {
    this.setState({
      loading: true,
    });
  }

  componentDidMount() {
    this.rememberMe();
  }

  render() {
    if (this.state.loading) this.rememberMe();
    return this.state.loading ? (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    ) : this.state.user.id ? (
      <Profile setLoading={this.setLoading} user={this.state.user} />
    ) : (
      <Login setLoading={this.setLoading} />
    );
  }
}
