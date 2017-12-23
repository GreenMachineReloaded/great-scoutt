import DbClient from '../../db/client';

// FIXME: move object reformatting code into a mapper

function SettingsService () {
  const database = new DbClient();
  this.settings = database.settingsCollection;
}

SettingsService.prototype.getAll = function () {

  // convert from an array of settings to a single options object
  // TODO: cache transformed settings array so we don't have to
  // do this every time
  return this.settings.getAll()
    .then((settings) => {
      return settings.reduce((accumSettings, entry) => {
        accumSettings[entry.name] = entry.value;
        return accumSettings;
      }, {});
    });
};

SettingsService.prototype.get = function (params) {
  throw new Error('Unimplemented!!');
};

SettingsService.prototype.create = function (team) {
  throw new Error('Unimplemented!!');
};

SettingsService.prototype.update = function (updatedSettings) {
  return this.settings.getAll()
    .then((settings) => {

      // create a promise to update every setting entry
      return Promise.all(Object.keys(updatedSettings).map((settingName) => {
        const newSettingValue = updatedSettings[settingName];
        const currentSetting = settings.find((s) => s.name === settingName);

        // update the setting
        return this.settings.update(currentSetting.id, Object.assign({}, currentSetting, { value: newSettingValue }));
      }));
    });
};

SettingsService.prototype.delete = function (id) {
  throw new Error('Unimplemented!!');
};

export default SettingsService;