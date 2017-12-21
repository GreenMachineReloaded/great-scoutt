import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TournamentPicker } from './components';

import TournamentService from '../../services/tournament-service';

const tournamentService = new TournamentService();

export default class SettingsList extends Component {
    static navigationOptions = ({ navigation }) => ({
      title: 'Settings'
    });

    constructor (props) {
      super(props);
      this.state = {
        currentTournament: 0,
        tournaments: []
      };
    }

    componentWillMount () {
      tournamentService.getAll()
        .then((tournaments) => this.setState({ tournaments }));
    }

    render () {
      return (
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <TournamentPicker
            currentTournament={this.state.currentTournament}
            tournaments={this.state.tournaments}
            onValueChange={(value) => this.setState({ currentTournament: value })}/>
        </View>
      );
    }
}