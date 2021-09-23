const config = require('config-lite')(__dirname);
import sha1 from 'crypto-js/sha1';

export const checkSignature = (query) =>{
  const {signature, timestamp, nonce} = query;
  console.log(query)
  const token = config.wxToken;
  const tmpArr = [token, timestamp, nonce].sort();
	
  //3.将三个参数字符串拼接成一个字符串进行sha1加密
  var tempStr = tmpArr.join('');
  const hashCode = sha1(tempStr); //创建加密类型
  console.log('源数据', signature)
  console.log('加密数据', hashCode)
  return signature;
    
}