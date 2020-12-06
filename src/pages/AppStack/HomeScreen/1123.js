import React, { Component, useState, useEffect } from 'react';
import {
	ActivityIndicator,
	Image,
	StatusBar,
	StyleSheet,
	View,
	Alert,
	SafeAreaView,
	ScrollView,
	Vibration,
	Dimensions,
} from 'react-native';
//import { Text, Button, Input } from 'react-native-ui-kitten'
import {
	Text,
	Button,
	Icon,
	Card,
	Input,
	Layout,
	ButtonGroup,
} from '@ui-kitten/components';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import uuid from 'uuid';
import * as firebase from 'firebase';
import MapView from 'react-native-maps';
import 'firebase/firestore';
import { FontAwesome5 } from '@expo/vector-icons';

const StarIcon = (props) => <Icon {...props} name="plus" />;

const firebaseConfig = {
	apiKey: 'AIzaSyA8yEtEb43d9vKJ68QevCceu025047Xd6Q',
	authDomain: 'iroad-d0ce7.firebaseapp.com',
	databaseURL: 'https://iroad-d0ce7.firebaseio.com',
	projectId: 'iroad-d0ce7',
	storageBucket: 'iroad-d0ce7.appspot.com',
	messagingSenderId: '1094036965431',
	appId: '1:1094036965431:web:1bc7ad3bce265a8f7fd7b2',
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

// let addItem = item => {
//     const dbh = firebase.firestore().collection("Report");
//     var username = firebase.auth().currentUser.uid;
//     var userEmail = firebase.auth().currentUser.email;
//     dbh.add({
//       name: item,
//       date: new Date(),
//       uid: username,
//       email: userEmail,
//       //location: text,
//       //photo: App.state.image,
//     });
//   };

export default class App extends React.Component {
	state = {
		location: null,
		image: null,
		uploading: false,
		name: '',
		text: '',
		duureg: '',
		latitude: '',
		longtitude: '',
		selectedOption: '',
		focusedLocation: {
			latitude: 47.92123,
			longitude: 106.918556,
			latitudeDelta: 0.0122,
			longitudeDelta:
				(Dimensions.get('window').width /
					Dimensions.get('window').height) *
				0.0122,
		},
		locationChosen: false,
	};
	pickLocationHandler = (event) => {
		const coords = event.nativeEvent.coordinate;
		this.map.animateToRegion({
			...this.state.focusedLocation,
			latitude: coords.latitude,
			longitude: coords.longitude,
		});
		this.setState((prevState) => {
			return {
				focusedLocation: {
					...prevState.focusedLocation,
					latitude: coords.latitude,
					longitude: coords.longitude,
				},
				locationChosen: true,
			};
		});
		console.log(this.state.focusedLocation);
	};
	getLocationHandler = () => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const coordsEvent = {
					nativeEvent: {
						coordinate: {
							latitude: pos.coords.latitude,
							longitude: pos.coords.longitude,
						},
					},
				};
				this.pickLocationHandler(coordsEvent);
			},
			(err) => {
				console.log(err);
				alert(
					'Fetching the Position failed, please pick one manually!'
				);
			}
		);
	};

	async componentDidMount() {
		await Permissions.askAsync(Permissions.CAMERA_ROLL);
		await Permissions.askAsync(Permissions.CAMERA);
		let initialLoad = true;
		this.setState({ loading: true });

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const location = JSON.stringify(position);
				const latitude = JSON.stringify(position.coords.latitude);
				const longtitude = JSON.stringify(position.coords.longitude);
				this.setState({ location, latitude, longtitude });
			},
			(error) => Alert.alert(error.message),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		);
		//console.log(JSON.stringify(this.state.longtitude));

		firebase
			.firestore()
			.collection('Evdrel')
			.on('value', (snapshot) => {
				this.setState({ text: snapshot.val() && snapshot.val().text });

				if (initialLoad) {
					this.setState({ loading: false });
					initialLoad = false;
				}
			});
	}

	render() {
		let { image } = this.state;
		const navigation = this.state;
		let marker = null;

		if (this.state.locationChosen) {
			marker = <MapView.Marker coordinate={this.state.focusedLocation} />;
		}
		return (
			//<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<SafeAreaView style={styles.container}>
				<ScrollView style={styles.scrollView}>
					<View>
						<React.Fragment>
							<View style={styles.details}></View>

							<RNPickerSelect
								placeholder={{ label: 'Дүүрэг сонгох' }}
								style={pickerSelectStyles}
								onValueChange={(value) =>
									this.setState({ selectedOption: value })
								}
								items={[
									{
										label: 'Багануур дүүрэг',
										value: 'Багануур дүүрэг',
									},
									{
										label: 'Багахангай дүүрэг',
										value: 'Багахангай дүүрэг',
									},
									{
										label: 'Налайх дүүрэг',
										value: 'Налайх дүүрэг',
									},
									{
										label: 'Баянзүрх дүүрэг',
										value: 'Баянзүрх дүүрэг',
									},
									{
										label: 'Сүхбаатар дүүрэг',
										value: 'Сүхбаатар дүүрэг',
									},
									{
										label: 'Чингэлтэй дүүрэг',
										value: 'Чингэлтэй дүүрэг',
									},
									{
										label: 'Баянгол дүүрэг',
										value: 'Баянгол дүүрэг',
									},
									{
										label: 'Хан-Уул дүүрэг',
										value: 'Хан-Уул дүүрэг',
									},
									{
										label: 'Сонгинохайрхан дүүрэг',
										value: 'Сонгинохайрхан дүүрэг',
									},
								]}
								useNativeAndroidPickerStyle={false}
							/>
							<Input
								textStyle={{ minHeight: 64 }}
								placeholder="Мэдээлэл энд дарж бичнэ үү"
								style={{ margin: 20 }}
								onChangeText={(text) => {
									this.setState({ text });
								}}
								//onSubmitEditing={this._saveValue}
								status="basic"
								value={this.state.text}
								style={styles.textInput}
							/>
							<View style={styles.controlContainer}>
								<ButtonGroup
									style={styles.buttonGroup}
									status="basic"
								>
									<Button onPress={this._pickImage}>
										{/* Pick */}
										<FontAwesome5
											name="image"
											size={50}
											color="black"
										/>
										 
									</Button>

									<Button
										onPress={this._takePhoto}
										appearance="outline"
									>
										{/* Take */}
										<FontAwesome5
											name="camera"
											size={50}
											color="black"
										/>
										 
									</Button>
								</ButtonGroup>
							</View>
							{this._maybeRenderImage()}
							<View style={styles.controlContainer}>
								<MapView
									initialRegion={this.state.focusedLocation}
									region={
										!this.state.locationChosen
											? this.state.focusedLocation
											: null
									}
									style={styles.mapStyle}
									onPress={this.pickLocationHandler}
									ref={(ref) => (this.map = ref)}
								>
									{marker}
								</MapView>

								<Button onPress={this.getLocationHandler}>
									ASD
								</Button>
							</View>

							<Button
								style={{ alignSelf: 'stretch', height: 70 }}
								appearance="outline"
								status="warning"
								accessoryLeft={StarIcon}
								onPress={this._saveValue}
							>
								Мэдээлэл илгээх
							</Button>
						</React.Fragment>
						{this._maybeRenderUploadingOverlay()}
						<StatusBar barStyle="default" />
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}

	_maybeRenderUploadingOverlay = () => {
		if (this.state.uploading) {
			return (
				<View
					style={[
						StyleSheet.absoluteFill,
						{
							backgroundColor: 'rgba(0,0,0,0.4)',
							alignItems: 'center',
							justifyContent: 'center',
						},
					]}
				>
					<ActivityIndicator color="#fff" animating size="small" />
				</View>
			);
		}
	};

	_maybeRenderImage = () => {
		let { image } = this.state;
		if (!image) {
			return;
		}

		return (
			<View
				style={{
					marginTop: 10,
					width: 400,
					borderRadius: 3,
					elevation: 2,
				}}
			>
				<View
					style={{
						borderTopRightRadius: 3,
						borderTopLeftRadius: 3,
						shadowColor: 'rgba(0,0,0,1)',
						shadowOpacity: 0.2,
						shadowOffset: { width: 4, height: 4 },
						shadowRadius: 5,
						overflow: 'hidden',
					}}
				>
					<Image
						source={{ uri: image }}
						style={{ width: 400, height: 300 }}
					/>
				</View>

				{/* <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
          {image}
        </Text> */}
			</View>
		);
	};

	_saveValue = async () => {
		try {
			this.setState({ loading: true });
			var username = firebase.auth().currentUser.uid;
			var userEmail = firebase.auth().currentUser.email;

			await firebase.firestore().collection('Evdrel').add({
				text: this.state.text,
				photo: this.state.image,
				date: new Date(),
				uid: username,
				email: userEmail,
				bairshil: this.state.location,
				complete: false,
				latitude: this.state.focusedLocation.latitude,
				longtitude: this.state.focusedLocation.longitude,
				cat: this.state.selectedOption.toString(),
			});

			//return navigation.navigate("Home");
		} catch (e) {
			alert(e);
		} finally {
			this.setState({ loading: false });
			alert('Мэдээлэл амжилттай нэмэгдлээ!');
			console.log('HomeScreen luu butslaa');
			Vibration.vibrate();
			{
				this.props.navigation.goBack();
			}
		}
	};

	_maybeRenderLoadingOverlay = () => {
		if (this.state.loading) {
			return (
				<View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
					<ActivityIndicator color="#fff" animating size="large" />
				</View>
			);
		}
	};

	_takePhoto = async () => {
		let pickerResult = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [4, 3],
		});

		this._handleImagePicked(pickerResult);
	};

	_pickImage = async () => {
		let pickerResult = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [4, 3],
		});

		this._handleImagePicked(pickerResult);
	};

	_handleImagePicked = async (pickerResult) => {
		try {
			this.setState({ uploading: true });

			if (!pickerResult.cancelled) {
				let uploadUrl = await uploadImageAsync(pickerResult.uri);
				this.setState({ image: uploadUrl });
			}
		} catch (e) {
			console.log(e);
			alert('Upload failed, sorry :(');
		} finally {
			this.setState({ uploading: false });
		}
	};
}
async function uploadImageAsync(uri) {
	// Why are we using XMLHttpRequest? See:
	// https://github.com/expo/expo/issues/2402#issuecomment-443726662
	const blob = await new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			resolve(xhr.response);
		};
		xhr.onerror = function (e) {
			console.log(e);
			reject(new TypeError('Network request failed'));
		};
		xhr.responseType = 'blob';
		xhr.open('GET', uri, true);
		xhr.send(null);
	});

	const ref = firebase.storage().ref().child(uuid.v4());
	const snapshot = await ref.put(blob);

	// We're done with the blob, close and release it
	blob.close();

	return await snapshot.ref.getDownloadURL();
}

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 16,
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 4,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
	},
	inputAndroid: {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 0.5,
		borderColor: 'purple',
		borderRadius: 8,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
	},
});

