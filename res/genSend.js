const errStatus = require('./status.js')

function successSend(data, msg){
	return {
		code: 1,
		data,
		msg,
	}
}

function failSend(code = -500, msg = ''){
	return {
		code,
		msg: msg || errStatus[code] || ''
	}
}

module.exports = {
	successSend,
	failSend,
}