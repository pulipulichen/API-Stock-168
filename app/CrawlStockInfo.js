const StripHTML = require('./lib/StripHTML.js')
const GetHTML = require('./lib/GetHTML.js')

async function fetchURL(number) {
  let url = `https://tw.stock.yahoo.com/quote/${number}/dividend`
  try {
    result = await GetHTML(url)
  }
  catch (e) {
    return
  }
  return result
}

async function getStockDividendYield(number) {
  if (!number) {
    return
  }
  
  result = await fetchURL(number)
  if (!result) {
    return 
  }
   
  let head = `年平均現金殖利率`
  let foot = `%</span>`

  let pos1 = result.indexOf(head)
  let pos2 = result.indexOf(foot, pos1 + 1)

  result = result.slice(pos1, pos2)

  result = result.slice(result.indexOf(`<span class="Fw(b)">`) + 20)
  result = Number(result.trim()) / 100
  
  return result
}

async function getStockCategory(number) {
  if (!number) {
    return
  }
  
  result = await fetchURL(number)
  if (!result) {
    return 
  }
    
  let head = `Td(n) Px(8px) Py(3px) Fz(12px) Fw(b) Bdrs(11px) C(#188fff) Bgc($tag-bg-blue) Bgc($tag-bg-blue-hover):h`
  let foot = `</a>`

  let pos1 = result.indexOf(head)
  let pos2 = result.indexOf(foot, pos1 + 1)

  result = result.slice(pos1, pos2)

  result = result.slice(result.indexOf(`">`) + 2)
  
  return result
}

async function getStockCurrentLeft(number) {
  if (!number) {
    return
  }
  
  result = await fetchURL(number)
  if (!result) {
    return 
  }
    
  let head = `<div class="D(f) Ai(fe) Mb(4px)">`
  let foot = `</div>`

  let pos1 = result.indexOf(head)
  let pos2 = result.indexOf(foot, pos1 + 1)

  result = result.slice(pos1, pos2)

  let isPositive = true
  if (result.indexOf('border-color:#00ab5e transparent transparent transparent;border-width:9px 6.5px 0 6.5px') > -1) {
    isPositive = false
  } 

  result = StripHTML(result)
  result = result.replace(/,/g, '')
  result = result.replace(/\(/g, '')
  result = result.replace(/\)/g, '')
  result = result.split(' ')

  result = result.map((n, i) => {
    if (i === 1) {
      n = Number(n)
      if (isPositive === false) {
        n = -1 * n
      }
      return n
    }
    else if (i === 2) {
      n = n.slice(0, -1)
      n = Number(n)
      n = n / 100
      if (isPositive === false) {
        n = -1 * n
      }
      return n
    }
    
    return Number(n)
  }).map(n => {
    return Math.round(n * 1000000) / 1000000
  })
  
  return result
}

async function getStockCurrentRight(number) {
  if (!number) {
    return
  }
  
  result = await fetchURL(number)
  if (!result) {
    return 
  }
    
  let head = `<div class="D(f) Fld(c) Ai(c) Fw(b) Pend(8px) Bdendc($bd-primary-divider) Bdends(s) Bdendw(1px)">`
  let foot = `main-1-QuoteTabs-Proxy`

  let pos1 = result.indexOf(head)
  let pos2 = result.indexOf(foot, pos1 + 1)

  result = result.slice(pos1, pos2)

  let isPositive = true
  if (result.indexOf('border-color:#00ab5e transparent transparent transparent;border-width:9px 6.5px 0 6.5px') > -1) {
    isPositive = false
  } 

  result = StripHTML(result)
  result = result.replace(/,/g, '')
  result = result.replace(/\-/g, '0 (0)')
  result = result.replace(/\(/g, ' ')
  result = result.replace(/\)/g, ' ')
  result = result.replace(/%/g, '')
  
  while (result.indexOf('  ') > -1) {
    result = result.replace(/  /g, ' ')
  }

  result = result.split(' ')
  
  result = result.map((n, i) => {
    if (i === 0 || i === 2 || i === 3 || i === 7) {
      n = Number(n)
      n = Math.round(n * 1000000) / 1000000
    }
    
    if (i === 7) {
      n = n / 100
      n = Math.round(n * 1000000) / 1000000
      if (isPositive === false) {
        n = -1 * n
      }
    }
    return n
  }).map(n => {
    if (!n) {
      return 0
    }
    return n
  })
  
  return result
}

async function getStockCurrentTurnover(number) {
  let right = await getStockCurrentRight(number)
  if (!right) {
    return
  }
  return right[0]
}

async function getStockCurrentPE(number) {
  let right = await getStockCurrentRight(number)
  if (!right) {
    return
  }
  return right[2]
}

async function getStockCurrentPEAvg(number) {
  let right = await getStockCurrentRight(number)
  if (!right) {
    return
  }
  let output = right[3]
  if (output) {
    return output
  }
  else {
    return 0
  }
}

