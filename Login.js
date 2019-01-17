import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Container,
  Label,
  TextInput,
  Button,
} from 'react-native';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        <Text>Username</Text>
        <TextInput
          onChangeText={username =>
            this.setState({
              username,
            })
          }
          style={styles.textInput}
        />
        <Text>Password</Text>
        <TextInput
          onChangeText={password =>
            this.setState({
              password,
            })
          }
          secureTextEntry={true}
          style={styles.textInput}
        />
        <Button
          title="Log In"
          onPress={() =>
            this.props.login(this.state.username, this.state.password)
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    top: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#aaa',
    width: 250,
    fontSize: 30,
  },
});
