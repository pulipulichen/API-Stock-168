const fetch = require('node-fetch');

module.exports = async function () {
  let url = `http://moneydj.emega.com.tw/js/T50_100.htm`

  // let result = LIBRARYcache.fetchURL(url, 'BIG5')
  const response = await fetch('https://reddit.com/');
  let result = await response.text();

  let head = `<table width='600' border='0' align='center' cellpadding='0' cellspacing='1' class='TableBorder'>`
  let foot = `</table>`

  let pos1 = result.lastIndexOf(head)
  let pos2 = result.indexOf(foot, pos1 + 1)

  result = result.slice(pos1 + head.length, pos2).trim()


  // head = `<ul style="display: block;">`
  // pos1 = result.indexOf(head)
  // pos2 = result.indexOf(`</ul>`, pos1 + 1)
  result = result.slice(result.indexOf('</tr>')).trim()

  result = result.split(`<FONT color='blue'>＃</FONT>&nbsp;`).join('')
  result = result.split(`<FONT color='red'>＊</FONT>&nbsp;`).join('')
  result = result.split(`&nbsp;`).join('')

  let trList = result.split('</tr>').slice(0, -1)

  let output = []

  trList.forEach(tr => {
    let tdList = tr.split('</td>').slice(0, -1)

    for (let i = 0; i < tdList.length; i = i + 2) {
      let id = LIBRARYcache.stripHtml(tdList[i])
      if (id === '') {
        continue
      }
      id = Number(id)
      if (isNaN(id)) {
        continue
      }

      let name = LIBRARYcache.stripHtml(tdList[i+1])

      if (id === 6285) {
        name = '啟碁'
      }
      else if (id === 2353) {
        name = '宏碁'
      }

      output.push([
        id,
        name
      ])
    }
  })

  return output
}