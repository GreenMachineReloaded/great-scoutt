import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'

import style from './components.style'

function IncButton ({ style, label, clickHandler }) {
  return (
    <TouchableHighlight style={{ ...style, flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4286f4', borderWidth: 1, borderColor: 'darkblue' }} onPress={clickHandler}>
      <Text style={{ fontSize: 24, color: 'white' }}>{label}</Text>
    </TouchableHighlight>
  );
}

export default function IncrementingNumber ({ key, value, increment, onIncrement }) {
  return (
    <View key={key} style={style.incrementingNumber.container}>
      <IncButton style={{ borderRightWidth: 0 }} label="+" clickHandler={() => onIncrement(1)}/>
      <IncButton style={{ borderLeftWidth: 0 }} label="-" clickHandler={() => onIncrement(-1)}/>
    </View>
  );
}
