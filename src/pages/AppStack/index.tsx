import * as React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomNavigation, BottomNavigationTab, Layout, Text, Icon  } from '@ui-kitten/components';

import '../../services/Notifications';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';

  
  const Settings = (props) => (
	<Icon {...props} name='settings-outline'/>
  );
  
  const Home = (props) => (
	<Icon {...props} name='home-outline'/>
  );
  
const Tab = createBottomTabNavigator();
const { Navigator, Screen } = createBottomTabNavigator();
const BottomTabBar = ({ navigation, state }) => (
	<BottomNavigation
	style={{marginBottom:30}}
	indicatorStyle={{backgroundColor: '#FFAA00'}}
	  selectedIndex={state.index}
	  onSelect={index => navigation.navigate(state.routeNames[index])}>
	  <BottomNavigationTab title='Эхлэл' icon={Home}/>
	  <BottomNavigationTab title='Тохиргоо' icon={Settings}/>
	</BottomNavigation>
  );
  
export default function AppStack() {
	return (
		<Navigator tabBar={props => <BottomTabBar {...props} />}>
		<Screen name='HomeScreen' component={HomeScreen}/>
		<Screen name='SettingsScreen' component={SettingsScreen}/>
	  </Navigator>
	);
}
