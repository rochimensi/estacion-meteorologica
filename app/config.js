require('dotenv').config({ path: './.env' });

const config = {
	email: {
		email: process.env.EMAIL,
		password: process.env.EMAIL_PSSWD
	},

	env: process.env.NODE_ENV || 'dev',

	database: {
		uri: process.env.DATABASE_URL || 'mongodb://localhost/estacion-meteorologica'
	},

	jwt: {
		secret: "test"
	},

	users: {
		admin: "arqav2018@gmail.com",
		user: "arqav2018+user@gmail.com",
		adminPassword: "1234",
		userPassword: "5678"
	},

	serial: {
		portName: "COM3"
	},

	server: {
		port: 4000
	},

	settings: {
		barrido: {
			inicio: "2",
			fin: "4"
		},
		delay: 1000,
		leds: {
			rojo: "9",
			verde: "6"
		}
	}
};

module.exports = config;