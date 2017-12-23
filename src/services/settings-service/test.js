import assert from 'assert';
import sinon from 'sinon';
import FileSystem from 'react-native-filesystem-v1';
import {
  assertProps,
  stubReadFile,
  unStubReadFile,
  stubWriteToFile,
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

describe('Settings Service', () => {

  beforeAll(() => stubWriteToFile());

  describe('#getAll', () => {
    const myFirstSetting = createSetting('boring settings option', 0);
    const mySecondSetting = createSetting('wowSoSetting', 'geronimo');
    const aFalseySetting = createSetting('FALSEY', false);

    beforeAll(() => {
      settingsService.settings.reload();
      stubReadFile([myFirstSetting, mySecondSetting, aFalseySetting]);
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

    afterAll(() => unStubReadFile());

  });

  describe('#update', () => {
    const myFirstSetting = createSetting('cool setting', true);
    const mySecondSetting = createSetting('should have carrots', false);

    beforeAll(() => {
      settingsService.settings.reload();
      stubReadFile([myFirstSetting, mySecondSetting]);
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

    afterAll(() => unStubReadFile());

  });

  afterAll(() => unStubWriteToFile());

});