/**
 * Dependencies
 */

/**
 * AppRequest
 */
class AppRequest {

  static get route () {
    return {
      method: 'GET',
      path: '/sunstone/v1/app'
    }
  }

  static handle (req, res, service) {
    let { application } = service
    let { name, version, state } = application

    res.json({ name, version, state })
  }

}

/**
 * Export
 */
module.exports = AppRequest
