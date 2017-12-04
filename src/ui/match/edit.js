import React, { Component } from 'react';
import {
  Text,
  View,
  Switch,
  TextInput,
  Button,
  Alert
} from 'react-native';
import { Category } from './components';
import MatchService from '../../services/match-service';

const matchService = new MatchService();

export default class MatchEdit extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ...this.props.navigation.state.params
    };
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

    matchService.update(this.state.id, {
      data: {
        categories: this.state.data.categories.map((category) => ({
          name: category.name,
          rules: category.rules.map((rule) => ({
            name: rule.name,
            points: rule.points
          }))
        }))
      }
    })
    .catch((error) => {
      Alert.alert('Error updating match', error.message);
    });
  }

  render () {
    const categories = this.state.data.categories
      .map((category, i) => (
        <Category
          match={this.state}
          category={category}
          key={i}
          fieldUpdated={(name, type, value) => this.updateRule(category, name, type, value)}/>
        ));
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {categories}
      </View>
    );
  }
}
