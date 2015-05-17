'use strict';

var rewire = require('rewire');
var chai = require('chai');

global.rewire = rewire;

global.should = chai.should();
global.expect = chai.expect;
