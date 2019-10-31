/**
 * Dependencies
 */

/**
 * PluginsRequest
 */
class PluginsRequest {

  static get route () {
    return {
      method: 'GET',
      path: '/sunstone/v1/plugins'
    }
  }

  static handle (req, res, service) {
    let { registry: { plugins } } = service

    Object.keys(plugins).forEach( key=> {
      plugins[key].sunstone.dependents = plugins[key].dependents
    })

    res.json(plugins)
  }

}

/**
 * Export
 */
module.exports = PluginsRequest
