import React, { Component } from 'react';
import { View, Text, Alert, Dimensions, Vibration } from 'react-native';
import Camera from 'react-native-camera';
import MatchService from '../../../services/match-service';
import TeamService from '../../../services/team-service';
import { createTeam, createMatch } from '../helpers';

const matchService = new MatchService();
const teamService = new TeamService();

const gameConfig = require('../../../data/game-config');
const { csvDelimiter } = require('../../../../config');

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Receive extends Component {

  constructor (props) {
    super(props);
    this.state = {
      matchData: [],
      teamData: []
    };
  }

  render () {
    return (
      <View>
        <Text>{'Transfer screen'}</Text>
        <Camera
          style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          aspect={Camera.constants.Aspect.fill}
        />
        <Text>{this.state.teamData}</Text>
      </View>
    );
  }

  onBarCodeRead (e) {
    const fields = e.data.split(csvDelimiter);

    // TODO: improve this way of checking what type of data this is
    if (fields.length === 3 && !this.state.teamData.find(t => t === e.data)) {
      this.setState({
        teamData: this.state.teamData.concat(e.data)
      });
      this.saveTeam(fields);
    } else if (!this.state.matchData.find(m => e.data === m)) {
      this.setState({
        matchData: this.state.matchData.concat(e.data)
      });
      this.saveMatch(fields);
    }
  }

  saveTeam (fields) {
    const team = createTeam(fields);
    teamService.create(team)
      .then(() => {
        Vibration.vibrate();
        this.props.navigation.state.params.refresh()
      })
      .catch(error => Alert.alert('Error adding team', error.message));
  }

  saveMatch (fields) {
    const match = createMatch(fields);
    matchService.create(match)
      .then(() => {
        Vibration.vibrate();
        this.props.navigation.state.params.refresh();
      })
      .catch(error => Alert.alert('Error adding match', error.message));
  }

}