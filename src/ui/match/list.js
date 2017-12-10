import React, { Component } from 'react';
import {
  Text,
  FlatList,
  View,
  Button,
  TouchableOpacity,
  Alert
} from 'react-native';
import TournamentService from '../../services/tournament-service';
import TeamService from '../../services/team-service/service';
import MatchService from '../../services/match-service';

const tourneyService = new TournamentService();
const teamService = new TeamService();
const matchService = new MatchService();

function Tourney ({ tournament }) {
  const style = {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    height: 50,
    justifyContent: 'center'
  };

  return (
    <View style={style}>
      <Text style={{ fontWeight: 'bold' }}>{tournament.name}</Text>
    </View>
  );
}

function Match ({ match, detailClicked, editClicked }) {

  // TODO: move into seperate style file
  const style = {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  };

  return (
    <View style={style}>
      <TouchableOpacity style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', marginLeft: 10 }} onPress={() => detailClicked()}>
        <Text style={{ flex: 1, textAlign: 'left' }}>{`Match ${match.number}`}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ height: 45, alignItems: 'center', justifyContent: 'center' }} onPress={() => editClicked()}>
        <Text style={{ paddingLeft: 10, paddingRight: 10, textAlign: 'center', color: 'white', fontSize: 36, backgroundColor: '#4286f4' }}>{'✏'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default class MatchList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      renderedMatchList: []
    };
  }

  componentWillMount () {
    this.refresh();
  }

  refresh () {
    matchService.get({ team: this.props.team.number })
      .then((matches) => {
        let lastTId;
        this.setState({
          renderedMatchList: matches.reduce((accum, match) => {
            const renderedMatch = <Match
                                    key={match.id}
                                    match={match}
                                    detailClicked={() => this.props.navigation.navigate('MatchDetailScreen', match)}
                                    editClicked={() => this.props.navigation.navigate('MatchEditScreen', match)}/>;

            // insert new tourney name
            if (lastTId !== match.tournament.id) {
              const renderedTourney = <Tourney key={match.tournament.id} tournament={match.tournament}/>;
              accum = accum.concat(renderedTourney);
            }

            lastTId = match.tournament.id;
            return accum.concat(renderedMatch);
          }, [])
        });
      })
      .catch((error) => Alert.alert('Error', error.message));
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <Button title="Add Match" onPress={() => {this.props.navigation.navigate('MatchAddScreen', { team: this.props.team, refresh: this.refresh.bind(this) })}}/>
        {this.state.renderedMatchList}
      </View>
    );
  }
}
