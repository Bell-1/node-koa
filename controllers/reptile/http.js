const HTTP = require('http');
const HTTPS = require('https');


function request(url) {
	return new Promise(function (resolve, reject) {
		let http = url.indexOf('https') > -1 ? HTTPS : HTTP;

		http.get(url, (res) => {
			const {
				statusCode
			} = res;
			const contentType = res.headers['content-type'];

			let error;
			if (statusCode !== 200) {
				error = new Error('Request Failed.\n' +
					`Status Code: ${statusCode}`);
			}
			if (error) {
				// Consume response data to free up memory
				console.error(error.message);
				res.resume();
				reject();
				return;
			}

			let html = '';
			res.on('data', (chunk) => {
				html += chunk;
			});
			res.on('end', () => {
				resolve(html);
			});
		}).on('error', (e) => {
			reject();
			console.error(`Got error: ${e.message}`);
		});
	})

}


module.exports = {
	request
}