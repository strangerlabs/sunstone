/**
 * Dependencies
 */
const HTTPServicePlugin = require('../../http/HTTPServicePlugin')

/**
 * MyServicePlugin
 */
class MyServicePlugin extends HTTPServicePlugin {

  /**
   * initialize
   */
  initialize () {

    // import the main code from another module
    this.require({ 'MyService': __dirname + '/MyService' })

    // register the router
    this.router('myService', (MyService, server) => {
      return MyService.create(null, { server })
    })
  }

}

/**
 * Export
 */
module.exports = MyServicePlugin
