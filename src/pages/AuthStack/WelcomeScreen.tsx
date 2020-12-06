import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import { loginWithFacebook } from '../../services/Firebase';
import i18n from '../../services/Translations';
import AppButton from '../../components/AppButton';
import Colors from '../../utils/colors';
import useStatusBar from '../../hooks/useStatusBar';
import LogoRoad from "./icons/logo";
import { Text } from "@ui-kitten/components";
export default function WelcomeScreen({ navigation }) {
	useStatusBar('light-content');

	async function facebookAuth() {
		try {
			await loginWithFacebook();
		} catch {
			alert(i18n.t('welcome.fb-login-error'));
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.logoContainer}>
			<LogoRoad
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 16,
          bottom: 0,
        }}
      />
				
        {/* <Image source={require('../assets/flame.png')} style={styles.logo} /> */}
        <Text style={styles.text} category="h1" status="warning">
          iRoad
        </Text>
        <Text style={styles.text} category="c1" status="warning">
          Aвто-замын аюултай нөхцөл байдлыг мэдээлэх систем
        </Text>
     
			</View>
			<View style={styles.buttonContainer}>
				<AppButton
					title={i18n.t('welcome.login')}
					onPress={() => navigation.navigate('Login')}
				/>
				<AppButton
					title={i18n.t('welcome.register')}
					color="secondary"
					onPress={() => navigation.navigate('Register')}
				/>
				<AppButton
					title={
						<>
							{i18n.t('welcome.fb-login')}{' '}
							<Entypo name="facebook" size={18} />
						</>
					}
					color="facebook"
					onPress={facebookAuth}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: Colors.mediumGrey,
	},
	logoContainer: {
		position: 'absolute',
		top: 60,
		alignItems: 'center',
	},
	logo: {
		width: 125,
		height: 125,
	},
	subtitle: {
		fontSize: 24,
		fontWeight: '600',
		paddingVertical: 20,
		color: Colors.primary,
	},
	buttonContainer: {
		padding: 20,
		paddingBottom: 60,
		width: '100%',
	},
});
