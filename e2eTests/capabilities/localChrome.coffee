capabilities = (global) ->
  global.desiredCapabilities['browserName'] = 'chrome'
  global.desiredCapabilities['chromeOptions'] =
    args: [
      'start-fullscreen'
      'window-size=1280,800'
    ]
  global['host'] = '192.168.1.138'
  global['port'] = '4444'
  global


module.exports = capabilities
