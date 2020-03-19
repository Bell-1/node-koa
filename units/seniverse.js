import { SeniverseV3 } from 'seniverse-api'

const apis = {
    'weatherNow': 'weather/now', //当前天气
    'weatherDaily': 'weather/daily', //未来几天天气
}


function newSeniverseV3 (){
    const seniverseV3 = new SeniverseV3({
        encryption: {
            uid: 'Ptx5Tep2rZJSM581v', // 公钥
            key: 'Stlv9dBNGfJH3APlt', // 私钥
            ttl: 10000, // 签名失效时间
            enabled: false // 是否进行签名验证
        },
        query: {
            unit: 'c', // 单位
            location: 'hangzhou',
            language: 'zh-Hans', // 结果返回语言
            timeouts: [3000, 3000] // 重试次数和超时时间
        },
        // 内存缓存
        cache: {
            ttl: 100, // 缓存时间，单位为秒，可以为 'auto'
            max: 1000, // 缓存数据条数
            enabled: true // 是否开启缓存
        },
        returnRaw: false // 是否直接返回 API 原始数据
    })

    return seniverseV3;
}

module.exports = { newSeniverseV3, apis };