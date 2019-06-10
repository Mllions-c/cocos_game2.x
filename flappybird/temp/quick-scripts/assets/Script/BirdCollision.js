(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/BirdCollision.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '480d61GWTdMMaFhZexSRiJO', 'BirdCollision', __filename);
// Script/BirdCollision.js

'use strict';

cc.Class({
  extends: cc.Component,

  properties: {},

  // use this for initialization
  onLoad: function onLoad() {
    var manager = cc.director.getCollisionManager();
    manager.enabled = true;
  },

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },

  /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
  onCollisionEnter: function onCollisionEnter(other, self) {
    if (other.node.group == 'Pillar') {
      this.node.dispatchEvent(new cc.Event.EventCustom('collided', true));
    }
  },

  onCollisionExit: function onCollisionExit(other, self) {
    if (other.node.group == 'ScoreSpace') {
      this.node.dispatchEvent(new cc.Event.EventCustom('score', true));
    }
  }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=BirdCollision.js.map
        