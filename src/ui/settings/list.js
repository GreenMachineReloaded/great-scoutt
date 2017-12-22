import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TournamentPicker } from './components';

import TournamentService from '../../services/tournament-service';
import SettingsService from '../../services/settings-service';

const tournamentService = new TournamentService();
const settingsService = new SettingsService();

export default class SettingsList extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Settings'
  });

  constructor (props) {
    super(props);
    this.state = {
      tournaments: [],
      settings: {
        currentTournament: 0
      }
    };
  }

  componentWillMount () {
    Promise.all([tournamentService.getAll(), settingsService.getAll()])
      .then(([tournaments, settings]) => this.setState({ tournaments, settings }));
  }

  updateSettings (settings) {
    settingsService.update(settings)
      .then(() => this.setState({ settings }));
  }

  render () {
    return (
      <View style={{ paddingLeft: 10, paddingRight: 10 }}>
        <TournamentPicker
          currentTournament={this.state.settings.currentTournament}
          tournaments={this.state.tournaments}
          onValueChange={(value) => {
            this.updateSettings({ currentTournament: value });
          }}
        />
      </View>
    );
  }
}