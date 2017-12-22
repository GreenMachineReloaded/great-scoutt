import React from 'react';
import { View, Text, Switch, TextInput } from 'react-native';
import IncrementingNumber from './incrementing-number';
import Toggle from './toggle';

import style from './components.style';

// put all the rules together
function getRulesFromMatch (match) {
  return match.data.categories.reduce((rules, category) => {
    return rules.concat(category.rules);
  }, []);
}

// get score for given rule
function getRule (name, match) {
  return getRulesFromMatch(match).find((rule) => rule.name === name);
}

export default function RuleField ({ match, rule, index, fieldUpdated }) {
  function RowContainer ({ children }) {
    return (
      <View style={style.ruleField.container}>
        <Text style={style.ruleField.label}>{rule.name}</Text>
        <View style={style.ruleField.manipulatorContainer}>
          {children}
        </View>
      </View>
    );
  }

  let field = <Text style={{width: 75, height: 40}}>{'FIXME'}</Text>;

  const matchRule = getRule(rule.name, match);

  switch (rule.type) {
    case 'number':
      if (rule.increment) {
        field = <IncrementingNumber
                  key={index}
                  value={rule.points}
                  increment={rule.increment}
                  onIncrement={(value) => fieldUpdated(matchRule.name, rule.type, value)}/>
      } else {
        field = <TextInput
                  key={index}
                  style={style.ruleField.textInput}
                  value={`${matchRule.points}`}
                  onChangeText={(value) => fieldUpdated(matchRule.name, rule.type, value)}/>;
      }
      break;
    case 'boolean':
      field = <Toggle
                key={index}
                label={matchRule.points ? matchRule.value : 0}
                color={matchRule.points ? '#edffed' : 'white'}
                onPress={() => {
                  fieldUpdated(matchRule.name, rule.type, !matchRule.points ? matchRule.value : 0)
                }}/>;
      break;
  }

  return (
    <RowContainer key={index}>
      {field}
    </RowContainer>
  );
}
