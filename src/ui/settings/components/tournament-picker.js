import React, { Component } from 'react';
import { Text, Picker, View } from 'react-native';

export default function TournamentList ({ currentTournament, tournaments, onValueChange }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 3 }}>{'Current Tournament'}</Text>
      <Picker style={{ flex: 5 }} selectedValue={currentTournament} onValueChange={onValueChange}>
        {tournaments.map((tournament, i) => (
          <Picker.Item key={i} label={tournament.name} value={tournament.id}/>
        ))}
      </Picker>
    </View>
  );
};