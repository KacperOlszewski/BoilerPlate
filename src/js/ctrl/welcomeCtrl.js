'use strict';

var values = require('./constant');

var WelcomeCtrl = function($scope) {
    $scope.testVar = values;
};

module.exports = WelcomeCtrl;
