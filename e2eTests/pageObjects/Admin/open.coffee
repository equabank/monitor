{expect} = require 'chai'

module.exports = (url, expectTitle) ->

  describe "Open #{url}", ->

    it "open #{url}", (done) ->
      client.url url, done

    it "wait for document ready state", (done) ->
      client.waitForDocumentReadyState client, done

    it "#{expectTitle} is expect title", (done) ->
      client.getTitle().then (title) ->
        try
          expect(expectTitle).to.eql title
        catch e
          {TestError} = dependencies.errors
          return done new TestError e
        done()
