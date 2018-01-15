import GenericModel from './generic';
const { csvDelimiter } = require('../../../config');

export default function Team (t) {
  GenericModel.call(this);

  this.data = {
    id: t.id,
    name: t.name,
    number: t.number
  };

  this.getCSVHeaders = () => {
    return Object.keys(this.data).join(csvDelimiter);
  };

  this.toCSV = () => {
    
    function getData (team) {
      return Object.keys(team).map((key) => {
        const value = team[key];
        return `${value}`;
      });
    }

    return getData(this.data).join(csvDelimiter);
  };
}