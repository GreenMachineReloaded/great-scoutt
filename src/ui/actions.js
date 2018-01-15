const defaultCB = () => console.log('function not initialized yet');

let refreshTeamListFunc = defaultCB;

export function initRefreshTeamList (refreshFunc) {
  refreshTeamListFunc = refreshFunc;
}

export function refreshTeamList () {
  return refreshTeamListFunc();
}