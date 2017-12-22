import React from 'react';
import { View, Text, TextInput } from 'react-native';

export default function ({ number, onChangeText }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ flex: 1 }}>{'Match Number'}</Text>
      <TextInput
        keyboardType={'numeric'}
        value={`${number || ''}`}
        style={{ flex: 3 }} placeholder="Please enter the match number..."
        onChangeText={onChangeText}
      />
    </View>
  );
}