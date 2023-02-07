const fetch = require('node-fetch');
const iconv = require('iconv-lite');

const NodeCacheSqlite = require('./NodeCacheSqlite.js');

module.exports = async function (url, cacheDay = 0.5, encoding = null) {
  return await NodeCacheSqlite.get('GetHTML', url, async function () {
    console.log('GetHTML', url)
    const response = await fetch(url);

    if (!encoding) {
      return await response.text()
    }
    else {
      const buffer = await response.arrayBuffer()
      return iconv.decode(Buffer.from(buffer), encoding)
    }
  }, parseInt(cacheDay * 1000 * 60 * 60 * 24, 10))
}