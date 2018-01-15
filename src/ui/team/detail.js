import React, { Component } from 'react';
import {
  View,
  Button,
  Text,
  Image,
  Alert,
  Modal,
  Dimensions,
  ScrollView
} from 'react-native';
import QRCode from 'qrcode';
import SvgUri from 'react-native-svg-uri';
import MatchList from '../match/list.js';
import MatchModel from '../../db/models/match';
import TeamModel from '../../db/models/team';
import TeamService from '../../services/team-service';
import { genQRCode } from '../transfer/helpers';

import globalStyle from '../global.style.js';

const SCREEN_WIDTH = Dimensions.get('window').width;

const teamService = new TeamService();

export default class TeamDetail extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        {/* <Button style={{ flex: 1 }} title="Edit" onPress={() => navigation.navigate('TeamEditScreen', navigation.state.params)}/> */}
        <Button style={{ flex: 1, color: 'red' }} title="Delete" onPress={() => {
          teamService.delete(navigation.state.params.number)
            .then((result) => {
              navigation.state.params.refresh();
              navigation.goBack();
            })
            .catch((error) => {
              if (error.name === 'DbDeleteOpError') {
                Alert.alert('Can\'t Delete This Team', error.message);
              } else {
                Alert.alert('Unknown Error', error.message);
              }
            });
        }}/>
      </View>
    ),
    headerStyle: globalStyle.headerStyle
  });

  constructor (props) {
    super(props);
    this.state = {
      modalVisible: false,
      qrCodes: []
    };
  }

  toggleModal () {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  componentDidMount () {
    const teamData = this.props.navigation.state.params;
    const teamModel = new TeamModel(teamData);
    Promise.all([
      genQRCode(teamModel.toCSV(), QRCode),
      ...teamData.matches.map((match) => {
        const matchModel = new MatchModel(match);
        return genQRCode(matchModel.toCSV(), QRCode);
      })
    ])
    .then((qrCodes) => this.setState({ qrCodes }))
    .catch((error) => Alert.alert('Error creating QR code', error.message));
  }

  render () {
    const team = this.props.navigation.state.params;
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Modal
          visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={() => this.toggleModal()}
        >
        <View>
          <Button title="Close" onPress={() => this.toggleModal()}/>
          <ScrollView>
            <View style={{ height: (this.state.qrCodes.length * SCREEN_WIDTH) + 40 }}>
            {this.state.qrCodes.map((qrCode) => (
              <SvgUri
                height={SCREEN_WIDTH}
                width={SCREEN_WIDTH}
                svgXmlData={qrCode}
              />
            ))}
            </View>
          </ScrollView>
        </View>
        </Modal>
        <Button title="Share" onPress={() => this.toggleModal()}/>
        <View style={{ flex: 2 }}>
          <MatchList team={team} navigation={this.props.navigation}/>
        </View>
      </View>
    );
  }
}
