(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '52cea1c2YxOG7fVaE2W8T77', 'Game', __filename);
// Script/Game.js

'use strict';

cc.Class({
  extends: cc.Component,

  properties: {
    background: cc.Sprite,
    mapBackground: cc.Sprite,
    labelBackground: cc.Prefab,
    overView: cc.Prefab,

    manager: {
      default: null
    },
    tiles: [],
    tile: cc.Prefab,

    tileOriginX: 0,
    tileOriginY: 0,
    tileSpace: 10,

    maxNumLabel: cc.Label,
    describeLabel: cc.Label,
    score: 0,
    scoreLabel: cc.Label,
    bestScore: 0,
    bestScoreLabel: cc.Label,
    currentOverView: {
      default: null,
      type: cc.Sprite
    },

    animationDuration: 0.1,

    currentMousePositionX: -1,
    currentMousePositionY: -1,

    isAnimation: false
  },

  // use this for initialization
  onLoad: function onLoad() {
    console.log('update to 2.1 by yangyang');
    this.setupTiles();

    var storageBestScore = cc.sys.localStorage.getItem('bestScore');
    if (!storageBestScore) {
      storageBestScore = 0;
    }
    this.updateBestScore(storageBestScore);

    this.setupMapBackground();
    this.setupEventListener();
  },

  setTilePosition: function setTilePosition(tile, toRow, toCol, animated) {
    var x = this.tileOriginX + this.tileSpace + toCol * (this.tileSpace + this.manager.tileSize.width);
    var y = this.tileOriginY + this.tileSpace + toRow * (this.tileSpace + this.manager.tileSize.height);

    if (animated) {
      var moveTo = cc.moveTo(this.animationDuration, cc.v2(x, y));
      tile.runAction(moveTo);
    } else {
      tile.setPosition(x, y);
    }

    tile.row = toRow;
    tile.col = toCol;
  },

  /**
     * 初始化主地图数据
     */
  setupTiles: function setupTiles() {
    this.manager = require('Manager');
    if (this.manager.order == 3) {
      this.tiles = [[null, null, null], [null, null, null], [null, null, null]];
      this.maxNumLabel.string = '1024';
      this.describeLabel.string = 'Join the numbers\nto get to 1024';
    } else if (this.manager.order == 4) {
      this.tiles = [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]];
      this.maxNumLabel.string = '2048';
      this.describeLabel.string = 'Join the numbers\nto get to 2048';
    } else if (this.manager.order == 5) {
      this.tiles = [[null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null]];
      this.maxNumLabel.string = '8192';
      this.describeLabel.string = 'Join the numbers\nto get to 8192';
    }
  },

  /**
     * 初始化游戏背景, 左下角是起点
     */
  setupMapBackground: function setupMapBackground() {
    this.background.node.color = this.manager.backgroundColor();
    this.mapBackground.node.color = this.manager.scoreBoardColor();

    var labelInstance = cc.instantiate(this.labelBackground);
    this.manager.tileSize.width = labelInstance.width;
    this.manager.tileSize.height = labelInstance.height;

    var rows = this.manager.getRowCount();
    var cols = this.manager.getColCount();

    var mapWidth = (this.manager.tileSize.width + this.tileSpace) * rows + this.tileSpace;
    var mapHeight = (this.manager.tileSize.height + this.tileSpace) * cols + this.tileSpace;
    this.mapBackground.node.width = mapWidth;
    this.mapBackground.node.height = mapHeight;
    this.tileOriginX = -1 * (mapWidth - this.manager.tileSize.width) / 2;
    this.tileOriginY = -1 * (mapHeight - this.manager.tileSize.height) / 2;

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        var label = cc.instantiate(this.labelBackground);
        this.setTilePosition(label, i, j, false);
        this.mapBackground.node.addChild(label);
      }
    }

    this.createRandomTile(false);
    this.createRandomTile(false);
  },

  showOverView: function showOverView() {
    if (this.currentOverView == null) {
      this.currentOverView = cc.instantiate(this.overView);
    }
    this.background.node.addChild(this.currentOverView);
  },

  /**
     * 初始化系统事件监听
     */
  setupEventListener: function setupEventListener() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    this.mapBackground.node.on(cc.Node.EventType.TOUCH_START, function (event) {
      var location = event.touch.getLocation();
      this.currentMousePositionX = location.x;
      this.currentMousePositionY = location.y;
    }, this);

    var touchAction = function touchAction(event) {
      var location = event.touch.getLocation();
      var xMove = location.x - this.currentMousePositionX;
      var yMove = location.y - this.currentMousePositionY;
      if (Math.abs(xMove) > Math.abs(yMove)) {
        if (xMove > 0) {
          this.actionForKeyCode(cc.macro.KEY.right);
        } else {
          this.actionForKeyCode(cc.macro.KEY.left);
        }
      } else {
        if (yMove > 0) {
          this.actionForKeyCode(cc.macro.KEY.up);
        } else {
          this.actionForKeyCode(cc.macro.KEY.down);
        }
      }
    };

    this.mapBackground.node.on(cc.Node.EventType.TOUCH_END, touchAction, this);
    this.mapBackground.node.on(cc.Node.EventType.TOUCH_CANCEL, touchAction, this);
  },

  /**
     * 键盘按钮抬起时的事件响应
     * @param event
     */
  onKeyUp: function onKeyUp(event) {
    this.actionForKeyCode(event.keyCode);
  },

  actionForKeyCode: function actionForKeyCode(keyCode) {
    if (this.isAnimation) {
      return;
    }

    var isMoved = false;
    switch (keyCode) {
      case cc.macro.KEY.up:
        {
          isMoved = this.moveUp();
          break;
        }
      case cc.macro.KEY.down:
        {
          isMoved = this.moveDown();
          break;
        }
      case cc.macro.KEY.left:
        {
          isMoved = this.moveLeft();
          break;
        }
      case cc.macro.KEY.right:
        {
          isMoved = this.moveRight();
          break;
        }
    }

    if (isMoved) {
      this.isAnimation = true;

      var isCreated = this.createRandomTile(true);
      if (!isCreated) {
        this.showOverView();
      }
    } else {
      // 检查是否结束
      var isOver = this.checkWhetherOver();
      if (isOver) {
        this.showOverView();
      }
    }
  },

  /**
     * 增加分数
     */
  addScore: function addScore(add) {
    this.score += add;

    this.scoreLabel.string = this.score.toString();

    if (this.score > this.bestScore) {
      this.updateBestScore(this.score);
    }
  },

  /**
     * 清空分数
     */
  clearScore: function clearScore() {
    this.score = 0;

    this.scoreLabel.string = this.score.toString();
  },

  /**
     * 更新最高分数
     * @param newBestScore
     */
  updateBestScore: function updateBestScore(newBestScore) {
    this.bestScore = newBestScore;
    this.bestScoreLabel.string = this.bestScore.toString();

    cc.sys.localStorage.setItem('bestScore', this.bestScore);
  },

  /**
     * restart 按钮的监听
     */
  handleRestart: function handleRestart() {
    if (this.currentOverView) {
      this.currentOverView.removeFromParent();
    }

    this.setupTiles();
    this.setupMapBackground();

    this.score = 0;
    this.scoreLabel.string = this.score.toString();
  },

  createRandomTile: function createRandomTile(animated) {
    var rows = this.manager.getRowCount();
    var cols = this.manager.getColCount();
    var nullPositions = [];
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (this.tiles[i][j] == null) {
          nullPositions.push(cc.v2(i, j));
        }
      }
    }
    if (nullPositions.size == 0) {
      return false;
    }

    var randomIndex = Math.floor(Math.random() * nullPositions.length);
    var position = nullPositions[randomIndex];

    if (animated) {
      var delayAction = cc.delayTime(this.animationDuration + 0.1);
      var callAction = cc.callFunc(this.createTileAtPosition, this, position);
      var callFalseAnimationAction = cc.callFunc(this.resetIsAnimation, this);
      var sequenceAction = cc.sequence([delayAction, callAction, callFalseAnimationAction]);
      this.node.runAction(sequenceAction);
    } else {
      this.createTileAtPosition(this.node, position);

      this.resetIsAnimation();
    }

    return true;
  },

  resetIsAnimation: function resetIsAnimation() {
    this.isAnimation = false;
  },

  /**
     * 判断游戏是否结束
     */
  checkWhetherOver: function checkWhetherOver() {
    var rows = this.manager.getRowCount();
    var cols = this.manager.getColCount();

    var isOver = true;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (this.tiles[i][j] == null) {
          isOver = false;
          break;
        }

        var curTileScript = this.tiles[i][j].getComponent('Tile');
        var tagTileScript;
        var tagi = i + 1;
        if (tagi < rows) {
          tagTileScript = this.tiles[tagi][j].getComponent('Tile');
          if (tagTileScript.tag == curTileScript.tag) {
            isOver = false;
            break;
          }
        }

        var tagj = j + 1;
        if (tagj < cols) {
          tagTileScript = this.tiles[i][tagj].getComponent('Tile');
          if (tagTileScript.tag == curTileScript.tag) {
            isOver = false;
            break;
          }
        }
      }
    }

    return isOver;
  },

  /**
     * 在指定位置添加 tile
     */
  createTileAtPosition: function createTileAtPosition(sender, position) {
    var tile = cc.instantiate(this.tile);
    this.tiles[position.x][position.y] = tile;
    this.setTilePosition(tile, position.x, position.y);
    this.mapBackground.node.addChild(tile);
  },

  mergeTiles: function mergeTiles(tile, toTile) {},

  moveTilePosition: function moveTilePosition(tile, fromRow, fromCol, toRow, toCol) {
    this.tiles[fromRow][fromCol] = null;
    this.tiles[toRow][toCol] = tile;
    this.setTilePosition(tile, toRow, toCol, true);
  },

  moveUp: function moveUp() {
    var rowsCount = this.manager.getRowCount();
    var colsCount = this.manager.getColCount();
    return this.moveVertically(colsCount, rowsCount, function (fromRow) {
      return rowsCount - 1 - fromRow;
    });
  },

  moveDown: function moveDown() {
    var rowsCount = this.manager.getRowCount();
    var colsCount = this.manager.getColCount();
    return this.moveVertically(colsCount, rowsCount, function (fromRow) {
      return fromRow;
    });
  },

  moveLeft: function moveLeft() {
    var rowsCount = this.manager.getRowCount();
    var colsCount = this.manager.getColCount();
    return this.moveHorizontally(rowsCount, colsCount, function (fromCol) {
      return fromCol;
    });
  },

  moveRight: function moveRight() {
    var rowsCount = this.manager.getRowCount();
    var colsCount = this.manager.getColCount();
    return this.moveHorizontally(rowsCount, colsCount, function (fromCol) {
      return colsCount - 1 - fromCol;
    });
  },

  // 竖向
  moveVertically: function moveVertically(outerCount, innerCount, getRealRow) {
    var isMoved = false;

    for (var col = 0; col < outerCount; col++) {
      // 比较节点
      var tagRow = 0;
      var tagTile = this.tiles[getRealRow(tagRow)][col];

      for (var row = 1; row < innerCount; row++) {
        var realRow = getRealRow(row);
        var tile = this.tiles[realRow][col];
        if (tile == null) {
          continue;
        }

        if (tagTile == null) {
          this.moveTilePosition(tile, realRow, col, getRealRow(tagRow), col);
          tagTile = tile;
          isMoved = true;
          continue;
        }

        var tagTileScript = tagTile.getComponent('Tile');
        var curTileScript = tile.getComponent('Tile');
        var tmpRow = getRealRow(tagRow + 1);

        if (tagTileScript.tag != curTileScript.tag) {
          if (realRow != tmpRow) {
            this.moveTilePosition(tile, realRow, col, tmpRow, col);
            tagRow++;
            isMoved = true;
          } else {
            tagRow = row;
          }
          tagTile = tile;
        } else {
          // 加分
          var Manager = require('Manager');
          var addScore = Math.pow(Manager.cardinality, curTileScript.tag + 1);
          this.addScore(addScore);

          // 移动 tile 到最后位置
          this.moveTilePosition(tile, realRow, col, tagTile.row, tagTile.col);
          // 后边我们继续使用的是 tagTile，tile 会被 remove
          this.tiles[tagTile.row][tagTile.col] = tagTile;

          // 合并
          var delayAction = cc.delayTime(this.animationDuration);
          var callAction = cc.callFunc(this.updateTag, this, tile);
          var sequenceAction = cc.sequence([delayAction, callAction]);
          tagTile.runAction(sequenceAction);

          // 更新比较节点
          tagRow++;
          tagTile = this.tiles[getRealRow(tagRow)][col];

          isMoved = true;
        }
      }
    }

    return isMoved;
  },

  // 横向
  moveHorizontally: function moveHorizontally(outerCount, innerCount, getRealCol) {
    var isMoved = false;

    for (var row = 0; row < outerCount; row++) {
      // 比较节点
      var tagCol = 0;
      var tagTile = this.tiles[row][getRealCol(tagCol)];

      for (var col = 1; col < innerCount; col++) {
        var realCol = getRealCol(col);
        var tile = this.tiles[row][realCol];
        if (tile == null) {
          continue;
        }

        if (tagTile == null) {
          this.moveTilePosition(tile, row, realCol, row, getRealCol(tagCol));
          tagTile = tile;
          isMoved = true;
          continue;
        }

        var tagTileScript = tagTile.getComponent('Tile');
        var curTileScript = tile.getComponent('Tile');
        var tmpCol = getRealCol(tagCol + 1);

        if (tagTileScript.tag != curTileScript.tag) {
          if (realCol != tmpCol) {
            this.moveTilePosition(tile, row, realCol, row, tmpCol);
            tagCol++;
            isMoved = true;
          } else {
            tagCol = col;
          }
          tagTile = tile;
        } else {
          // 加分
          var Manager = require('Manager');
          var addScore = Math.pow(Manager.cardinality, curTileScript.tag + 1);
          this.addScore(addScore);

          // 移动 tile 到最后位置
          this.moveTilePosition(tile, row, realCol, tagTile.row, tagTile.col);
          // 后边我们继续使用的是 tagTile，tile 会被 remove
          this.tiles[tagTile.row][tagTile.col] = tagTile;

          // 合并
          var delayAction = cc.delayTime(this.animationDuration);
          var callAction = cc.callFunc(this.updateTag, this, tile);
          var sequenceAction = cc.sequence([delayAction, callAction]);
          tagTile.runAction(sequenceAction);

          // 更新比较节点
          tagCol++;
          tagTile = this.tiles[row][getRealCol(tagCol)];
          isMoved = true;
        }
      }
    }

    return isMoved;
  },

  updateTag: function updateTag(tile, oldTile) {
    var tileScript = tile.getComponent('Tile');
    tileScript.tag += 1;
    tileScript.updateTag();

    oldTile.removeFromParent();
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
        //# sourceMappingURL=Game.js.map
        