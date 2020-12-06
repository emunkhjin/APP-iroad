import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import AsyncStorage from '@react-native-community/async-storage';

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
	'en-US': {
		welcome: {
			title: 'iRoad',
			login: 'Нэвтрэх',
			register: 'Бүртгүүлэх',
			'fb-login': 'Facebook -ээр нэвтрэх',
			'fb-login-error': 'Facebook -ээр нэвтрэх боломжгүй байна',
		},
		register: {
			'enter-name': 'Бүтэн нэр ',
			'enter-email': 'Цахим шуудан ',
			'enter-password': 'Нууц үг ',
			'confirm-password': 'Нууц үг давт',
			'enter-valid-mail': 'Үнэн зөв цахим шуудангаа оруулна уу ',
			'pass-min': 'Нууц үг дор хаяж  %{n} үсэг байх ёстой',
			'pass-confirm': 'Баталгаажуулах нууц үг хоорондоо таарах ёстой ',
			'pass-required': 'Нууц үгээ баталгаажуулах шаардлагатай',
		},
		login: {
			'registered-email': 'Бүртгүүлсэн цахим хаягаа оруулна уу',
			'forgot-password': 'Нууц үг мартсан',
		},
		'forgot-password': {
			'forgot-password': 'Нууц үг мартсан',
		},
		home: {},
		settings: {
			'push-notifications': 'Push Notifications',
			'upload-avatar': 'Зураг нэмэх',
			language: 'Хэл ',
			'sign-out': 'Системээс гарах',
		},
	},
	'en-MN': {
		welcome: {
			title: 'iRoad',
			login: 'Нэвтрэх',
			register: 'Бүртгүүлэх',
			'fb-login': 'Facebook -ээр нэвтрэх',
			'fb-login-error': 'Facebook -ээр нэвтрэх боломжгүй байна',
		},
		register: {
			'enter-name': 'Бүтэн нэр ',
			'enter-email': 'Цахим шуудан ',
			'enter-password': 'Нууц үг ',
			'confirm-password': 'Нууц үг давт',
			'enter-valid-mail': 'Үнэн зөв цахим шуудангаа оруулна уу ',
			'pass-min': 'Нууц үг дор хаяж  %{n} үсэг байх ёстой',
			'pass-confirm': 'Баталгаажуулах нууц үг хоорондоо таарах ёстой ',
			'pass-required': 'Нууц үгээ баталгаажуулах шаардлагатай',
		},
		login: {
			'registered-email': 'Бүртгүүлсэн цахим хаягаа оруулна уу',
			'forgot-password': 'Нууц үг мартсан',
		},
		'forgot-password': {
			'forgot-password': 'Нууц үг мартсан',
		},
		home: {},
		settings: {
			'push-notifications': 'Push Notifications',
			'upload-avatar': 'Зураг нэмэх',
			language: 'Хэл ',
			'sign-out': 'Системээс гарах',
		},
	},
	'pt-PT': {
		welcome: {
			title: 'iRoad',
			login: 'Нэвтрэх',
			register: 'Бүртгүүлэх',
			'fb-login': 'Facebook -ээр нэвтрэх',
			'fb-login-error': 'Facebook -ээр нэвтрэх боломжгүй байна',
		},
		register: {
			'enter-name': 'Бүтэн нэр ',
			'enter-email': 'Цахим шуудан ',
			'enter-password': 'Нууц үг ',
			'confirm-password': 'Нууц үг давт',
			'enter-valid-mail': 'Үнэн зөв цахим шуудангаа оруулна уу ',
			'pass-min': 'Нууц үг дор хаяж  %{n} үсэг байх ёстой',
			'pass-confirm': 'Баталгаажуулах нууц үг хоорондоо таарах ёстой ',
			'pass-required': 'Нууц үгээ баталгаажуулах шаардлагатай',
		},
		login: {
			'registered-email': 'Бүртгүүлсэн цахим хаягаа оруулна уу',
			'forgot-password': 'Нууц үг мартсан',
		},
		'forgot-password': {
			'forgot-password': 'Нууц үг мартсан',
		},
		home: {},
		settings: {
			'push-notifications': 'Push Notifications',
			'upload-avatar': 'Зураг нэмэх',
			language: 'Хэл ',
			'sign-out': 'Системээс гарах',
		},
	},
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
AsyncStorage.getItem('@language').then((lang) => {
	if (lang) i18n.locale = lang;
});

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = 'en-US';

export default i18n;

export const saveLanguage = () =>
	AsyncStorage.setItem('@language', i18n.locale);
