import DbClient from '../db/client';

function SettingsService () {
  const database = new DbClient();
  this.settings = database.settingsCollection;
}

SettingsService.prototype.getAll = function () {

  // convert from an array of settings to a single options object
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
      return Promise.all(settings.map((setting) => {

        // get new value for current setting
        const newSettingValue = updatedSettings[setting.name];

        // update the setting
        return this.settings.update(setting.id, Object.assign({}, setting, { value: newSettingValue }));
      }));
    });
};

SettingsService.prototype.delete = function (id) {
  throw new Error('Unimplemented!!');
};

export default SettingsService;