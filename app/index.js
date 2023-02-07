const CrawlEnt100List = require('./CrawlEnt100List.js');
const CrawlStockInfo = require('./CrawlStockInfo.js');
const fs = require('fs');
const Papa = require('papaparse');

(async () => {
  let list = await CrawlEnt100List()

  for (let i = 0; i < list.length; i++) {
    let {id, name} = list[i]

    let info = await CrawlStockInfo(id)

    list[i] = {
      id,
      name,
      ...info
    }
  }

  list.sort((a, b) => {
    return b.DividendRecentAvg - a.DividendRecentAvg
  })

  fs.writeFileSync('output/stock168.json', JSON.stringify(list, null, 2));

  let csv = Papa.unparse(list);
  fs.writeFileSync('output/stock168.csv', csv);
})();
