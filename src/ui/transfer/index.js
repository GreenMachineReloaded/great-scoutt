import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import Camera from 'react-native-camera';

export default class Transfer extends Component {

  render () {
    return (
      <View>
        <Text>{'Transfer screen'}</Text>
        <Camera
          style={{ width: 250, height: 250 }}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          aspect={Camera.constants.Aspect.fill}
        />
      </View>
    );
  }

  onBarCodeRead (e) {
    Alert.alert(e.type, e.data);
  }

}