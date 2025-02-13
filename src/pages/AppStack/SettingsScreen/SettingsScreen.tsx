import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, Switch } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Updates from 'expo-updates';

import ScrollPicker from 'react-native-picker-scrollview';

import {
	registerForPushNotificationsAsync,
	sendPushNotification,
} from '../../../services/Notifications';
import i18n, { saveLanguage } from '../../../services/Translations';
import { countryCodeToFlag } from '../../../utils/countries';
import useStatusBar from '../../../hooks/useStatusBar';
import {
	logout,
	uploadAvatar,
	saveExpoPushToken,
} from '../../../services/Firebase';
import { AuthUserContext } from '../../AuthUserProvider';
import InfoText from '../../../components/Menu/InfoText';
import BaseIcon from '../../../components/Menu/Icon';

export default function HomeScreen() {
	useStatusBar('dark-content');

	const [expoPushToken, setExpoPushToken] = useState('');
	const [selectCountry, setSelectCountry] = useState(false);
	const { user, setUser } = useContext(AuthUserContext);

	const [, updateState] = React.useState();
	const forceUpdate = React.useCallback(() => updateState({}), []);

	useEffect(() => {
		registerForPushNotificationsAsync().then((token) => {
			if (!token) return;

			setExpoPushToken(token);
			saveExpoPushToken(token);
		});
	}, []);

	async function handleSignOut() {
		try {
			await logout();
		} catch (error) {
			console.log(error);
		}
	}

	async function getPermissionAsync() {
		if (Constants.platform?.ios) {
			const { status } = await Permissions.askAsync(
				Permissions.CAMERA_ROLL
			);
			if (status !== 'granted') {
				alert(
					'Уучлаарай зурагруу хандах эрх өгнө үү!'
				);
			}
		}
	}

	async function _pickImage() {
		try {
			await getPermissionAsync();

			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.8,
			});
			if (!result.cancelled) {
				const response = await fetch(result.uri);
				const blob = await response.blob();

				uploadAvatar(blob, result.uri, (new_user) => {
					setUser(new_user);
					forceUpdate();
				});
			}
		} catch {}
	}

	return (
		<ScrollView style={styles.scroll}>
			<View style={styles.userRow}>
				<View style={styles.userImage}>
					<Avatar
						rounded
						size="large"
						source={{
							uri:
								user?.photoURL ??
								'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
						}}
					/>
				</View>
				<View>
					<Text style={{ fontSize: 16 }}>{user?.displayName}</Text>
					<Text
						style={{
							color: 'gray',
							fontSize: 16,
						}}
					>
						{user?.email}
					</Text>
				</View>
			</View>
			<InfoText text="Account" />
			<View>
				{/* <ListItem
					style={styles.listItemContainer}
					onPress={() =>
						sendPushNotification({
							to: expoPushToken,
							sound: 'default',
							title: 'Сайн байна уу',
							body: 'And here is the body!',
							data: { data: 'goes here' },
						})
					}
				>
					<BaseIcon
						containerStyle={{
							backgroundColor: '#FFADF2',
						}}
						icon={{
							type: 'material',
							name: 'notifications',
						}}
					/>
					<ListItem.Content>
						<ListItem.Title>
							{i18n.t('settings.push-notifications')}
						</ListItem.Title>
					</ListItem.Content>
					<Switch onValueChange={() => {}} value={true} />
				</ListItem> */}

				<ListItem style={styles.listItemContainer} onPress={_pickImage}>
					<BaseIcon
						containerStyle={{
							backgroundColor: '#57DCE7',
						}}
						icon={{
							type: 'material',
							name: 'add-a-photo',
						}}
					/>
					<ListItem.Content>
						<ListItem.Title>
							{i18n.t('settings.upload-avatar')}
						</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron />
				</ListItem>

				{/* <ListItem
					style={styles.listItemContainer}
					onPress={() => setSelectCountry(true)}
				>
					<BaseIcon
						containerStyle={{ backgroundColor: '#FAD291' }}
						icon={{
							type: 'material',
							name: 'language',
						}}
					/>
					<ListItem.Content>
						<ListItem.Title>
							{i18n.t('settings.language')}
						</ListItem.Title>
						<ListItem.Subtitle>
							{countryCodeToFlag(i18n.locale)}
						</ListItem.Subtitle>
					</ListItem.Content>
					<Text>{i18n.locale}</Text>
					<ListItem.Chevron />
				</ListItem> */}

				<ListItem
					onPress={handleSignOut}
					style={styles.listItemContainer}
				>
					<ListItem.Content>
						<ListItem.Title style={styles.logoutText}>
							{i18n.t('settings.sign-out')}
						</ListItem.Title>
					</ListItem.Content>
				</ListItem>
			</View>

			{selectCountry && (
				<View>
					<ListItem
						onPress={() =>
							saveLanguage().then(() => Updates.reloadAsync())
						}
						style={{
							...styles.listItemContainer,
							alignContent: 'space-around',
						}}
					>
						<ListItem.Content>
							<ListItem.Title style={styles.saveLanguageText}>
								Save
							</ListItem.Title>
						</ListItem.Content>
					</ListItem>
					<ScrollPicker
						dataSource={Object.keys(i18n.translations).map(
							(k) => `${k} - ${countryCodeToFlag(k)}`
						)}
						selectedIndex={Object.keys(i18n.translations).indexOf(
							i18n.locale
						)}
						itemHeight={50}
						wrapperHeight={250}
						wrapperColor={'#ffffff'}
						highlightColor={'#d8d8d8'}
						renderItem={(data, index, isSelected) => {
							return (
								<View>
									<Text>{data}</Text>
								</View>
							);
						}}
						onValueChange={(data, selectedIndex) => {
							i18n.locale = Object.keys(i18n.translations)[
								selectedIndex
							];
							forceUpdate();
						}}
					/>
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scroll: {
		backgroundColor: 'white',
	},
	userRow: {
		alignItems: 'center',
		flexDirection: 'row',
		paddingBottom: 8,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 6,
	},
	userImage: {
		marginRight: 12,
	},
	listItemContainer: {
		height: 55,
		borderWidth: 0.5,
		borderColor: '#ECECEC',
	},
	logoutText: {
		color: '#007AFF',
		fontSize: 18,
		fontWeight: '400',
	},
	saveLanguageText: {
		color: '#007AFF',
		fontSize: 18,
		fontWeight: '400',
		alignSelf: 'flex-end',
	},
});
