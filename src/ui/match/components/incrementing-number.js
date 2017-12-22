import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

import style from './components.style'

const HEIGHT = 40;

function IncButton ({ style, label, clickHandler }) {
  const combinedStyle = {
    ...style,
    flex: 1,
    width: 25,
    height: HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'darkgrey'
  };

  return (
    <TouchableHighlight style={combinedStyle} onPress={clickHandler}>
      <Text style={{ fontSize: 24, color: '#8c8c8c' }}>{label}</Text>
    </TouchableHighlight>
  );
}

export default function IncrementingNumber ({ key, value, increment, onIncrement }) {
  const labelContainerStyle = {
    width: 30,
    borderColor: 'darkgrey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    height: HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  };

  const labelStyle = {
    fontSize: 20,
    color: 'black'
  };

  return (
    <View key={key} style={style.incrementingNumber.container}>
      <IncButton style={{ borderRightWidth: 0 }} label="+" clickHandler={() => onIncrement(1)}/>
      <View style={labelContainerStyle}>
        <Text style={labelStyle}>{value}</Text>
      </View>
      <IncButton style={{ borderLeftWidth: 0 }} label="-" clickHandler={() => onIncrement(-1)}/>
    </View>
  );
}
