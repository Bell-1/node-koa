const http = require('./http.js');
const cheerio = require('cheerio');

/**
 * 获取目录页
 * @param {*} html 
 */
function disposeHtml(html, mainEl) {
    let list = [];
    let $ = cheerio.load(html);
    let root = $(mainEl);
    let domList = root.find('a');
    domList.each(function() {
        const href = $(this).attr('href');
        const name = $(this).text();
        list.push({
            name,
            href
        });
    })
    return list
}


/**
 * 处理文章页面数据
 * @param {*} html 
 */
function disposeSingleHtml(html, contentEl) {

    return data;
}

export async function getCatalog(ctx) {
    const body = ctx.request.body;
    try {
        const { site, main, mainEl } = body;
        const url = `${site}/${main}`
        const html = await http.request(url);
        const catalog = disposeHtml(html, mainEl);
        ctx.body = ctx.successSend(catalog, '获取目录');
    } catch (error) {
        console.log('get catalog error: ', error);
        ctx.req.status = 500;
        ctx.body = ctx.failSend();
    }
}


export async function getNovel(ctx) {
    const body = ctx.request.body;
    try {
        const { url, content } = body;
        const html = await http.request(url);
        const $ = cheerio.load(html);
        const novel = $(content).html();
        if (novel) {
            ctx.body = ctx.successSend(novel, '获取内容');
        } else {
            throw new Error('没有数据')
        }
    } catch (error) {
        console.log(error);
        ctx.req.status = 500;
        ctx.body = ctx.failSend();
    }
}