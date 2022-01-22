
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./avalanche-js-transaction.cjs.production.min.js')
} else {
  module.exports = require('./avalanche-js-transaction.cjs.development.js')
}
