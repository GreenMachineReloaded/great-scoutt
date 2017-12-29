import React, { Component } from 'react';
import { View, Text, Alert, Button } from 'react-native';
import { Receive, Send } from './components';

export default class Transfer extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isSending: true
    };
  }

  render () {
    const ModeView = this.state.isSending ? Send : Receive;
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Button title="Send" onPress={() => this.setState({ isSending: true })}/>
          <Button title="Receive" onPress={() => this.setState({ isSending: false })}/>
        </View>
        <ModeView/>
      </View>
    );
  }

  onBarCodeRead (e) {
    Alert.alert(e.type, e.data);
  }

}