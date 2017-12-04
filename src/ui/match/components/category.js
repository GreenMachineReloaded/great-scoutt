import React from 'react'
import { View, Text } from 'react-native'
import RuleField from './rule-field'

export default function Category ({ match, category, fieldUpdated }) {
  return (
    <View style={{ marginBottom: 10, flexDirection: 'column'}}>
      <Text style={{fontSize: 24}}>{category.name}</Text>
      <View style={{flexDirection: 'column'}}>
        {category.rules.map((rule, i) => <RuleField
                                            key={i}
                                            match={match}
                                            rule={rule}
                                            fieldUpdated={fieldUpdated}/>)}
      </View>
    </View>
  );
}
