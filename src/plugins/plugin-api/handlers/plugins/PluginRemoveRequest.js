/**
 * Dependencies
 */

/**
 * PluginRemoveRequest
 */
class PluginRemoveRequest {

  static get route () {
    return {
      method: 'POST',
      path: '/sunstone/v1/plugin/remove'
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
module.exports = PluginRemoveRequest
