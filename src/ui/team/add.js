import React, { Component } from 'react';
import { Text, TextInput, Button, View, Alert } from 'react-native';

import TeamService from '../../services/team-service';

import style from './add.style';

const teamService = new TeamService();

export default class TeamAdd extends Component {

  static navigationOptions = {
    title: 'Add New Team'
  };

  constructor (props) {
    super(props);

    this.state = {
      name: 'Default name',
      number: '5678'
    };
  }

  render () {
    return (
      <View>
        <View style={style.field.container}>
          <Text style={style.field.label}>{'Name'}</Text>
          <TextInput
            style={style.field.input}
            value={this.state.name}
            onChangeText={(value) => this.setState({ name: value })}/>
        </View>
        <View style={style.field.container}>
          <Text style={style.field.label}>{'Number'}</Text>
          <TextInput
            style={style.field.input}
            value={this.state.number}
            onChangeText={(value) => this.setState({ number: value })}/>
        </View>
        <Button title="Save" onPress={() => {
          teamService.create(this.state)
            .then((result) => {
              this.props.navigation.state.params.refresh();
              this.props.navigation.goBack();
            })
            .catch((error) => {
              if (error.name === 'DbAddOpError') {
                Alert.alert('Error Adding Team', error.message);
              } else {
                Alert.alert('Unknown Error Occurred', error);
              }
            });
        }}/>
      </View>
    );
  }
}
