/**
 * Dependencies
 */

/**
 * PluginsPutSettingsRequest
 */
class PluginsPutSettingsRequest {

  static get route () {
    return {
      method: 'PUT',
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
module.exports = PluginsPutSettingsRequest
