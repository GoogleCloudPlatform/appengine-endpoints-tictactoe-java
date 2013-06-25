// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview
 * Provides methods for the utility methods needed to render the Google+
 * Sign-In button.
 *
 * @author dhermes@google.com (Danny Hermes)
 */

/** google global namespace for Google projects. */
var google = google || {};

/** devrel namespace for Google Developer Relations projects. */
google.devrel = google.devrel || {};

/** samples namespace for DevRel sample code. */
google.devrel.samples = google.devrel.samples || {};

/** TicTacToe namespace for this sample. */
google.devrel.samples.ttt = google.devrel.samples.ttt || {};

/**
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
google.devrel.samples.ttt.CLIENT_ID =
    'YOUR-CLIENT-ID';

/**
 * Scopes used by the application.
 * @type {string}
 */
google.devrel.samples.ttt.SCOPES =
    'https://www.googleapis.com/auth/userinfo.email ' +
    'https://www.googleapis.com/auth/plus.login';

/**
 * Handles the Google+ Sign In response.
 *
 * Success calls google.devrel.samples.ttt.init. Failure makes the Sign-In
 * button visible.
 *
 * @param {Object} authResult The contents returned from the Google+
 *                            Sign In attempt.
 */
google.devrel.samples.ttt.signinCallback = function(authResult) {
  if (authResult.access_token) {
    google.devrel.samples.ttt.init('//' + window.location.host + '/_ah/api');

    document.getElementById('signinButtonContainer').classList.remove(
        'visible');
    document.getElementById('signedInStatus').classList.add('visible');
  } else {
    document.getElementById('signinButtonContainer').classList.add('visible');
    document.getElementById('signedInStatus').classList.remove('visible');

    if (!authResult.error) {
      console.log('Unexpected result');
      console.log(authResult);
    } else if (authResult.error !== 'immediate_failed') {
      console.log('Unexpected error occured: ' + authResult.error);
    } else {
      console.log('Immediate mode failed, user needs to click Sign In.');
    }
  }
};

/**
 * Renders the Google+ Sign-in button using auth parameters.
 */
google.devrel.samples.ttt.render = function() {
  gapi.signin.render('signinButton', {
    'callback': google.devrel.samples.ttt.signinCallback,
    'clientid': google.devrel.samples.ttt.CLIENT_ID,
    'cookiepolicy': 'single_host_origin',
    'requestvisibleactions': 'http://schemas.google.com/AddActivity',
    'scope': google.devrel.samples.ttt.SCOPES
  });
};
// A quirk of the JSONP callback of the plusone client makes it so
// our callback must exist as an element in window.
window['google.devrel.samples.ttt.render'] = google.devrel.samples.ttt.render;

// Recommended code to load Google+ JS library.
(function() {
  var newScriptElement = document.createElement('script');
  newScriptElement.type = 'text/javascript';
  newScriptElement.async = true;
  newScriptElement.src = 'https://apis.google.com/js/client:plusone.js' +
                         '?onload=google.devrel.samples.ttt.render';
  var firstScriptElement = document.getElementsByTagName('script')[0];
  firstScriptElement.parentNode.insertBefore(newScriptElement,
                                             firstScriptElement);
})();
