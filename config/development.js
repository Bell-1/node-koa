'use strict';

module.exports = {
	port: parseInt(process.env.PORT, 10) || 3333,
	url: 'mongodb://localhost:27017/belldb',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 365 * 24 * 60 * 60 * 1000,
		}
	},
	pwdSecret: 'bell5200',
	secretOrPrivateKey: 'bell5200'
}