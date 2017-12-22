import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

/**
 * @param {string} label text to display on button
 * @param {string} color color to display on button
 * @param {func}   onPress function to call when value is changed
 */
export default function Toggle ({ label, color, onPress }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableHighlight
        style={{
          width: 75,
          height: 40,
          backgroundColor: color,
          borderColor: 'darkgrey',
          borderWidth: 0.5,
          alignItems: 'center',
          justifyContent: 'center'
        }} onPress={onPress}>
        <Text style={{ fontSize: 20, color: 'black' }}>{label}</Text>
      </TouchableHighlight>
    </View>
  );
}