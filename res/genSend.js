const errStatus = require('./status.js')

function successSend(data, msg){
	return {
		code: 1,
		data,
		msg,
	}
}

function failSend(data, code = 200, msg = ''){
	return {
		code,
		data,
		msg: msg || errStatus[code] || ''
	}
}

module.exports = {
	successSend,
	failSend,
}