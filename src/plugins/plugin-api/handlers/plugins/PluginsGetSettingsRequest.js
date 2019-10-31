/**
 * Dependencies
 */

/**
 * PluginsGetSettingsRequest
 */
class PluginsGetSettingsRequest {

  static get route () {
    return {
      method: 'GET',
      path: '/sunstone/v1/plugins/:id/settings'
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
module.exports = PluginsGetSettingsRequest
