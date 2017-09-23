var clientID = '27e7671d4d1784ed5d35d34922e136d8'
var twentyMinutes = 1200000
var trackSelectors = '.soundList__item, .seedSound__waveform, .searchList__item'


// Watch for new track elements
sentinel.on(trackSelectors, function (elm) {
  var link = elm.getElementsByClassName('soundTitle__title')[0]
  if (link) updateTrack(elm, link.href)
})

// Fetch track data and update element accordingly
var updateTrack = function (elm, url) {
  var resolveURL = 'https://api.soundcloud.com/resolve?url=' + url + '&client_id=' + clientID
  var request = new XMLHttpRequest()
  request.open('GET', resolveURL, true)
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText)
      styleItem(elm, data)
    }
  }
  request.send()
}

// style Mixtape
var styleItem = function (elm, data) {
  if (isMixtape(data)) {
    elm.classList.add('mixtape')
    console.log('📼 ' + data.title)
  }
}

// Check if it is a mixtape
var isMixtape = function (data) {
  var isTrack = data.kind === 'track'
  var isLengthy = data.duration > twentyMinutes
  return isTrack && isLengthy
}

