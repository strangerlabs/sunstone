/**
 * Dependencies
 */
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const mkdirp = require('mkdirp')
const childProcess = require('child_process')
const AbstractPlugin = require('../../architecture/AbstractPlugin')

/**
 * CertificatePlugin
 */
class CertificatePlugin extends AbstractPlugin {

  /**
   * initialize
   *
   * @todo
   * Use letsencrypt for non-localhost
   */
  initialize () {
    let settings = this.component('settings')

    // ensure self-signed certificate
    this.generateSelfSigned()

    // load ssl certificate
    this.factory('cert', () => {
      return fs.readFileSync(settings['https-cert'])
    })

    // load ssl private key
    this.factory('key', () => {
      return fs.readFileSync(settings['https-key'])
    })
  }

  /**
   * generateSelfSigned
   */
  generateSelfSigned () {
    let cwd = process.cwd()
    let log = this.component('log')
    let settings = this.component('settings')
    let keyPath = path.join(cwd, settings['https-key'])
    let certPath = path.join(cwd, settings['https-cert'])

    try {
      fs.readFileSync(keyPath)
      fs.readFileSync(certPath)
    } catch (e) {
      mkdirp.sync(path.dirname(keyPath))
      mkdirp.sync(path.dirname(certPath))

      childProcess.execFileSync('openssl', [
        'req',
        '-x509',
        '-newkey',
        'rsa:4096',
        '-keyout',
        keyPath,
        '-out',
        certPath,
        '-days',
        '365',
        '-nodes',
        '-subj',
        '/CN=www.mydom.com/O=My Company Name LTD./C=US'
      ], {
        stdio: 'ignore'
      })

      log.info({
        msg: 'Created self-signed SSL certificate files.',
        cert: certPath,
        key: keyPath
      })
    }
  }

}

/**
 * Export
 */
module.exports = CertificatePlugin
