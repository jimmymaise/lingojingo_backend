'use strict';

const Boom = require('boom');

module.exports = {
  register,
  raiseError,
  applyErrorFunc,
  firebaseAuthScheme,
  authenticateRequest,
  unauthorizedError,
  verifyToken,
  extractTokenFromRequest,
  getCredentialFromAuthHeader
};

function register(server, options, next) {
  server.auth.scheme('firebase', firebaseAuthScheme);
  return next();
}

function raiseError(errorFunc, errorContext) {
  errorContext = applyErrorFunc(errorFunc, errorContext);
  return Boom[errorContext.errorType](errorContext.message, errorContext.scheme, errorContext.attributes);
}

function applyErrorFunc(errorFunc, errorContext) {
  if (errorFunc) {
    errorContext = errorFunc(errorContext);
  }
  return errorContext;
}

function firebaseAuthScheme(server, options) {
  return {
    authenticate: authenticateRequest(server, options)
  };
}

function authenticateRequest(server, options) {
  return (request, reply) => {

    const token = extractTokenFromRequest(request);

    if (!token) {
      return reply(unauthorizedError(options.errorFunc));
    }

    request.auth.token = token;

    try {
      const credentials = verifyToken(options.firebaseAdmin, token);
      credentials.then(function(decodedToken) {
        reply.continue({
          credentials: decodedToken,
          artifacts: token
        });
      }).catch(function(error) {
        // Handle error
        return reply(unauthorizedError(options.errorFunc, {
          message: error.message || error
        }));
      });
    } catch (error) {
      return reply(unauthorizedError(options.errorFunc, {
        message: error.message || error
      }));
    }
  };
}

function unauthorizedError(errorFunc, errorParams = {}) {
  return raiseError(errorFunc, Object.assign({}, errorParams, {
    errorType: 'unauthorized',
    scheme: 'firebase'
  }));
}

function verifyToken(firebaseAdmin, token) {
  return firebaseAdmin.auth().verifyIdToken(token);
}

function extractTokenFromRequest(request) {
  return getCredentialFromAuthHeader('Bearer', request.headers.authorization || '');
}

function getCredentialFromAuthHeader(scheme, header) {
  return (header.match(new RegExp(`${scheme} (.*)`)) || [])[1];
}

module.exports.register.attributes = {
  name: 'firebase'
};
