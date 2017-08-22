var clientID = 'client_id=27e7671d4d1784ed5d35d34922e136d8'
var twentyMinutes = 1200000
var trackSelectors = '.soundList__item:not(.checked), .seedSound__waveform:not(.checked)'

// Extention Ready
chrome.extension.sendMessage({}, function (response) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval)
      init()
    }
  }, 10)
})

// initialize Extention
var init = function () {
  // Check current Tracks
  checkNewTracks()
  // Check new tracks when body height changes
  onElementHeightChange(function () { checkNewTracks() })
}

// Look for tracks and update new ones
var checkNewTracks = function () {
  var item = document.querySelectorAll(trackSelectors)
  for (var i = item.length - 1; i >= 0; i--) {
    var url = item[i].getElementsByClassName('soundTitle__title')[0].href
    updateTrack(item[i], url)
  }
}

// Do Somthing when body heigh changes
var onElementHeightChange = function (callback) {
  var body = document.body
  var lastHeight = body.clientHeight
  var newHeight
  (function run () {
    newHeight = body.clientHeight
    if (lastHeight !== newHeight) {
      callback()
    }
    lastHeight = newHeight
    if (body.onElementHeightChangeTimer) {
      clearTimeout(body.onElementHeightChangeTimer)
    }
    body.onElementHeightChangeTimer = setTimeout(run, 600)
  })()
}

// Fetch track data and update element accordingly
var updateTrack = function (elm, url) {
  elm.classList.add('checked')
  var resolveURL = 'https://api.soundcloud.com/resolve?url=' + url + '&' + clientID
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

// Check if it is considerd a mixtape
var isMixtape = function (data) {
  var isTrack = data.kind === 'track'
  var isLengthy = data.duration > twentyMinutes
  return isTrack && isLengthy
}

