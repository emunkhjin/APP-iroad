import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import Updates from 'expo-updates';

import Providers from './src/pages';
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
// YellowBox.ignoreWarnings(['Setting a timer']);
LogBox.ignoreAllLogs();


export default function App() {
	useEffect(() => {
		async function updateApp() {
			try {
				const { isAvailable } = await Updates.checkForUpdateAsync();

				if (isAvailable) await Updates.fetchUpdateAsync();
			} catch (ex) {}
		}

		updateApp();
	}, []);

	return <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <Providers />
    </ApplicationProvider>
  </>;
}
