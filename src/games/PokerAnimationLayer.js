/**
 * Created by lyf on 2017/7/5.
 *  扑克 麻将 动画
 */
var G_pokerLayer;
var PokerAnimationLayer=cc.Layer.extend({
    _pokerVal:null, // 扑克值
    _pokerArr:null,
    _gameType:null,// 游戏类型
    _zoneType:null,// 下注区域
    _resultsArr:null, // 每个区域结果
    _pokerValArr:null,
    _callback:null,
    ctor: function () {
        this._super();
        G_pokerLayer = this;

        this._pokerArr = [];
        this._zoneType = 1;
    },
    starAction:function (pokerVal,gameType,resultsArr,callback) { // 开始执行动画
        this._pokerVal = pokerVal; //结果值
        this._gameType = gameType; //游戏类型
        this._resultsArr = resultsArr;
        this._pokerValArr = this._pokerVal.split(",");
        this._callback=callback;
        this.initPoker();
    },
    initPoker:function () {
        var arr = GC.BET_ZONE[this._gameType][this._zoneType];
        for(var i = 0 ; i < arr.pos.length; i ++)
        {
            var poker;
            if(G_pokerLayer._gameType == 1 || G_pokerLayer._gameType == 7)
            {
                poker =  new cc.Sprite("#Mbei.png");
            }else
            {
                poker =  new cc.Sprite("#Pbei.png");
                poker.setScale(1.2);
            }
            poker.x = 900;
            poker.y = 1000;
            poker.setName(G_pokerLayer._pokerValArr[arr.pos[i]]);
            this.addChild(poker);
            this._pokerArr[i] = poker;

            var actionTo = cc.moveTo(0.3, cc.p(arr.init_x+(i*148), 1000));
            poker.runAction(cc.sequence(cc.delayTime(0.2 * i ),actionTo));
        }

        setTimeout(function () {
            G_pokerLayer.flipPoker();
        },arr.s)

        setTimeout(function () {
            G_pokerLayer.InArea();
        },arr.s*2)
    },
    flipPoker:function () { // 翻牌
        var arr = GC.BET_ZONE[G_pokerLayer._gameType][G_pokerLayer._zoneType];
        for(var i = 0 ; i < this._pokerArr.length ; i ++)
        {
            var actionBy = cc.rotateBy(0.2, 0, -90);
            // var actionBy_ = cc.rotateBy(0.15, 0, 180);
            this._pokerArr[i].runAction(cc.sequence(cc.delayTime(0.3 * i ),actionBy,
                cc.callFunc((function(pokerArr,i){
                    return function() {
                        var pokerOrMajiang;
                        if(G_pokerLayer._gameType == 1 || G_pokerLayer._gameType == 7)
                        {
                            pokerOrMajiang = "M";
                        }else
                        {
                            if(G_pokerLayer._pokerValArr[arr.pos[i]] != 0)
                            {
                                var pokerList = ["A","B","C","D"];
                                pokerOrMajiang =  pokerList[Math.floor(Math.random()*pokerList.length)];// 随机取一个花色
                            }else
                            {
                                var pokerOrMajiang = "poker";
                            }
                        }
                        pokerArr[i].setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(pokerOrMajiang+G_pokerLayer._pokerValArr[arr.pos[i]]+".png"));
                        pokerArr[i].setFlippedX(true);
                    }
                })(this._pokerArr,i)),
                actionBy
            ));
        }
    },
    InArea:function () {// 对号入区
        var a = 0;// 用来标记一轮入区完成
        var arr = GC.BET_ZONE[G_pokerLayer._gameType][G_pokerLayer._zoneType];
        var actionSc;
        if(G_pokerLayer._gameType == 1 || G_pokerLayer._gameType == 7)
        {
            actionSc = cc.scaleTo(0.5, 0.4);
        }else{
            actionSc = cc.scaleTo(0.5, 0.43);
        }

        for(var i = 0 ; i < this._pokerArr.length ; i ++)
        {
            //this._pokerArr[i].runAction(cc.sequence(cc.delayTime(0.3 * i ),actionSc));
            var actionTo = cc.moveTo(0.5, cc.p(arr.x+(i*arr.w), arr.y));
            this._pokerArr[i].runAction(cc.sequence(cc.delayTime(0.3 * i ),cc.spawn(actionTo.clone(),actionSc.clone()),cc.callFunc(function () {
                a++;
                if(a == arr.pos.length)
                {
                    if(G_pokerLayer._gameType == 2 || G_pokerLayer._gameType == 8)
                    {
                        var niuniu = new cc.Sprite("#niu"+G_pokerLayer._resultsArr[(G_pokerLayer._zoneType-1)]+".png");
                        niuniu.setPosition(cc.p(arr.x+360,arr.y));
                        G_pokerLayer.addChild(niuniu);

                    }else
                    {
                        //var pokerPoints = new cc.LabelTTF(G_pokerLayer._resultsArr[(G_pokerLayer._zoneType-1)]+"点","微软雅黑", 30);
                        var pokerPoints = new cc.LabelBMFont(G_pokerLayer._resultsArr[(G_pokerLayer._zoneType-1)]+"点",res.fnt_white_num_big);
                        pokerPoints.setPosition(cc.p(arr.x+135,arr.y));
                        G_pokerLayer.addChild(pokerPoints);
                    }

                    if(G_pokerLayer._zoneType <= arr.len)
                    {
                        G_pokerLayer._pokerArr = []; // 清空上一轮扑克
                        G_pokerLayer.initPoker();
                    }else
                    {
                        G_pokerLayer._callback();
                    }
                }
            })));
        }
        G_pokerLayer._zoneType ++;
    },
    removeView:function () { // 清除所有视图
        G_pokerLayer._pokerVal="";
        G_pokerLayer._pokerArr=[];
        G_pokerLayer._gameType="";
        G_pokerLayer._zoneType="";
        G_pokerLayer.removeFromParent();
    }
});