'use strict';

var WelcomeCtrl = require('./ctrl/welcomeCtrl');

var app = angular.module('myApp', []);

app.controller('WelcomeCtrl', ['$scope', WelcomeCtrl]);
