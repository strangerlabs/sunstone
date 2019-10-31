/**
 * Dependencies
 */
const BaseRequest = require('../../../../http/BaseRequest')

/**
 * PluginStartRequest
 */
class PluginStartRequest extends BaseRequest {

  static get route () {
    return {
      method: 'POST',
      path: '/sunstone/v1/plugin/:id/start'
    }
  }

  static handle (req, res, service) {
    let { registry: { plugins } } = service
    let plugin = Object.values(plugins).find( plugin => {
      return plugin.uuid === req.params.id
    })

    if (!plugin)
      this.badRequest(`No plugin found for id ${req.params.id}`)
    else
      res.json(plugin)
  }

}

/**
 * Export
 */
module.exports = PluginStartRequest
