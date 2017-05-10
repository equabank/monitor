{TestError} = dependencies.errors
moment = require 'moment'

slotPayload =
  "from": moment().format('H')+":"+moment().format('mm'),
  "to": moment().add(1, 'hours').format('H')+":"+moment().format('mm'),
  "color": "green",
  "title": "Grafana",
  "type": "range",
  "uri": "http://play.grafana.org/"

module.exports = ->

  describe "Open modal for create a slot", ->

    it "find button CREATE SLOT", (done) ->
      xPath = "button#createSlotModalButton"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found" if !isExist
      .click xPath, done

    it "modal has element h3 CREATE SLOT", (done) ->
      xPath = "//h3[contains(text(),'CREATE SLOT')]"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found." if !isExist
        done()

    it "fill #{slotPayload.title} to Title input", (done) ->
      xPath = "//input[@id='title']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found for title input" if !isExist
      .click(xPath)
      .keys slotPayload.title, done

    it "fill #{slotPayload.uri} to URI input", (done) ->
      xPath = "//input[@id='uri']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found for uri input" if !isExist
      .click(xPath)
      .clearElement(xPath)
      .keys slotPayload.uri, done

    it "open timepicker for from", (done) ->
      xPath = "//input[@id='from']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found for timepicker input" if !isExist
      .click(xPath, done)

    it "set time hour #{slotPayload.from.split(':')[0]}", (done) ->
      xPath = "//div/span[text()='#{slotPayload.from.split(':')[0]}']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found time #{slotPayload.from.split(':')[0]}" if !isExist
      .doubleClick xPath, done

    it "set time mins #{slotPayload.from.split(':')[1]}", (done) ->
      xPath = "//div/span[text()='#{slotPayload.from.split(':')[1]}']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found time #{slotPayload.from.split(':')[1]}" if !isExist
      .doubleClick xPath, done

    it "click on ON button", (done) ->
      xPath = "//span[text()='OK']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found" if !isExist
      .click(xPath, done)

    it "pockej", (done) ->
      client.pause(1000, done);

    it "open timepicker for to", (done) ->
      xPath = "//input[@id='to']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found for timepicker input" if !isExist
      .click(xPath, done)

    it "set time hour #{slotPayload.to.split(':')[0]}", (done) ->
      xPath = "//div/span[text()='#{slotPayload.to.split(':')[0]}']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found time #{slotPayload.to.split(':')[0]}" if !isExist
      .doubleClick xPath, done

    it "set time mins #{slotPayload.to.split(':')[1]}", (done) ->
      xPath = "//div/span[text()='#{slotPayload.to.split(':')[1]}']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found time #{slotPayload.to.split(':')[1]}" if !isExist
      .doubleClick xPath, done

    it "click on ON button", (done) ->
      xPath = "//span[text()='OK']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found" if !isExist
      .click(xPath, done)

    it "select color #{slotPayload.color}", (done) ->
      xPath = "//input[@value='#{slotPayload.color}']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found" if !isExist
      .doubleClick(xPath, done)

    it "click on SAVE SLOT button", (done) ->
      xPath = "//button[@id='dialogSaveButton']"
      xPathSuccess = "//div[@id='progressSuccess']"
      client.waitForExist(xPath, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPath} not found" if !isExist
      .click(xPath)
      .waitForExist(xPathSuccess, dependencies.explicitWaitMs).then (isExist) ->
        return done new TestError "#{xPathSuccess} not found" if !isExist
        done()