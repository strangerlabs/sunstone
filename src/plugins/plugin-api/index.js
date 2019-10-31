/**
 * Dependencies
 */
const HTTPServicePlugin = require('../../http/HTTPServicePlugin')

/**
 * SunstoneServicePlugin
 */
class SunstoneServicePlugin extends HTTPServicePlugin {

  /**
   * initialize
   */
  initialize () {
    this.require({
      'SunstoneService': __dirname + '/services/SunstoneService'
    })

    this.router('pluginService', (SunstoneService, server, registry) => {
      let { application, injector } = registry
      return SunstoneService.create(null, {
        server, registry, application, injector
      })
    })
  }

}

/**
 * Export
 */
module.exports = SunstoneServicePlugin
