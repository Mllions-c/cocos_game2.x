(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ScoreBoardUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a6aab8B42NDdoA4LFpqn/fL', 'ScoreBoardUI', __filename);
// Script/ScoreBoardUI.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        boardBackground: cc.Sprite,
        boardHint: cc.Label,
        boardLabel: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        var Manager = require("Manager");

        this.boardBackground.node.color = Manager.scoreBoardColor();
        this.boardHint.node.color = Manager.socreHintColor();
        this.boardLabel.node.color = Manager.socreLabelColor();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
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
        //# sourceMappingURL=ScoreBoardUI.js.map
        