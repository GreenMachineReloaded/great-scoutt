import React, { Component } from 'react';
import { View, Text, Alert, Button, Dimensions } from 'react-native';
import Camera from 'react-native-camera';
import QRCode from 'qrcode';
import SvgUri from 'react-native-svg-uri';
import MatchService from '../../../services/match-service';
import MatchModel from '../../../db/models/match';

const SCREEN_WIDTH = Dimensions.get('window').width;

const matchService = new MatchService();

function genQRCode (csvMatchString) {
  console.log(csvMatchString);
  return new Promise((resolve, reject) => {
    QRCode.toString(csvMatchString, { type: 'svg' }, (err, url) => {
      !err ? resolve(url) : reject(err);
    });
  });
}

export default class Receive extends Component {

  constructor (props) {
    super(props);
    this.state = {
      qrCodes: [],
      currentCode: -1
    };
  }

  componentWillMount () {
    matchService.getAll()
      .then((matches) => {
        const matchModels = matches.map(m => new MatchModel(m));
        const csv = matchModels.map((match) => match.toCSV());
        return Promise.all(csv.map(genQRCode));
      })
      .then((codes) => {
        this.setState({
          qrCodes: codes.map((code) => <SvgUri height={SCREEN_WIDTH} width={SCREEN_WIDTH} svgXmlData={code}/>)
        });
      })
      .catch((error) => Alert.alert('Error', error.message));
  }

  nextCode () {
    this.setState({
      currentCode: this.state.currentCode + 1
    });
    if (this.state.currentCode < this.state.qrCodes.length) {
      setTimeout(() => this.nextCode(), 500);
    } else {
      setTimeout(() => this.state.currentCode = -1, 500);
    }
  }

  render () {
    return (
      <View>
        <Text>{'Transfer screen'}</Text>
        <Text>{this.state.currentCode}</Text>
        <Button title="Begin Transfer" onPress={() => this.nextCode()}/>
        {this.state.qrCodes[this.state.currentCode]}
      </View>
    );
  }

}