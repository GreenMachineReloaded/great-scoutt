import React, { Component } from 'react';
import {
  View,
  Button,
  Text,
  Image,
  Alert
} from 'react-native';
import MatchList from '../match/list.js';
import TeamService from '../../services/team-service';

import globalStyle from '../global.style.js';

const teamService = new TeamService();

export default class TeamDetail extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
    // headerRight: (
    //   <View style={{ flexDirection: 'row' }}>
    //     <Button style={{ flex: 1 }} title="Edit" onPress={() => navigation.navigate('TeamEditScreen', navigation.state.params)}/>
    //     <Button style={{ flex: 1, color: 'red' }} title="Delete" onPress={() => {
    //       teamService.delete(navigation.state.params.number)
    //         .then((result) => navigation.goBack('TeamListScreen'))
    //         .catch((error) => {
    //           if (error.name === 'DbDeleteOpError') {
    //             Alert.alert('Can\'t Delete This Team', error.message);
    //           }
    //         });
    //     }}/>
    //   </View>
    // ),
    headerStyle: globalStyle.headerStyle
  });

  render () {
    const team = this.props.navigation.state.params;
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flex: 2 }}>
          <MatchList team={team} navigation={this.props.navigation}/>
        </View>
      </View>
    );
  }
}
