import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Switch,
  TextInput,
  Button,
  Picker,
  TouchableHighlight,
  Alert
} from 'react-native';
import { Category } from './components';
import MatchService from '../../services/match-service';
import TeamService from '../../services/team-service';
import TournamentService from '../../services/tournament-service';

const matchService = new MatchService();
const teamService = new TeamService();
const tournamentService = new TournamentService();

// TODO: figure out some way of having a real multiline text field so that we can get rid of this character limit
const COMMENTS_FIELD_LIMIT = 130;

export default class MatchAdd extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Add New Match for ${navigation.state.params.team.name}`
  });

  constructor (props) {
    super(props);

    this.state = {
      ...matchService.getEmptyMatch(props.navigation.state.params.id),
      tournamentOptions: [],
      commentsHeight: 40
    };
  }

  componentDidMount () {
    tournamentService.getAll().then((tournaments) => {
      this.setState({
        tournamentOptions: tournaments
      });
    });
  }

  /**
   * cat   - category to edit (Auto, Teleop, Endgame...)
   * name  - name of rule to edit
   * type  - type of rule (boolean, number, etc...)
   * value - new value entered in ui
   */
  updateRule (cat, name, type, value) {
    this.setState({
      data: {
        categories: this.state.data.categories.map((category) => {

          // this is the category containeing the rule we want to edit
          if (category.name === cat.name) {
            category.rules = category.rules.map((rule) => {

              // this is the rule we are editing
              if (rule.name === name) {

                // depending on the type of rule this is, either map a boolean
                // to a point value or just put the value into the current state
                switch (type) {
                  case 'boolean':
                    rule.points = value ? rule.value : 0;
                    break;
                  case 'number':
                    if (rule.increment) {

                      /**
                       * TODO: Passing in a positive number will increment by the
                       * amount set for this rule in the gameConfig. Negative
                       * will decrement. Should probably make this less awful
                       * but nothing is coming to mind atm. Also the fact that
                       * this page is so dynamic makes this a little more
                       * interesting.
                       */
                      if (value > 0) {
                        rule.points += rule.increment;
                      } else if (value < 0) {
                        rule.points -= rule.increment;
                      }
                    } else {
                      rule.points = value;
                    }
                }
              }

              return rule;
            });
          }

          return category;
        })
      }
    });
  }

  saveMatch () {
    const matchToSave = this.state;
    
    matchToSave.tournamentOptions = undefined;

    matchToSave.team = this.props.navigation.state.params.team.number;

    return matchService.create(matchToSave)
      .then(() => {
        this.props.navigation.state.params.refresh();
        this.props.navigation.goBack();
      })
      .catch((error) => Alert.alert('Could not save match', error.message));
  }

  render () {

    // TODO: Move this into a settings page so it can be set for the day and ignored
    const renderedTourneyOptions = this.state.tournamentOptions.map((tourney, i) => <Picker.Item key={i} label={tourney.name} value={tourney.id}/>);
    const tournamentDropdown = (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ flex: 1 }}>{'Tournament'}</Text>
        <Picker style={{ flex: 5 }} selectedValue={this.state.tournament} onValueChange={(value) => this.setState({
          tournament: value
        })}>
          {renderedTourneyOptions}
        </Picker>
      </View>
    );

    // TODO: Break this component into another file (MatchNumField.js)
    const matchNumField = (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ flex: 1 }}>{'Match Number'}</Text>
        <TextInput
          keyboardType={'numeric'}
          value={`${this.state.number || ''}`}
          style={{ flex: 5 }} placeholder="Please enter the match number..."
          onChangeText={(value) => {

            // FIXME: does not validate decimal points
            if (!isNaN(value) && value > 0) {
              this.setState({
                number: parseInt(value)
              });
            }
          }}
        />
      </View>
    );

    const allianceToggle = (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ flex: 5 }}>{'Alliance'}</Text>
        <TouchableHighlight
          style={{
            width: 75,
            height: 40,
            backgroundColor: this.state.alliance.toLowerCase(),
            alignItems: 'center',
            justifyContent: 'center'
          }} onPress={() => {
            this.setState({
              alliance: this.state.alliance === 'RED' ? 'BLUE' : 'RED'
            });
        }}>
          <Text style={{ fontSize: 20, color: 'white' }}>{this.state.alliance}</Text>
        </TouchableHighlight>
      </View>
    );

    const winToggle = (
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ flex: 5 }}>{'Win?'}</Text>
        <Switch style={{ flex: 1 }} value={this.state.win} onValueChange={(value) => this.setState({
          win: value
        })}/>
      </View>
    );

    const commentsField = (
      <TextInput
        style={{ height: 40 }}
        multiline={true}
        placeholder={'Comments...'}
        onChangeText={(value) => {
          if (value.length < COMMENTS_FIELD_LIMIT) {
            this.setState({
              comments: value
            });
          }
        }}
        value={this.state.comments}
      />
    );

    const categories = this.state.data.categories
      .map((category, i) => (
        <Category
          match={this.state}
          category={category}
          key={i}
          fieldUpdated={(name, type, value) => this.updateRule(category, name, type, value)}/>
      ));

    return (
      <ScrollView style={{flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 10}}>
        {tournamentDropdown}
        {matchNumField}
        {allianceToggle}
        {winToggle}
        {commentsField}
        {categories}
        <Button title="Save" onPress={this.saveMatch.bind(this)}/>
      </ScrollView>
    );
  }
}
