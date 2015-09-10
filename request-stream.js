//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

'use strict';

var fp = require('@intel-js/fp');
var PassThrough = require('stream').PassThrough;

module.exports = fp.curry(4, function requestStream (transport, agent, options, buffer) {
  options.agent = agent;

  var s = new PassThrough();

  var req = transport.request(options, function handleResponse (r) {
    r.on('error', handleError);
    if (r.statusCode >= 400) {
      var err = new Error();
      err.statusCode = r.statusCode;
      handleError(err, true);
    }

    s.responseHeaders = r.headers;
    s.statusCode = r.statusCode;
    r.pipe(s);
  });

  if (buffer) {
    req.setHeader('content-length', buffer.length);
    req.write(buffer);
  }

  s.abort = req.abort.bind(req);

  req.on('error', handleError);
  req.end();

  return s;
  function handleError (err, keepOpen) {
    s.emit('error', err);
    if (!keepOpen)
      s.end();
  }
});