async function getStockCurrentRecentTrendComment(number) {
  let right = await getStockCurrentRight(number)
  if (!right) {
    return
  }
  return right[6]
}

async function getStockCurrentRecentTrendPercent(number) {
  let right = await getStockCurrentRight(number)
  if (!right) {
    return
  }
  return right[7]
}

async function getStockDividend(number) {
  if (!number) {
    return
  }

  result = await fetchURL(number)
  if (!result) {
    return 
  }

  let head = `<h2 class="Fz(24px) Fz(20px)--mobile Fw(b)">歷年股利政策</h2>`
  let foot = `<ul class="Mt(16px)">`

  let pos1 = result.indexOf(head)
  let pos2 = result.indexOf(foot, pos1 + 1)

  result = result.slice(pos1, pos2)

  result = result.slice(result.indexOf(`<ul class="M(0) P(0) List(n)">`) + 30, result.indexOf('</ul>'))

  result = result.split('</li>').map(l => {
    // let xmlDoc = Xml.parse(l + '</li>', true)
    return StripHTML(l + '</li>').split(' ')
  })

  return result
}

async function getStockDividendRecent(number, yearsInterval = 5) {
  if (!number) {
    return
  }

  let data = await getStockDividend(number)
  if (!data) {
    return []
  }

  let currentYear = (new Date()).getFullYear()
  let afterYear = currentYear - yearsInterval

  result = {}

  for (let i = 0; i < data.length; i++) {
    let d = data[i]

    // let year = Number(d[4].split('/')[0])
    let year = Number(d[0].slice(0, 4))
    if (year < afterYear) {
      break
    }

    let yearString = year + ''

    if (!result[yearString]) {
      result[yearString] = 0
    }

    let dividend = d[3]
    if (dividend === '-') {
      continue
    }
    dividend = Number(dividend.slice(0, -1)) / 100

    result[yearString] = result[yearString] + dividend
  }

  let output = Object.keys(result).map(year => {
    return [
      Number(year),
      result[year]
    ]
  })

  output.sort((a, b) => b[0] - a[0])

  return output
}

async function getStockDividendRecentAvg(number, yearsInterval = 5) {
  if (!number) {
    return
  }

  let data = await getStockDividendRecent(number, yearsInterval)
  let dividend = data.map(row => row[1])
  let avg = dividend.reduce((a, b) => a + b, 0) / yearsInterval;

  avg = Math.round(avg * 1000000) / 1000000

  return avg
}

async function getStockDividendRecentCount(number, yearsInterval = 5) {
  if (!number) {
    return
  }

  let data = await getStockDividendRecent(number, yearsInterval)
  result = data.filter(d => d[1] !== 0).length

  return result
}

async function getStockDividendRecentSlope(number, yearsInterval = 5) {
  if (!number) {
    return
  }

  let data = await getStockDividendRecent(number, yearsInterval)
  if (!data) {
    return -999
  }

  // let dividend = data.map(row => row[1])
  // return dividend.reduce((a, b) => a + b, 0) / dividend.length;
  let first = data[0]
  let last = data[(data.length - 1)]

  if (!first || !last) {
    return -999
  }

  result = calculateSlope(last[0], last[1], first[0], first[1])

  result = Math.round(result * 1000000) / 1000000

  return result
}

function calculateSlope(x1, y1, x2, y2) {
        // rise over run
    var s = (y1 - y2) / (x1 - x2);
    /*if (x1==x2) {
        // slope is Infinity or -Infinity
    }*/
    return s;
}

async function getStockCurrentClosingPrice(number) {
  let left = await getStockCurrentLeft(number)
  if (!left) {
    return
  }
  return left[0]
}

async function getStockCurrentTrend(number) {
  let left = await getStockCurrentLeft(number)
  if (!left) {
    return
  }
  return left[1]
}

async function getStockCurrentTrendPercent(number) {
  let left = await getStockCurrentLeft(number)
  if (!left) {
    return
  }
  return left[2]
}

module.exports = async function (id = 3008) {
  return {
    DividendRecentAvg: await getStockDividendRecentAvg(id),
    DividendRecentSlope: await getStockDividendRecentSlope(id),
    Category: await getStockCategory(id),
    CurrentClosingPrice: await getStockCurrentClosingPrice(id),
    CurrentTrend: await getStockCurrentTrend(id),
    CurrentTrendPercent: await getStockCurrentTrendPercent(id),
    CurrentTurnover: await getStockCurrentTurnover(id),
    CurrentPE: await getStockCurrentPE(id),
    CurrentPEAvg: await getStockCurrentPEAvg(id),
    CurrentRecentTrendPercent: await getStockCurrentRecentTrendPercent(id),
    CurrentRecentTrendComment: await getStockCurrentRecentTrendComment(id),
    URL: `https://tw.stock.yahoo.com/quote/${id}/dividend`
  }
}