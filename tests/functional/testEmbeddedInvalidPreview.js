/**
 * Check custom time stamps generated by console.timeStamp() method.
 */
define([
  './config',
  './DriverUtils',
  'dojo/node!@theintern/leadfoot',
], function(config, DriverUtils, leadfoot) {
  const { registerSuite } = intern.getInterface("object");
  const { assert } = intern.getPlugin("chai");
  const { pollUntil } = leadfoot;
  const { testBase } = config;

  registerSuite('testEmbeddedInvalidPreview', {
    'testEmbeddedInvalidPreview1': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;

      // HAR file is specified inside the test page.
      var url = testBase + "tests/testEmbeddedInvalidPreview1.html";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .findByCssSelector("iframe")
        .then(pollUntil(DriverUtils.querySelectAllInFrameAndReturnLengthOrNull, ['#preview', '.errorTable'], findTimeout))
        .then(function(len) {
          assert.strictEqual(len, 1, "#preview1.errorTable");
        })
        .then(pollUntil(DriverUtils.querySelectAllInFrameAndReturnLengthOrNull, ['#preview', '.errorRow'], findTimeout))
        .then(function(len) {
          assert.strictEqual(len, 1, "#preview1.errorRow");
        })
        .then(pollUntil(DriverUtils.querySelectAllInFrameAndReturnLengthOrNull, ['#preview', '.errorProperty'], findTimeout))
        .then(function(len) {
          assert.strictEqual(len, 1, "#preview1.errorProperty");
        })
        .then(pollUntil(DriverUtils.querySelectAllInFrameAndReturnLengthOrNull, ['#preview', '.errorMessage'], findTimeout))
        .then(function(len) {
          assert.strictEqual(len, 1, "#preview1.errorMessage");
        });
    },

    'testEmbeddedInvalidPreview2': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;

      // HAR file is specified inside the test page.
      var url = testBase + "tests/testEmbeddedInvalidPreview2.html";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .findByCssSelector("iframe")
        .then(pollUntil(DriverUtils.querySelectAllInFrameAndReturnLengthOrNull, ['#preview', '.pageTable'], findTimeout))
        .then(function(len) {
          assert.strictEqual(len, 1, "#preview1.pageTable");
        })
        .then(pollUntil(DriverUtils.querySelectAllInFrameAndReturnLengthOrNull, ['#preview', '.netRow'], findTimeout))
        .then(function(len) {
          assert.strictEqual(len, 49, "#preview1.errorRow");
        });
    },
  });
});
