import React from 'react';
import { TextInput } from 'react-native';

export default function ({ textValue, onChangeText }) {
  return (
    <TextInput
      style={{ height: 40 }}
      multiline={true}
      placeholder={'Comments...'}
      onChangeText={onChangeText}
      value={textValue}
    />
  );
}