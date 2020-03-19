const errStatus = require('./status.js')

function successSend(data, msg){
	return {
		code: 1,
		data,
		msg,
	}
}

function failSend(code = -500, data){
	return {
		code,
		msg: errStatus[code] || '',
		data,
	}
}

module.exports = {
	successSend,
	failSend,
}