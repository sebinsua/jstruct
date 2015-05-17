'use strict';

var rewire = require('rewire');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

global.rewire = rewire;

chai.use(sinonChai);

global.sinon = sinon;
global.should = chai.should();
global.expect = chai.expect;
