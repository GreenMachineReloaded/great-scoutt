import React, { Component } from 'react';
import {
  Text,
  Button,
  Image,
  FlatList,
  View,
  Alert,
  TouchableHighlight,
  Dimensions
} from 'react-native';

import TeamService from '../../services/team-service';
import MatchService from '../../services/match-service';

import { initTeamListRefresh, initRefreshTeamList } from '../actions';

import globalStyle from '../global.style.js';
import style from './list.style';

const teamService = new TeamService();

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_PHONE = SCREEN_WIDTH < 500;

const NUM_OF_TILES = (() => {
  if (SCREEN_WIDTH < 360) {
    return 1;
  } else if (SCREEN_WIDTH < 500) {
    return 2;
  } else {
    return 4;
  }
})();
const TILE_MARGIN = (SCREEN_WIDTH) * 0.02;
const TILE_SIZE = ((SCREEN_WIDTH - TILE_MARGIN) / NUM_OF_TILES) - TILE_MARGIN;

function DataRow ({ label, data }) {
  return (
    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
      <Text>{label}</Text>
      <Text>{!isNaN(data) ? Math.round(data) : data}</Text>
    </View>
  );
}

function Team ({ index, team, clickHandler }) {
  const isLastTile = (index + 1) % NUM_OF_TILES === 0;

  const teamStyle = {
    backgroundColor: 'white',
    borderWidth: 1, borderColor: 'lightgrey', borderRadius: 0,
    width: TILE_SIZE,
    flexDirection: 'column',
    padding: TILE_MARGIN
  };

  const teamNumberStyle = {
    fontSize: 32,
    color: 'black'
  };

  const teamNameStyle = {
    fontSize: 16
  };

  return (
    <View style={{ marginRight: isLastTile ? 0 : TILE_MARGIN }}>
      <TouchableHighlight style={{ borderRadius: IS_PHONE ? 60 : 0 }} onPress={() => clickHandler()}>
        <View style={teamStyle}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={teamNumberStyle}>{team.number}</Text>
            <Text style={{ fontSize: 26 }}>{team.isTop ? '☺' : ''}</Text>
          </View>
          <Text numberOfLines={1} style={teamNameStyle}>{team.name}</Text>
          <View style={{ borderTopWidth: 1, borderTopColor: 'darkgrey', marginTop: 5, paddingTop: 2 }}>
            <DataRow label={'Auto'} data={team.averageScores.autonomous}/>
            <DataRow label={'Teleop'} data={team.averageScores.teleop}/>
            <DataRow label={'End Game'} data={team.averageScores.endGame}/>
            <DataRow label={'Total'} data={team.averageScores.total}/>
            <DataRow label={'Times Dead'} data={team.timesDead}/>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
}

function createSections (sections, team, i, clickHandler) {
  const lastSection = sections[sections.length - 1];

  const renderedTeam = <Team key={i} index={i} team={team} clickHandler={clickHandler}/>;

  // every other team should be attached to the already created section
  if (lastSection && lastSection.teams.length < NUM_OF_TILES) {
    lastSection.teams.push(renderedTeam);
    sections[sections.length - 1] = lastSection;
  } else {

    // create new section
    const newSection = {
      teams: [renderedTeam]
    };
    sections = sections.concat(newSection);
  }

  return sections;
}

export default class TeamList extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Teams',
    headerStyle: globalStyle.headerStyle,
    headerRight: (
      <View style={{ flexDirection: "row" }}>
        <TouchableHighlight style={{ width: 46 }} onPress={() => navigation.navigate('SettingsListScreen')}>
          <Text style={{ fontSize: 28 }}>{'🔧'}</Text>
        </TouchableHighlight>
      </View>
    )
  });

  constructor (props) {
    super(props);

    this.state = {
      listSections: []
    };

    // initialize action for refreshing team list
    initRefreshTeamList(() => this.refresh());
  }

  componentWillMount() {
    this.refresh();
  }

  refresh () {
    const self = this;
    teamService.getAll()
      .then((teams) => {
        this.setState({
          listSections: teams && teams.reduce((sections, team, i) => createSections(sections, team, i, () => {
            this.props.navigation.navigate('TeamDetailScreen', { ...team, refresh: this.refresh.bind(self) });
          }), [])
        });
      })
      .catch((error) => Alert.alert('Error :-(', error.message));
  }

  render () {
    return (
      <View>
        <View>
        <Button title="Transfer" onPress={() =>
            this.props.navigation.navigate('TransferScreen', { refresh: this.refresh.bind(this) })}/>
          <Button title="Add Team" onPress={() =>
            this.props.navigation.navigate('TeamAddScreen', { refresh: this.refresh.bind(this) })}/>
        </View>
        <FlatList
          style={{ padding: TILE_MARGIN }}
          data={this.state.listSections}
          renderItem={({ index, item: section }) => {
            return (
              <View key={index} style={{ flex: 1, flexDirection: 'row', marginBottom: TILE_MARGIN }}>
                {section.teams}
              </View>
            );
          }}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}
