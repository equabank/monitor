module.exports = ->

  describe 'Create slot', ->

    Admin.open 'http://localhost:3000/#/admin', 'Monitor'

    Admin.slots.createButton()

module.exports.tags = [
  'monitor'
  'admin'
  'slots'
  'create'
]
