window.__require=function t(e,i,n){function o(c,a){if(!i[c]){if(!e[c]){var h=c.split("/");if(h=h[h.length-1],!e[h]){var r="function"==typeof __require&&__require;if(!a&&r)return r(h,!0);if(s)return s(h,!0);throw new Error("Cannot find module '"+c+"'")}}var d=i[c]={exports:{}};e[c][0].call(d.exports,function(t){return o(e[c][1][t]||t)},d,d.exports,t,e,i,n)}return i[c].exports}for(var s="function"==typeof __require&&__require,c=0;c<n.length;c++)o(n[c]);return o}({Ball:[function(t,e,i){"use strict";cc._RF.push(e,"05d6195d99B06zz0IIi6csv","Ball");var n=cc.Enum({BEGEN:-1,ENDED:-1,CANCEL:-1}),o=cc.Enum({FLY:-1,DOWN:-1,NONE:-1});cc.Class({extends:cc.Component,properties:{emitSpeed:0,gravity:0,scale:0,showTime:0,maxXSpeed:0},init:function(t){this.game=t,this.registerInput(),this.enableInput(!0),this.showAnim(),this.valid=!1,this.status=n.CANCEL,this.currentHorSpeed=0,this.currentVerSpeed=0,this.target=cc.v2(0,0),this.node.setScale(1),this.node.angle=0,this.hitIn=!1},showAnim:function(){this.node.opacity=0;var t=cc.fadeIn(this.showTime);this.node.runAction(t)},registerInput:function(){this.node.on("touchstart",function(t){return this.began=t.getLocation(),this.status=n.BEGEN,!0},this),this.node.on("touchmove",function(t){this.ended=t.getLocation(),this.began.sub(this.ended).mag()>100&&this.began.y<this.ended.y?(this.status=n.ENDED,this.enableInput(!1),this.currentVerSpeed=this.emitSpeed,this.target=this.node.parent.convertToNodeSpaceAR(this.ended),this.currentHorSpeed=2*this.target.x,this.game.soundMng.playFlySound(),this.doAnim(),this.game.newBall(),this.shadow&&this.shadow.dimiss()):this.status=n.CANCEL},this),this.node.on("touchcancel",function(t){this.status=n.CANCEL},this)},registerInput1:function(){this.listener={event:cc.EventListener.TOUCH_ONE_BY_ONE,onTouchBegan:function(t,e){return this.began=t.getLocation(),this.status=n.BEGEN,!0}.bind(this),onTouchEnded:function(t,e){this.ended=t.getLocation();var i=this.began.sub(this.ended).mag();console.log(i,this.began,this.ended,5555),i>100&&this.began.y<this.ended.y?(this.status=n.ENDED,this.enableInput(!1),this.currentVerSpeed=this.emitSpeed,this.target=this.node.parent.convertToNodeSpaceAR(this.ended),this.currentHorSpeed=2*this.target.x,this.game.soundMng.playFlySound(),this.doAnim(),this.game.newBall(),this.shadow&&this.shadow.dimiss()):this.status=n.CANCEL}.bind(this),onTouchCancelled:function(t,e){this.status=n.CANCEL}.bind(this)},cc.eventManager.addListener(this.listener,this.node)},enableInput:function(t){t?cc.eventManager.resumeTarget(this.node):cc.eventManager.pauseTarget(this.node)},doAnim:function(){var t=cc.scaleTo(1,this.scale),e=2*(Math.random()-.5),i=cc.rotateBy(2,1080*e),n=cc.spawn(t,i);this.node.runAction(n)},update:function(t){this.status==n.ENDED&&(this._updatePosition(t),this._checkValid())},_checkValid:function(){if(this.ballStatus===o.DOWN&&!this.valid){var t=this.node.parent;if(null!=t){var e=this.game.basket,i=e.left,n=e.right,s=this.node.getBoundingBoxToWorld().width/2,c=(t.convertToWorldSpaceAR(this.node.getPosition()).x,t.convertToWorldSpaceAR(this.node.getPosition()).x,t.convertToWorldSpaceAR(this.node.getPosition()).x),a=t.convertToWorldSpaceAR(this.node.getPosition()).y,h=t.convertToWorldSpaceAR(e.linePreNode.getPosition()).y-s,r=e.node.convertToWorldSpaceAR(i.getPosition()).x,d=e.node.convertToWorldSpaceAR(n.getPosition()).x,u=e.node.convertToWorldSpaceAR(i.getPosition()).y-2*s;a<h&&a>u&&c>r&&c<d&&(this.valid=!0,this.game.score.addScore(),this.game.basket.playNetAnim(),this.hitIn?this.game.soundMng.playHitBoardInSound():this.game.soundMng.playBallInSound())}}},bindShadow:function(t){this.shadow=t},_updatePosition:function(t){(this.node.x+=t*this.currentHorSpeed,this.currentVerSpeed-=t*this.gravity,this.node.y+=t*this.currentVerSpeed,this._changeBallStatus(this.currentVerSpeed),this.ballStatus===o.NONE&&this._isOutScreen())&&(this.node.stopAllActions(),this.node.removeFromParent(),this.valid=!1,(new cc.js.Pool).put(this))},_isOutScreen:function(){return this.node.y<-800},_changeBallStatus:function(t){0===t||this._isOutScreen()?this.ballStatus=o.NONE:t>0?(this.ballStatus=o.FLY,this.game.basket.switchMaskLineShow(!1)):(this.ballStatus=o.DOWN,this.game.basket.switchMaskLineShow(!0))},onCollisionEnter:function(t,e){if(this.ballStatus!==o.FLY){var i=t.node.getComponent("CollisionBox"),n=i.getLeft(),s=i.getRight(),c=e.world,a=c.radius,h=this.node.parent.convertToWorldSpaceAR(e.node.getPosition()),r=this.game.basket.node.convertToWorldSpaceAR(t.node.getPosition()),d=(h.y-r.y)/a,u=Math.abs(r.x-h.x)/a,l=this.currentHorSpeed/Math.abs(this.currentHorSpeed)*this.maxXSpeed;("right"===t.node.name&&this.node.x<=n||"left"===t.node.name&&this.node.x>=s)&&(this.hitIn?this.currentHorSpeed=l*u:(this.currentHorSpeed=-1*l*u,this.hitIn=!0)),("right"===t.node.name&&this.node.x>s||"left"===t.node.name&&this.node.x<n)&&(this.currentHorSpeed=l),this.currentVerSpeed=-1*this.currentVerSpeed*d,this.game.soundMng.playHitBoardSound();c.aabb,c.preAabb,c.transform,c.radius,c.position}}}),cc._RF.pop()},{}],Basket:[function(t,e,i){"use strict";cc._RF.push(e,"ac9fdFyp49GVKHUgk9/FVli","Basket"),cc.Class({extends:cc.Component,properties:{line:cc.Node,left:cc.Node,right:cc.Node,linePre:cc.Prefab,count:cc.Label},init:function(t){this.game=t,this._createMaskLine()},startMove:function(){this._doMoveAnim()},stopMove:function(){this.node.stopAllActions(),this._resetPosition()},_resetPosition:function(){this.node.x=0},_doMoveAnim:function(){var t=cc.moveBy(3,cc.v2(200,0)),e=cc.moveBy(3,cc.v2(-200,0)),i=cc.repeatForever(cc.sequence(t,e,e,t));this.node.runAction(i)},update:function(t){this.line;var e=this.node.convertToWorldSpaceAR(this.line.getPosition()),i=this.node.parent.convertToNodeSpaceAR(e);this.linePreNode.setPosition(cc.v2(this.node.x,i.y))},_createMaskLine:function(){this.linePreNode=cc.instantiate(this.linePre),this.game.node.addChild(this.linePreNode)},switchMaskLineShow:function(t){this.linePreNode.zIndex=t?100:0},playNetAnim:function(){if(this.linePreNode){var t=cc.scaleTo(.1,1,1.1),e=cc.scaleTo(.3,1,.9),i=cc.scaleTo(.2,1,1),n=cc.sequence(t,e,i);this.linePreNode.getChildByName("net").runAction(n)}}}),cc._RF.pop()},{}],CollisionBox:[function(t,e,i){"use strict";cc._RF.push(e,"7c4c6Rwi4tIC4UMBgYL4231","CollisionBox"),cc.Class({extends:cc.Component,properties:{},getLeft:function(){return this.node.x-this.node.width/2},getRight:function(){return this.node.x+this.node.width/2},getWorldPoint:function(t){return t.convertToWorldSpaceAR(this.node.getPosition())}}),cc._RF.pop()},{}],GameManager:[function(t,e,i){"use strict";cc._RF.push(e,"7b066H36KxCVr0SNDZka91/","GameManager");var n=t("Basket"),o=t("Ball"),s=t("Shadow"),c=t("Score"),a=t("SoundManager"),h=t("TimeManager");cc.Class({extends:cc.Component,properties:{ball:cc.Prefab,shadow:cc.Prefab,basket:n,startPosition:cc.Vec2,score:c,soundMng:a,timeMng:h},onLoad:function(){console.log("update to 2.0 by yangyang"),this.newBall(),this.initCollisionSys(),this.basket.init(this),this.score.init(this),this.timeMng.init(this),this.timeMng.oneSchedule(),this.score.setScore(0)},initCollisionSys:function(){this.collisionManager=cc.director.getCollisionManager(),this.collisionManager.enabled=!0,cc.debug.setDisplayStats(!0)},newBall:function(){var t=null,e=new cc.js.Pool;(t=e._get(o)?cc.pool.getFromPool(o).node:cc.instantiate(this.ball)).zIndex=1,this.node.addChild(t),t.setPosition(this.startPosition);var i=t.getComponent("Ball");i.init(this),this.newShadow(i,e)},newShadow:function(t){var e=null;(e=(new cc.js.Pool)._get(s)?cc.pool.getFromPool(s).node:cc.instantiate(this.shadow)).zIndex=2,this.node.addChild(e),e.setPosition(this.startPosition);var i=e.getComponent("Shadow");t.bindShadow(i),i.init(this)},startMoveBasket:function(){this.basket.startMove()},stopMoveBasket:function(){this.basket.stopMove()},gameOver:function(){this.score.setScore(0)}}),cc._RF.pop()},{Ball:"Ball",Basket:"Basket",Score:"Score",Shadow:"Shadow",SoundManager:"SoundManager",TimeManager:"TimeManager"}],Line:[function(t,e,i){"use strict";cc._RF.push(e,"00dcby5FcZIh5P10wPcfVGt","Line"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){}}),cc._RF.pop()},{}],Score:[function(t,e,i){"use strict";cc._RF.push(e,"0dbad8nuMBK8L4YWla50RjT","Score"),cc.Class({extends:cc.Component,properties:{scoreText:cc.Label},init:function(t){this.game=t,this._score=0},getScore:function(){return _score},setScore:function(t){this._score=t,this._updateScore()},addScore:function(){this._score+=1,this._updateScore()},_updateScore:function(){this.scoreText.string=this._score}}),cc._RF.pop()},{}],Shadow:[function(t,e,i){"use strict";cc._RF.push(e,"403b5GGRt5LYYNN87LqlnM7","Shadow"),cc.Class({extends:cc.Component,properties:{showTime:0,shadow2:cc.Node},init:function(t){this.node.setScale(1),this._showAnim()},_showAnim:function(){this.node.opacity=0,this.shadow2.active=!0;var t=cc.fadeIn(this.showTime);this.node.runAction(t)},dimiss:function(){this._dismissAnim()},_dismissAnim:function(){this.shadow2.active=!1;var t=cc.fadeOut(this.showTime),e=cc.scaleTo(this.showTime,.5),i=cc.spawn(t,e),n=cc.callFunc(this._callBack.bind(this));this.node.runAction(cc.sequence(i,n))},_callBack:function(){this.node.stopAllActions(),this.node.removeFromParent(),(new cc.js.Pool).put(this)}}),cc._RF.pop()},{}],SoundManager:[function(t,e,i){"use strict";cc._RF.push(e,"3495eBx+i1PlrOKcbTaqUD6","SoundManager"),cc.Class({extends:cc.Component,properties:{toggleAudio:!0,scoreAudio:{default:null,type:cc.AudioClip},ballInAudio:{default:null,type:cc.AudioClip},hitBoardInAudio:{default:null,type:cc.AudioClip},hitBoardAudio:{default:null,type:cc.AudioClip},flyAudio:{default:null,type:cc.AudioClip}},init:function(t){},playScoreSound:function(){this.playSound(this.scoreAudio)},playBallInSound:function(){this.playSound(this.ballInAudio)},playHitBoardSound:function(){this.playSound(this.hitBoardAudio)},playHitBoardInSound:function(){this.playSound(this.hitBoardInAudio)},playFlySound:function(){this.playSound(this.flyAudio)},playSound:function(t){this.toggleAudio&&cc.audioEngine.playEffect(t,!1)}}),cc._RF.pop()},{}],TimeManager:[function(t,e,i){"use strict";cc._RF.push(e,"f81cdY3hlNAza/JwLtsWk2O","TimeManager"),cc.Class({extends:cc.Component,properties:{maxTime:0,timeToMove:0},init:function(t){this.game=t,this.time=this.maxTime,this.isTimeToMove=!1},_callback:function(){this.counting=!1,this.game.basket.count.string="00  00",this.game.stopMoveBasket(),this.game.gameOver()},stopCounting:function(){this.unschedule(this._callback),this.time=this.maxTime},oneSchedule:function(){this.stopCounting(),this.scheduleOnce(this._callback,this.maxTime),this.counting=!0},update:function(t){if(this.counting&&this.time>0){this.time-=t,this.maxTime-this.timeToMove>=this.time&&!this.isTimeToMove&&(this.isTimeToMove=!0,this.game.startMoveBasket());var e=this.time.toFixed(2);4===e.length&&(e="0"+e),this.game.basket.count.string=e.replace(".","  ")}}}),cc._RF.pop()},{}]},{},["Ball","Basket","CollisionBox","GameManager","Line","Score","Shadow","SoundManager","TimeManager"]);