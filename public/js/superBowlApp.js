'use strict';

var angular = require('angular');
var material = require('material-design-lite/material.min.js');
var app = angular.module('superBowlApp', []);

angular
    .module('superBowlApp', [])
    .controller('mainCtrl', require('./main'));

angular
    .module('superBowlApp')
    .service('mainService', require('./service'));