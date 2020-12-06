import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './HomeScreen';



import { ActionSheetIOS, StyleSheet, Text, View, Alert } from "react-native";


import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "@ui-kitten/components";
import Add from "./Add";
const Stack = createStackNavigator();

export default function HomeStack() {
	
	return (
		<Stack.Navigator>
			<Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: "Нүүр хуудас",
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Add")}>
              <Icon style={styles.icon} fill="orange" name="plus-circle-outline" />
            </TouchableOpacity>
            // <Button title="Нэмэх" onPress={() => navigation.navigate("Add")} />
          ),
        })}
      />
	  <Stack.Screen
        name="Add"
        component={Add}
        options={({ navigation }) => ({
          title: "Мэдээлэл илгээх",
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Tuslah heseg",
                  "Medeeleluudee buren guitsed hiisnii daraa medeelel ilgeeh tovchn deer darna uu ",
                  [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                  { cancelable: false }
                )
              }
            >
              <Icon style={styles.icon} fill="#8F9BB3" name="info" />
            </TouchableOpacity>

            // <Button title="Гарах" onPress={handleSignOut} />
          ),
        })}
      />
		</Stack.Navigator>
	);
}
const styles = StyleSheet.create({
	icon: {
	  width: 32,
	  height: 32,
	  margin: 10,
	},
  });
