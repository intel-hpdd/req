//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
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

var jsonMask = require('json-mask');
var _ = require('lodash-mixins');
var format = require('util').format;

module.exports = _.curry(function toJson (mask, s) {
  var runMask = (mask ? _.partialRight(jsonMask, mask) : _.identity);
  return s
    .map(runMask)
    .tap (function handle (response) {
      if (response !== null)
        return;

      var msg = format('The json mask did not match the response and as a result returned null. Examine \
the mask: "%s"', mask);

      var err = new Error(msg);
      err.statusCode = 400;

      throw err;
    });
});
