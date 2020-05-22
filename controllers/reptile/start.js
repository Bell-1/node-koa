const fs = require('fs');
const cheerio = require('cheerio');
const http = require('./http.js');
const config = require('./config.js');
const merge = require('./fileMerge.js');
let list = [];
let pageInfo = [];
let finish = 0;

/**
 * 开始
 */
function start() {
	list = [];
	http.request(config.url + config.home).then(html => {
		disposeHtml(html);
	})
}

/**
 * 获取目录页
 * @param {*} html 
 */
function disposeHtml(html) {
	let $ = cheerio.load(html);
	let root = $(config.root);
	let domList = root.find('a');
	domList.each(function () {
		const href = $(this).attr('href');
		const name = $(this).text();
		list.push({
			name,
			href
		});
	})
	// fetchAllNoPageNation();
	pagenation();
}
/**
 * 分批
 */
function pagenation() {
	const total = list.length;
	const singleNum = total / config.fetchNum;
	for (let i = 0; i < config.fetchNum; i++) {
		pageInfo.push(list.slice(i * singleNum, (i + 1) * singleNum));
	}
	fetchAll();
}
/**
 * 分批获取
 */
function fetchAll() {
	for (let k in pageInfo) {
		let name = './' + config.fileName + k + '.txt';
		fetchSingle(pageInfo[k], name, 0);
	}
}
/**
 * 不分批获取
 */
function fetchAllNoPageNation() {
	let name = './' + config.fileName + '.txt';
	fetchSingle(list, name, 0);
}
/**
 * 获取单篇文章
 * @param {*} list 
 * @param {*} name 
 * @param {*} i 
 */
function fetchSingle(list, name, i) {
	if (list.length === i) {
		console.log('a list finished')
		if (config.fetchNum === ++finish) {
			merge.startMerge();
		}
		return;
	}
	http.request(config.url + list[i].href).then(html => {
		const data = disposeSingleHtml(html);
		const title = list[i].name;
		fs.appendFileSync(name, title);
		fs.appendFileSync(name, data);
		console.log(title, '写入成功');
		fetchSingle(list, name, ++i);
	})
}
/**
 * 处理文章页面数据
 * @param {*} html 
 */
function disposeSingleHtml(html) {
	let $ = cheerio.load(html);
	let data = $(config.content).text();
	return data;
}






start();