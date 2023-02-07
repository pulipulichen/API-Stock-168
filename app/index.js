const CrawlEnt100List = require('./CrawlEnt100List.js');
const fs = require('fs');


(async () => {
  let result = await CrawlEnt100List()
  fs.writeFileSync('output/nodejs.txt', JSON.stringify(result, null, 4));
})();
