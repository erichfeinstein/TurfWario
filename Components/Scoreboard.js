import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import SocketIOClient from 'socket.io-client';
import { IP } from '../global';

export default class Scoreboard extends React.Component {
  constructor() {
    super();
    this.state = {
      teamScores: {},
    };
  }
  componentDidMount() {
    this.socket = SocketIOClient(IP);
    this.socket.on('all-captures', allCaps => {
      let map = {};
      allCaps.map(cap => {
        if (map[cap.user.team.id]) {
          map[cap.user.team.id].score = map[cap.user.team.id].score + 1;
        } else {
          map[cap.user.team.id] = {
            score: 1,
            color: cap.user.team.color,
            name: cap.user.team.name,
          };
        }
      });
      this.setState({
        teamScores: map,
      });
    });

    this.socket.on('new-cap', cap => {
      let map = this.state.teamScores;
      if (map[cap.user.team.id]) {
        map[cap.user.team.id].score = map[cap.user.team.id].score + 1;
      } else {
        map[cap.user.team.id] = {
          score: 1,
          color: cap.user.team.color,
          name: cap.user.team.name,
        };
      }
      this.setState({
        teamScores: map,
      });
    });
    this.socket.on('destroy-cap', cap => {
      let map = this.state.teamScores;
      if (map[cap.cap.user.team.id]) {
        map[cap.cap.user.team.id].score = map[cap.cap.user.team.id].score - 1;
      }
      this.setState({
        teamScores: map,
      });
    });
  }
  componentWillUnmount() {
    this.socket.emit('disconnect');
  }

  render() {
    return (
      <View>
        {Object.entries(this.state.teamScores).map((team, key) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                margin: 5,
                padding: 10,
              }}
              key={key}
            >
              <Icon name="square" type="font-awesome" color={team[1].color} />
              <Text
                style={{
                  margin: 5,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}
              >
                Team {team[1].name}: {team[1].score}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }
}
