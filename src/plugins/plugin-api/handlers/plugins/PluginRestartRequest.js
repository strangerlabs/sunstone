/**
 * Dependencies
 */

/**
 * PluginRestartRequest
 */
class PluginRestartRequest {

  static get route () {
    return {
      method: 'POST',
      path: '/sunstone/v1/plugin/restart'
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
module.exports = PluginRestartRequest
