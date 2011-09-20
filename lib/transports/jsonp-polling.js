
/*!
 * socket.io-node
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Module requirements.
 */

var HTTPPolling = require('./http-polling');

/**
 * Export the constructor.
 */

exports = module.exports = JSONPPolling;

/**
 * JSON-P polling transport.
 *
 * @api public
 */

function JSONPPolling (mng, data, req) {
  HTTPPolling.call(this, mng, data, req);

  this.head = 'io.j[0](';
  this.foot = ');';

  if (data.query.i) {
    this.head = 'io.j[' + data.query.i + '](';
  }
};

/**
 * Inherits from Transport.
 */

JSONPPolling.prototype.__proto__ = HTTPPolling.prototype;

/**
 * Transport name
 *
 * @api public
 */

JSONPPolling.prototype.name = 'jsonppolling';

/**
 * Make sure POST are decoded.
 */

JSONPPolling.prototype.postEncoded = true;

/**
 * Performs the write.
 *
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data) {
  HTTPPolling.prototype.doWrite.call(this);

  var data = data === undefined
      ? '' : this.head + JSON.stringify(data) + this.foot;
  var origin = this.req.headers.origin
        ,headers = {
          'Content-Type': 'text/javascript; charset=UTF-8'
        , 'Content-Length': Buffer.byteLength(data)
        , 'Connection': 'Keep-Alive'
        , 'X-XSS-Protection': '0'
      }
  if (origin) {
    // https://developer.mozilla.org/En/HTTP_Access_Control
    headers['Access-Control-Allow-Origin'] = '*';

    if (this.req.headers.cookie) {
      headers['Access-Control-Allow-Credentials'] = 'true';
    }
  }      
  this.response.writeHead(200, headers );

  this.response.write(data);
  this.log.debug(this.name + ' writing', data);
};
