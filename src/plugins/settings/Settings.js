/**
 * Dependencies
 */
require('dotenv').config()
const yargs = require('yargs')
const { JSONSchema, JSONMapping } = require('@trust/json-document')

/**
 * Settings class
 */
class Settings {

  /**
   * Constructor
   */
  constructor (schema) {

    // set the schema as non-enumerable property
    Object.defineProperty(this, 'schema', {
      enumerable: false,
      value: new JSONSchema({ properties: schema })
    })

    // generate a mapping from the schema and set as non-enumerable
    Object.defineProperty(this, 'mapping', {
      enumerable: false,
      value: new JSONMapping(
        Object
          .keys(schema)
          .reduce((result, key) => {
            let pointer = `/${key}`
            result[pointer] = pointer
            return result
          }, {})
      )
    })

    // load the results
    this.refresh()
  }

  /**
   * refresh
   *
   * @description Reread the values
   */
  refresh () {
    let {schema, mapping} = this

    yargs
      .env('SUNSTONE')
      .version()
      .alias('version', 'v')
      .options(schema.properties)
      .help('help')
      .epilogue('MIT Open Algorithms')

    mapping.map(this, yargs.argv)
  }

  /**
   * save
   *
   * @description Persist to .env file
   */
  save () {}

}

/**
 * Export
 */
module.exports = Settings
