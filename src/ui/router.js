import { StackNavigator } from 'react-navigation';
import TeamList from './team/list';
import TeamDetail from './team/detail';
import TeamEdit from './team/edit';
import TeamAdd from './team/add';
import MatchEdit from './match/edit';
import MatchAdd from './match/add';
import MatchDetail from './match/detail';
import SettingsList from './settings/list';
import Transfer from './transfer';

export default StackNavigator({
  TeamListScreen: {
    screen: TeamList
  },
  TeamDetailScreen: {
    screen: TeamDetail
  },
  TeamEditScreen: {
    screen: TeamEdit
  },
  TeamAddScreen: {
    screen: TeamAdd
  },
  MatchEditScreen: {
    screen: MatchEdit
  },
  MatchAddScreen: {
    screen: MatchAdd
  },
  MatchDetailScreen: {
    screen: MatchDetail
  },
  SettingsListScreen: {
    screen: SettingsList
  },
  TransferScreen: {
    screen: Transfer
  }
});
