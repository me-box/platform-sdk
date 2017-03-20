// Expose Raven
//window.Raven = require('raven-js');

// Load CSS via Webpack to be able to require Bootstrap, Font Awesome, etc. from npm
require('styles/style.scss');

// JavaScript main file
require('js/app');