// Early Moder Songscapes Book viewer
// Author: Raff Viglianti (MITH, UMD)
// 

parser = new DOMParser()
baseUrl = 'https://raw.githubusercontent.com/EarlyModernSongscapes/songscapes/master/data/tei/'

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

fetch(baseUrl + 'Ayres_and_Dialogues%2C_For_One%2C_Two%2C_and_Three_Voyces-L638_1.xml')
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
        document.querySelector('#ems_book_viewer').append(TEI)
      })
    })
  })
