define([
  './config',
  './DriverUtils',
  'dojo/node!@theintern/leadfoot',
], function(config, DriverUtils, leadfoot) {
  const { registerSuite } = intern.getInterface("object");
  const { assert } = intern.getPlugin("chai");
  const { pollUntil } = leadfoot;
  const { testBase } = config;

  registerSuite('testIssue39', {
    /**
     * https://github.com/janodvarko/harviewer/issues/39
     * Query param values get dropped from URL when used as "data-har" HTML attribute.
     * E.g.:
     *   <div class="har" height="500" data-har="http://example.com/index.php?action=show_me_har_file"></div>
     * Leads to IFRAME URL of:
     *   http://example.com/index.php?action&callback=onInputData&_=1440704124791
     */
    'testIssue39': function() {
      // Some of these tests need a larger timeout for finding DOM elements
      // because we need the HAR to parse/display fully before we query the DOM.
      var findTimeout = config.findTimeout;
      var r = this.remote;

      var url = testBase + "tests/testIssue39.html";

      return r
        .setFindTimeout(findTimeout)
        .get(url)
        .then(DriverUtils.waitForElements("iframe", 2, findTimeout))
        .then(pollUntil(DriverUtils.querySelectAllInFrameAndReturnLengthOrNull, ['#previewLocalWithQueryString', '.pageTable'], findTimeout))
        .then(function(len) {
          assert.strictEqual(len, 1, "#previewLocalWithQueryString.pageTable");
        })
        .findByCssSelector("#previewLocalWithQueryString iframe")
        .then(function(iframe) {
          return iframe.getAttribute("src").then(function(src) {
            // search for the action parameter and value.
            // "%3D" === encodeURIComponent("=")
            assert.include(src, "action%3Dshow_me_har_file");
          });
        })
        .end() // end IFRAME
        .then(pollUntil(DriverUtils.querySelectAllInFrameAndReturnLengthOrNull, ['#previewNonLocalWithQueryString', '.pageTable'], findTimeout))
        .then(function(len) {
          assert.strictEqual(len, 1, "#previewNonLocalWithQueryString.pageTable");
        })
        .findByCssSelector("#previewNonLocalWithQueryString iframe")
        .then(function(iframe) {
          return iframe.getAttribute("src").then(function(src) {
            // search for the action parameter and value.
            // "%3D" === encodeURIComponent("=")
            assert.include(src, "action%3Dshow_me_har_file");
          });
        })
        .end() // end IFRAME
        .then(pollUntil(DriverUtils.querySelectAllInFrameAndReturnLengthOrNull, ['#previewLocalWithQueryString', '.netRow'], findTimeout))
        .then(function(len) {
          assert.strictEqual(len, 2, "#previewLocalWithQueryString.netRow");
        })
        .then(pollUntil(DriverUtils.querySelectAllInFrameAndReturnLengthOrNull, ['#previewNonLocalWithQueryString', '.netRow'], findTimeout))
        .then(function(len) {
          assert.strictEqual(len, 11, "#previewNonLocalWithQueryString.netRow");
        });
    },
  });
});
