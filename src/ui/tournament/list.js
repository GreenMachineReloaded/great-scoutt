import React, { Component } from 'react';
import { Text, Picker, View } from 'react-native';

import TournamentService from '../../services/tournament-service';

const tournamentService = new TournamentService();

export default class TournamentList extends Component {
    constructor (props) {
      super (props)
      this.state = {
        currentTournament: 0,
        tournaments: []
      }
    }

    componentWillMount () {
      tournamentService.getAll()
        .then((tournaments) => {
          this.setState({ tournaments });
        });
    }

    render () {
      return (
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 3 }}>{'Current Tournament'}</Text>
            <Picker style={{ flex: 5 }} selectedValue={this.state.currentTournament} onValueChange={(value) => this.setState({ currentTournament: value })}>
              {this.state.tournaments.map((tournament) => <Picker.Item label={tournament.name} value={tournament.id}/>)}
            </Picker>
          </View>
        </View>
      );
    }
}