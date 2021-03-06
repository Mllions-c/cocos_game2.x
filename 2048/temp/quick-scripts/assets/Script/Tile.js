(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Tile.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bb0c91TruNI4KugNQ8+Qfus', 'Tile', __filename);
// Script/Tile.js

'use strict';

cc.Class({
  extends: cc.Component,

  properties: {
    tag: 0,
    row: 0,
    col: 0,

    label: {
      default: null,
      type: cc.Label
    }
  },

  // use this for initialization
  onLoad: function onLoad() {
    this.label.fontSize = 50;
    this.setTag(0);
  },

  // called every frame, uncomment this function to activate update callback
  update: function update(dt) {},

  setTag: function setTag(toTag) {
    this.tag = toTag;

    this.updateTag();
  },

  updateTag: function updateTag() {
    var Manager = require('Manager');
    var bgColor = Manager.colorForTag(this.tag);
    // this.node.setColor(bgColor);
    this.node.color = bgColor;
    var textColor = Manager.textColorForTag(this.tag);
    this.label.node.color = textColor;

    var num = Math.pow(Manager.cardinality, this.tag + 1);
    this.label.string = num.toString();
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
        //# sourceMappingURL=Tile.js.map
        