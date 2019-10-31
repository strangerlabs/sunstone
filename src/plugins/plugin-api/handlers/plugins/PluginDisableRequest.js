/**
 * Dependencies
 */

/**
 * PluginDisableRequest
 */
class PluginDisableRequest {

  static get route () {
    return {
      method: 'POST',
      path: '/sunstone/v1/plugin/disable'
    }
  }

  static handle (req, res, service) {
    res.json({
      // ...
    })
  }

}

/**
 * Export
 */
module.exports = PluginDisableRequest
