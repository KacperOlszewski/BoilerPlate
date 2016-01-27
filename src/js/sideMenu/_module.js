'use strict';

var menuCtrl = require('./menuCtrl'),
    moduleNAME = 'sideMenu';


angular.module(moduleNAME, [])
    .controller('WelcomeCtrl', menuCtrl);


module.exports = moduleNAME;
