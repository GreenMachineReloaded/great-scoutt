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

import globalStyle from '../global.style.js';
import style from './list.style';

const teamService = new TeamService();

const NUM_OF_TILES = 5;
const TILE_SIZE = Dimensions.get('window').width/NUM_OF_TILES;
const SCREEN_WIDTH = Dimensions.get('window').width;

const IS_PHONE = SCREEN_WIDTH < 400;

function Team ({ team, clickHandler }) {
  /*<Image style={{ width: 175, height: 175 }} source={team}/>*/
  return (
    <TouchableHighlight onPress={() => clickHandler()}>
      <View style={{ backgroundColor: 'lightgrey', borderWidth: 1, borderColor: 'darkgrey', width: TILE_SIZE, height: TILE_SIZE, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Text style={{ fontSize: IS_PHONE ? 16 : 32, color: 'black' }}>{team.number}</Text>
        {!IS_PHONE ? <Text style={{ fontSize: 16, paddingLeft: 10, paddingRight: 10 }}>{team.name}</Text> : null}
      </View>
    </TouchableHighlight>
  );
}

function createSections (sections, team, i, clickHandler) {
  const lastSection = sections[sections.length - 1];
  const renderedTeam = <Team key={i} team={team} clickHandler={clickHandler}/>;

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
    headerStyle: globalStyle.headerStyle
  });

  constructor (props) {
    super(props);

    this.state = {
      listSections: []
    };
  }

  componentWillMount() {
    this.refresh();
  }

  refresh () {
    teamService.getAll().then((teams) => {
      this.setState({
        listSections: teams && teams.reduce((sections, team, i) => createSections(sections, team, i, () => {
          this.props.navigation.navigate('TeamDetailScreen', team);
        }), [])
      });
    });
  }

  render () {
    return (
      <View>
        <View>
          <Button title="Add Team" onPress={() =>
            this.props.navigation.navigate('TeamAddScreen', { refresh: this.refresh.bind(this) })}/>
        </View>
        <FlatList
          data={this.state.listSections}
          renderItem={({ index, item: section }) => {
            return (
              <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
                {section.teams}
              </View>
            );
          }}
          keyExtractor={(item, index) => index}/>
      </View>
    );
  }
}
