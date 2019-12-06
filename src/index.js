// Early Moder Songscapes Book viewer
// Author: Raff Viglianti (MITH, UMD)
// 

parser = new DOMParser()
baseUrl = 'https://raw.githubusercontent.com/EarlyModernSongscapes/songscapes/master/data/tei/'
docName = 'Ayres_and_Dialogues%2C_For_One%2C_Two%2C_and_Three_Voyces-L638_1.xml'
// baseUrl = '/tei/'
songsBaseUrl = 'http://ems.digitalscholarship.utsc.utoronto.ca/islandora/object/'

function injectSong(href, songId, include) {
  return new Promise(function(res) {
    fetch(baseUrl + href)
      .then(function(includedRes) {
        return includedRes.text()
      }).then(function(includedXml) {
        song = new DOMParser().parseFromString(includedXml, 'text/xml')
        include.parentNode.replaceChild(song.querySelector('div[*|id="'+songId+'"]'), include)
        res()
      })
  })
}

idTable = {
  'song01': songsBaseUrl + 'ems%3A102',
  'song15': songsBaseUrl + 'ems%3A62',
  'song11': songsBaseUrl + 'ems%3A63',
  'song22': songsBaseUrl + 'ems%3A64',
  'song34': songsBaseUrl + 'ems%3A67',
  'song06': songsBaseUrl + 'ems%3A69',
  'song09': songsBaseUrl + 'ems%3A70',
  'song13': songsBaseUrl + 'ems%3A76',
  'song20': songsBaseUrl + 'ems%3A68',
  'song24': songsBaseUrl + 'ems%3A73',
  'song27': songsBaseUrl + 'ems%3A72',
  'song29': songsBaseUrl + 'ems%3A75',
  'song31': songsBaseUrl + 'ems%3A74',
  'song16': songsBaseUrl + 'ems%3A77',
  'song05': songsBaseUrl + 'ems%3A79',
  'song10': songsBaseUrl + 'ems%3A80',
  'song18': songsBaseUrl + 'ems%3A84',
  'song07': songsBaseUrl + 'ems%3A82',
  'song26': songsBaseUrl + 'ems%3A86',
  'song14': songsBaseUrl + 'ems%3A88',
  'song19': songsBaseUrl + 'ems%3A91',
  'song36': songsBaseUrl + 'ems%3A89',
  'song35': songsBaseUrl + 'ems%3A93',
  'song21': songsBaseUrl + 'ems%3A95',
  'song17': songsBaseUrl + 'ems%3A96',
  'song32': songsBaseUrl + 'ems%3A101',
  'song12': songsBaseUrl + 'ems%3A108',
  'song23': songsBaseUrl + 'ems%3A107',
  'song28': songsBaseUrl + 'ems%3A110',
  'song30': songsBaseUrl + 'ems%3A105',
  'song31a': songsBaseUrl + 'ems%3A109',
  'song33': songsBaseUrl + 'ems%3A111',
  'song02': songsBaseUrl + 'ems%3A112',
  'song03': songsBaseUrl + 'ems%3A114',
  'song04': songsBaseUrl + 'ems%3A113',
  'song08': songsBaseUrl + 'ems%3A115',
  'song25': songsBaseUrl + 'ems%3A116',
  'song53': songsBaseUrl + 'ems%3A90',
  'song37': songsBaseUrl + 'ems%3A78',
  'song38': songsBaseUrl + 'ems%3A61',
  'song39': songsBaseUrl + 'ems%3A64',
  'song40': songsBaseUrl + 'ems%3A66',
  'song41': songsBaseUrl + 'ems%3A85',
  'song42': songsBaseUrl + 'ems%3A99',
  'song43': songsBaseUrl + 'ems%3A97',
  'song44': songsBaseUrl + 'ems%3A71',
  'song45': songsBaseUrl + 'ems%3A106',
  'song46': songsBaseUrl + 'ems%3A87',
  'song47': songsBaseUrl + 'ems%3A92',
  'song48': songsBaseUrl + 'ems%3A104',
  'song49': songsBaseUrl + 'ems%3A98',
  'song50': songsBaseUrl + 'ems%3A100',
  'song51': songsBaseUrl + 'ems%3A81',
  'song52': songsBaseUrl + 'ems%3A93',
}

function addLinks(TEI) {
  linkText = '[see song edition]'
  TEI.querySelectorAll('*[corresp]').forEach(function(link) {
    a = document.createElement('a')
    a.innerText = linkText
    a.setAttribute('href', idTable[link.getAttribute('corresp').slice(1)])
    if (link.tagName.toLowerCase() !== 'tei-divgen') {
      a.classList.add('edlink')
    }
    link.appendChild(a)
  })

  Object.keys(idTable).forEach(function(id) {
    link = TEI.querySelector('#'+id)
    a = document.createElement('a')
    a.innerText = linkText
    a.setAttribute('href', idTable[id])
    link.parentNode.insertBefore(a, link)
  })
}

fetch(baseUrl + docName)
  .then(function(response) {
    return response.text()
  }).then(function(xml) {
    book = parser.parseFromString(xml, 'text/xml')
    includes = book.querySelectorAll('*|include')
    promises = []
    for (i = 0; i < includes.length; i++) {
      include = includes[i]
      href = include.getAttribute('href')
      songId = include.getAttribute('xpointer')
      promises.push(injectSong(href, songId, include))
    }
    Promise.all(promises).then(function() {
      // Render TEI
      ceteicean = new CETEI()
      ceteicean.domToHTML5(book, function (TEI) {
        // Add links to editions
        addLinks(TEI)
        document.querySelector('#ems_book_viewer').append(TEI)
      })
    })
  })
