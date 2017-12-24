import assert from 'assert';
import sinon from 'sinon';
import FileSystem from 'react-native-filesystem-v1';
import {
  assertProps,
  unStubWriteToFile
} from '../../utils';
import SettingsService from './index';

const settingsService = new SettingsService();

let settingCounter = 0;

function createSetting (name, value) {
  return {
    id: settingCounter++,
    name:  name  || `Setting ${settingCounter}`,
    value: value === undefined ? null : value
  };
}

function resolveAsString (data) {
  return Promise.resolve(JSON.stringify(data));
}

function stubDatabases (fakeData) {
  sinon.stub(FileSystem, 'readFile').callsFake((path) => {
    switch (path)  {
      case 'teams.json':
        return resolveAsString(fakeData.teams || []);
      case 'matches.json':
        return resolveAsString(fakeData.matches || []);
      case 'settings.json':
        return resolveAsString(fakeData.settings || []);
      case 'tournaments.json':
        return resolveAsString(fakeData.tournaments || []);
    }
  });
}

describe('Settings Service', () => {

  beforeAll(() => sinon.stub(FileSystem, 'writeToFile').callsFake(() => Promise.resolve({ success: true })));

  describe('#getAll', () => {
    const myFirstSetting = createSetting('boring settings option', 0);
    const mySecondSetting = createSetting('wowSoSetting', 'geronimo');
    const aFalseySetting = createSetting('FALSEY', false);

    beforeAll(() => {
      settingsService.settings.reload();
      stubDatabases({
        settings: [myFirstSetting, mySecondSetting, aFalseySetting]
      });
    });

    it('should return all settings', () => {
      return settingsService.getAll()
        .then((settings) => {
          assertProps(settings, {
            'boring settings option': 0,
            'wowSoSetting': 'geronimo',
            'FALSEY': false
          });
        });
    });

    afterAll(() => FileSystem.readFile.restore());

  });

  describe('#update', () => {
    const myFirstSetting = createSetting('cool setting', true);
    const mySecondSetting = createSetting('should have carrots', false);

    beforeAll(() => {
      settingsService.settings.reload();
      stubDatabases({
        settings: [myFirstSetting, mySecondSetting]
      });
    });

    it('should update the correct setting', () => {
      return settingsService.update({ 'cool setting': false })
        .then(() => settingsService.getAll())
        .then((settings) => {
          assertProps(settings, {
            'cool setting': false,
            'should have carrots': false
          })
        });
    });

    afterAll(() => FileSystem.readFile.restore());

  });

  afterAll(() => FileSystem.writeToFile.restore());

});