/**
 * Dependencies
 */

/**
 * PluginInstallRequest
 */
class PluginInstallRequest {

  static get route () {
    return {
      method: 'POST',
      path: '/sunstone/v1/plugin/install'
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
module.exports = PluginInstallRequest
