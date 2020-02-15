// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const assert = require('assert');
const sinon = require('sinon');
const rclnodejs = require('../index.js');
const utils = require('./utils.js');

describe('rclnodejs guard condition test suite', function() {
  var node;
  var timeout = 10;
  this.timeout(60 * 1000);

  before(function() {
    return rclnodejs.init();
  });

  after(function() {
    rclnodejs.shutdown();
  });

  beforeEach(function() {
    node = rclnodejs.createNode('guard_node');
    rclnodejs.spin(node, timeout);
  });

  afterEach(function() {
    node.destroy();
  });

  it('Test trigger', async function() {
    let callback = sinon.spy();

    const gc = node.createGuardCondition(callback);

    await utils.delay(timeout + 1);
    assert(callback.notCalled);

    gc.trigger();
    await utils.delay(timeout + 1);
    assert(callback.calledOnce);

    node.destroyGuardCondition(gc);
  });

  it('Test double trigger', async function() {
    let callback1 = sinon.spy();
    let callback2 = sinon.spy();

    const gc1 = node.createGuardCondition(callback1);
    const gc2 = node.createGuardCondition(callback2);

    await utils.delay(timeout + 1);
    assert(callback1.notCalled);
    assert(callback2.notCalled);

    gc1.trigger();
    gc2.trigger();
    await utils.delay(timeout + 1);
    assert(callback1.calledOnce);
    assert(callback2.calledOnce);

    await utils.delay(timeout + 1);
    assert(callback1.calledOnce);
    assert(callback2.calledOnce);

    node.destroyGuardCondition(gc1);
    node.destroyGuardCondition(gc2);
  });
});
