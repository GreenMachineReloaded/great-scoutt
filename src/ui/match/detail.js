import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';

import MatchService from '../../services/match-service';

const matchService = new MatchService();

function getMatchTitle (match) {
  return `${match.team.name} #${match.number}`;
}

function getTotalScore ({ data: { categories } }) {
  return categories.reduce((total, { rules }) => (
    total + rules.reduce((cScore, { points }) => (cScore + points), 0)
  ), 0);
}

const STANDARD_TEXT_SIZE = 18;

export default class MatchDetail extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: getMatchTitle(navigation.state.params)
  });

  render () {
    const match = this.props.navigation.state.params;
    return (
      <ScrollView>
        <View style={{ marginLeft: 10, marginRight: 10 }}>
          <Text style={{ fontSize: STANDARD_TEXT_SIZE + 10 }}>{`Total: ${getTotalScore(match)}`}</Text>
          <View>
            {match.data.categories.map((category, i) => {
              return (
                <View key={i} style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: STANDARD_TEXT_SIZE, fontWeight: 'bold' }}>{category.name}</Text>
                  <View>
                    {category.rules.map((rule, ri) => (
                      <View key={ri} style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={{ flex: 5, fontSize: STANDARD_TEXT_SIZE }}>{rule.name}</Text>
                        <Text style={{ flex: 1, textAlign: 'right' }}>{rule.points}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
          <View>
            <Text style={{ fontSize: STANDARD_TEXT_SIZE, fontWeight: 'bold' }}>{'Comments'}</Text>
            <Text style={{ fontSize: STANDARD_TEXT_SIZE }}>{match.comments}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}