(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/PillarGenerator.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fec57h7ZKBEWbtIDVOxFXA9', 'PillarGenerator', __filename);
// Script/PillarGenerator.js

'use strict';

cc.Class({
  extends: cc.Component,

  properties: {
    pillarPrefab: {
      default: null,
      type: cc.Prefab,
      tooltip: '柱子障碍物的 Prefab'
    },

    scroreSpacePrefab: {
      default: null,
      type: cc.Prefab,
      tooltip: '柱子障碍物中间的空隙 prefab'
    },

    scoreLabel: {
      default: null,
      type: cc.Label,
      tooltip: '显示分数的 label 组件'
    },

    score: {
      default: 0,
      visible: false,
      tooltip: '玩家分数'
    },

    pillarSapce: {
      default: 0,
      tooltip: '上下障碍物的中间空隙间距'
    },

    pillarMinHeight: {
      default: 0,
      tooltip: '上下预留给障碍物的最小高度'
    },

    pillarMoveSpeed: {
      default: 0,
      tooltip: '障碍物的移动速度'
    },

    pillarGenerateMargin: {
      default: 0,
      tooltip: '间隔多远生成一次障碍物'
    },

    pillars: {
      default: [],
      visible: false,
      tooltip: '记录所有障碍物的数组'
    },

    lastPillarGenerateMargin: {
      default: 0,
      visible: false,
      tooltip: '距离上一次生成障碍物间隔了多远了'
    },

    birdPrefab: {
      default: null,
      type: cc.Prefab,
      tooltip: '小鸟的 Prefab'
    },

    bird: {
      default: null,
      visible: false,
      tooltip: '运行时生成的，当前在画面中的鸟'
    },

    birdUpSpeed: {
      default: 0.0,
      tooltip: '点击屏幕时，鸟获得的上升速度'
    },

    birdSpeed: {
      default: 0.0,
      visible: false,
      tooltip: '鸟当前在 y 方向上的速度'
    },

    birdGravitationalAcceleration: {
      default: 0.0,
      tooltip: '鸟下降的重力加速度'
    },

    isCollided: {
      default: false,
      visible: false,
      tooltip: '是否发生了碰撞'
    },

    startLayer: {
      default: null,
      type: cc.Node,
      tooltip: '开始游戏视图'
    }
  },

  // use this for initialization
  onLoad: function onLoad() {
    console.log('update to 2.1 by yangyang');
    this.setupEventListener();
    this.setupCollisionListener(this);
    this.setupStartLayer();
    this.setupBird();
    this.setupPillars();
    this.showStartLayer();
  },

  // called every frame, uncomment this function to activate update callback
  update: function update(dt) {
    if (this.isCollided) {
      return;
    }

    // 本次更新移动的距离
    var dtSpace = dt * this.pillarMoveSpeed;

    // 移动各个障碍物
    for (var i = 0; i < this.pillars.length; i++) {
      var pillarArr = this.pillars[i];
      var upPillar = pillarArr[0];
      var downPillar = pillarArr[1];
      var scoreSpace = pillarArr[2];

      upPillar.x -= dtSpace;
      downPillar.x -= dtSpace;
      scoreSpace.x -= dtSpace;
    }

    // 记录距离上一次生成障碍物间隔了多远了
    this.lastPillarGenerateMargin += dtSpace;

    // 检查是否需要生成新的障碍物
    if (this.lastPillarGenerateMargin >= this.pillarGenerateMargin) {
      // TODO：这里会有误差的应该
      var x = this.node.width / 2 + this.pillars[0][0].width / 2;
      this.generateTwoPillar(x);
      this.lastPillarGenerateMargin = 0;
    }

    // 离开屏幕的障碍物的清理
    for (var _i = 0; _i < this.pillars.length; _i++) {
      var _pillarArr = this.pillars[_i];
      var _upPillar = _pillarArr[0];
      var _downPillar = _pillarArr[1];
      var _scoreSpace = _pillarArr[2];

      var minX = -this.node.width / 2 - _upPillar.width / 2;
      if (_upPillar.x < minX) {
        this.pillars.shift();
        _upPillar.removeFromParent();
        _downPillar.removeFromParent();
        _scoreSpace.removeFromParent();
      }
    }

    // 鸟的当前速度
    var currentBirdSpeed = this.birdSpeed - this.birdGravitationalAcceleration * dt;
    this.birdSpeed = currentBirdSpeed;
    var birdUpHeight = dt * this.birdSpeed;
    this.bird.angle = -20.0 * (currentBirdSpeed / this.birdUpSpeed);
    var birdY = this.bird.y + birdUpHeight;
    this.bird.y = birdY;
  },

  /**
     * 创建开始游戏视图
     */
  setupStartLayer: function setupStartLayer() {
    this.startLayer.removeFromParent();
  },

  /**
     * 切换显示开始游戏视图
     */
  showStartLayer: function showStartLayer() {
    this.isCollided = true;

    this.startLayer.removeFromParent();
    var root = this.node.parent;
    root.addChild(this.startLayer);
    this.startLayer.width = root.width;
    this.startLayer.height = root.height;
    this.startLayer.x = 0;
    this.startLayer.y = 0;
  },

  /**
     * 生成初始的障碍物
     */
  setupPillars: function setupPillars() {
    var tmpPillar = cc.instantiate(this.pillarPrefab);
    // 最大可生成的位置
    var maxX = this.node.width / 2 + tmpPillar.width / 2;
    // 记录下最后一次生成位置的下一个位置
    this.generateTwoPillar(maxX);
    // 距离上一个生成位置已经间隔了多远
    this.lastPillarGenerateMargin = 0;
  },

  /**
     * 重新开始一局新游戏
     */
  restartGame: function restartGame() {
    // 移除各个障碍物
    for (var i = 0; i < this.pillars.length; i++) {
      var pillarArr = this.pillars[i];
      var upPillar = pillarArr[0];
      var downPillar = pillarArr[1];
      var scoreSpace = pillarArr[2];

      upPillar.removeFromParent();
      downPillar.removeFromParent();
      scoreSpace.removeFromParent();
    }
    this.pillars = [];

    // 移除鸟
    this.bird.removeFromParent();

    // 分数
    this.score = 0;
    this.scoreLabel.string = this.score.toString();

    // 重新初始化设置
    this.setupPillars();
    this.setupBird();

    this.startLayer.removeFromParent();

    // 重新开始游戏
    this.isCollided = false;
  },

  /**
     * 生成一对新的障碍物并自动加入到场景中
     * @param x 障碍物生成的水平位置
     */
  generateTwoPillar: function generateTwoPillar(x) {
    // 障碍物的宽度
    var width = cc.instantiate(this.pillarPrefab).width;

    // 障碍物间隙中心位置上下
    // 这里已经照顾到了上下障碍物都有个最小高度
    var effectHeight = this.node.height - this.pillarMinHeight * 2 - this.pillarSapce;
    var spaceCenterY = Math.random() * effectHeight - effectHeight / 2;

    // 上边障碍物的下边缘位置
    var upPillarDownY = spaceCenterY + this.pillarSapce / 2;
    // 上边障碍物的高度
    var upPillarHeight = this.node.height / 2 - upPillarDownY;
    // 上边障碍物的 Y
    var upY = upPillarDownY + upPillarHeight / 2;
    // 生成上边的障碍物
    var upPillar = this.generateAPillar(x, upY, width, upPillarHeight, 0);

    // 下边障碍物的上边缘位置
    var downPillarUpY = spaceCenterY - this.pillarSapce / 2;
    // 下边障碍物的高度
    var downPillarHeight = this.node.height / 2 + upPillarDownY;
    // 下边障碍物的 Y
    var downY = downPillarUpY - downPillarHeight / 2;
    // 设置下边障碍物的位置大小
    var downPillar = this.generateAPillar(x, downY, width, downPillarHeight, 180);

    // 中间空隙中添加一个 scoreSpace 用于计分
    var scoreSpace = cc.instantiate(this.scroreSpacePrefab);
    this.node.addChild(scoreSpace);
    scoreSpace.width = width;
    scoreSpace.height = upPillarDownY - downPillarUpY;
    scoreSpace.x = x;
    scoreSpace.y = downPillarUpY + scoreSpace.height / 2;
    var scoreSpaceCollider = scoreSpace.getComponent(cc.BoxCollider);
    scoreSpaceCollider.size.width = scoreSpace.width;
    scoreSpaceCollider.size.height = scoreSpace.height;
    scoreSpaceCollider.offset.x = 0;
    scoreSpaceCollider.offset.y = 0;

    // 放到障碍物数组中
    this.pillars.push([upPillar, downPillar, scoreSpace]);
  },

  /**
     * 生成一个新的障碍物并自动加入到场景中
     */
  generateAPillar: function generateAPillar(x, y, width, height, rotation) {
    // 生成障碍物实例
    var pillar = cc.instantiate(this.pillarPrefab);
    this.node.addChild(pillar);

    // 设置障碍物的旋转
    pillar.angle = rotation;
    // 设置障碍物的位置大小
    pillar.width = width;
    pillar.height = height;
    pillar.x = x;
    pillar.y = y;
    // 设置碰撞体的位置大小
    var collider = pillar.getComponent(cc.BoxCollider);
    collider.size.width = pillar.width;
    collider.size.height = pillar.height;
    collider.offset.x = 0;
    collider.offset.y = 0;

    return pillar;
  },

  /**
     * 生成初始的小鸟
     */
  setupBird: function setupBird() {
    this.bird = cc.instantiate(this.birdPrefab);
    // 初始化位置(x始终不变)
    // x不变

    var x = -200;
    var y = 0;
    this.bird.x = x;
    this.bird.y = y;

    this.node.addChild(this.bird);

    this.birdSpeed = this.birdUpSpeed;
  },

  /**
     * 初始化系统事件监听
     */
  setupEventListener: function setupEventListener() {
    this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
      if (this.startLayer.parent) {
        this.restartGame();

        return;
      }

      this.birdSpeed = this.birdUpSpeed;
      this.bird.angle = -20;
    }, this);
  },

  /**
     * 初始化碰撞检测
     */
  setupCollisionListener: function setupCollisionListener() {
    var self = this;
    this.node.on('collided', function (event) {
      var script = self.getComponent('PillarGenerator');
      script.isCollided = true;
      script.showStartLayer();
    });

    this.node.on('score', function (event) {
      var script = self.getComponent('PillarGenerator');
      script.score++;
      script.scoreLabel.string = script.score.toString();
    });
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
        //# sourceMappingURL=PillarGenerator.js.map
        