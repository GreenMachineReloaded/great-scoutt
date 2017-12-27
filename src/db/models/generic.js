export default function Generic () {
  this.getCSVHeaders = () => {
    throw new Error('Unimplemented!!')
  };
  this.toCSV = () => {
    throw new Error('Unimplemented!!');
  };
}