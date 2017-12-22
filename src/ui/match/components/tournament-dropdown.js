import React from 'react';
import { View, Text, Picker } from 'react-native';

export default function ({ tournament, onValueChange, children }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1 }}>{'Tournament'}</Text>
      <Picker style={{ flex: 4 }} selectedValue={tournament} onValueChange={onValueChange}>
        {children}
      </Picker>
    </View>
  );
}