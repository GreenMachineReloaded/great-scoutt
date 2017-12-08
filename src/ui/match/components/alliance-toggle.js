import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

// TODO: refactor to generic toggle
export default function ({ alliance, onPress }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={{ flex: 5 }}>{'Alliance'}</Text>
      <TouchableHighlight
        style={{
          width: 75,
          height: 40,
          backgroundColor: alliance.toLowerCase(),
          alignItems: 'center',
          justifyContent: 'center'
        }} onPress={onPress}>
        <Text style={{ fontSize: 20, color: 'white' }}>{alliance}</Text>
      </TouchableHighlight>
    </View>
  );
}