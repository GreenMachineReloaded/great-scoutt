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

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_PHONE = SCREEN_WIDTH < 400;

const NUM_OF_TILES = IS_PHONE ? 4 : 6;
const TILE_MARGIN = (SCREEN_WIDTH - 20) * 0.03;
const TILE_SIZE = ((SCREEN_WIDTH - 20) / NUM_OF_TILES) - TILE_MARGIN;

function Team ({ index, team, clickHandler }) {
  const isNotLastTile = index + 1 > (index % NUM_OF_TILES);

  const bgRed = team.isTop ? 200 : 255;
  const bgGreen = 255;
  const bgBlue = team.isTop ? 200 : 255;

  const teamStyle = {
    backgroundColor: 'white',
    borderWidth: team.isTop ? 2 : 1, borderColor: team.isTop ? 'red' : 'lightgrey', borderRadius: IS_PHONE ? 60 : 0,
    width: TILE_SIZE, height: TILE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  };

  const teamNameStyle = {
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10
  };

  return (
    <View style={{ marginRight: isNotLastTile ? TILE_MARGIN : 0 }}>
      <TouchableHighlight style={{ borderRadius: IS_PHONE ? 60 : 0 }} onPress={() => clickHandler()}>
        <View style={teamStyle}>
          <Text style={{ fontSize: IS_PHONE ? 16 : 32, color: 'black' }}>{team.number}</Text>
          {!IS_PHONE ? <Text numberOfLines={2} style={teamNameStyle}>{team.name}</Text> : null}
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
          <Button title="Add Team" onPress={() =>
            this.props.navigation.navigate('TeamAddScreen', { refresh: this.refresh.bind(this) })}/>
        </View>
        <FlatList
          style={{ margin: 10 }}
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
