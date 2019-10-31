/**
 * Dependencies
 */

/**
 * PluginsGetRequest
 */
class PluginsGetRequest {

  static get route () {
    return {
      method: 'GET',
      path: '/sunstone/v1/plugins/:id'
    }
  }

  static handle (req, res, service) {
    let { registry: { plugins } } = service
    let plugin = Object.values(plugins).find(plugin => {
      return plugin.uuid === req.params.id
    })

    res.json(plugin)
  }

}

/**
 * Export
 */
module.exports = PluginsGetRequest
