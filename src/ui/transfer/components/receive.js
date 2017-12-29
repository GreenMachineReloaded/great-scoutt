import React, { Component } from 'react';
import { View, Text, Alert, Dimensions } from 'react-native';
import Camera from 'react-native-camera';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Receive extends Component {

  constructor (props) {
    super(props);
    this.state = {
      data: []
    };
  }

  render () {
    return (
      <View>
        <Text>{'Transfer screen'}</Text>
        <Camera
          style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          aspect={Camera.constants.Aspect.fill}
        />
        {this.state.data.map(m => <Text>{m}</Text>)}
      </View>
    );
  }

  onBarCodeRead (e) {
    if (!this.state.data.find(m => e.data === m)) {
      this.setState({
        data: this.state.data.concat(e.data)
      });
    }
  }

}