const styles = StyleSheet.create({
	main: {
		flex: 1,
		padding: 30,
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: '#6565fc',
	},
	title: {
		marginBottom: 20,
		fontSize: 25,
		textAlign: 'center',
	},
	itemInput: {
		height: 50,
		padding: 4,
		marginRight: 5,
		fontSize: 23,
		borderWidth: 1,
		borderColor: 'white',
		borderRadius: 8,
		color: 'white',
	},
	buttonText: {
		fontSize: 18,
		color: '#111',
		alignSelf: 'center',
	},
	button: {
		height: 45,
		flexDirection: 'row',
		backgroundColor: 'white',
		borderColor: 'white',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		marginTop: 10,
		alignSelf: 'stretch',
		justifyContent: 'center',
	},
	card: {
		margin: 2,
	},
	mapStyle: {
		width: 400,
		height: 200,
	},
	buttonGroup: {
		margin: 2,
		justifyContent: 'center',
	},
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	card: {
		margin: 2,
	},
	controlContainer: {
		borderRadius: 60,
		margin: 10,
		padding: 10,
		alignSelf: 'stretch',
		justifyContent: 'center',
		backgroundColor: '#eb5e28',
	},
	container: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	scrollView: {
		marginHorizontal: 10,
	},
	catt: {
		alignSelf: 'stretch',
		justifyContent: 'center',
	},
});
