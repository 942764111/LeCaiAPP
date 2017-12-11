/**
 * Created by lyf on 2017/7/1.
 * 历史记录
 */
var DiceAnimateLayer=cc.Layer.extend({
    _diceSprite1:null,
    _diceSprite2:null,
    _diceAnimate:null,
    _gameType:null,
    ctor:function (gameType) {
        this._super();

        this._gameType=gameType;
        cc.spriteFrameCache.addSpriteFrames(res.plist_dice);

        this._diceSprite1=new cc.Sprite("#1-1.png");
        this._diceSprite1.setNormalizedPosition(cc.p(0.43,0.368));
        this._diceSprite1.setVisible(false);
        this._diceSprite2=new cc.Sprite("#1-1.png");
        this._diceSprite2.setNormalizedPosition(cc.p(0.57,0.352));
        this._diceSprite2.setVisible(false);

        this.addChild(this._diceSprite1);
        this.addChild(this._diceSprite2);

        var diceAnimation = new cc.Animation();
        for(var i=1;i<=6;i++){
            for(var j=1;j<=4;j++){
                diceAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(i+"-"+j+".png"));
            }
        }
        diceAnimation.setDelayPerUnit(0.1/2.5);
        diceAnimation.setRestoreOriginalFrame(true);
        this._diceAnimate = cc.animate(diceAnimation);
        this._diceAnimate.retain();



        //this._diceSprite1.runAction(this._diceAnimate.clone().repeatForever());
        //this._diceSprite2.runAction(this._diceAnimate.clone().repeatForever());

        return true;
    },
    runTo:function(i){
        var self=this;
        if(!isFinite(i)){
            return;
        }
        if(((this._gameType==2||this._gameType==8)&&(i<1||i>2))||((this._gameType!=2&&this._gameType!=8)&&(i<1||i>5))){
            return;
        }
        var result=[];
        if(this._gameType==2||this._gameType==8){
            //斗牛
            result=i==1?[2,3,4,5,6]:[7,8,9,10,11,12];
        }else{
            //非斗牛
            result=i==1?[6,11]:i==2?[2,7,12]:i==3?[3,8]:i==4?[4,9]:[5,10];
        }
        //从result里随机取一个
        var index=parseInt(Math.random()*result.length);
        var dian=result[index];

        var min=dian>6?dian-6:dian-1;
        var max=Math.min(6,dian-min);
        var num1=parseInt(Math.random()*(max-min+1) + min);
        var num2=dian-num1;

        //cc.log("dian",dian,"min:",min,"max",max,"num1",num1,"num2",num2);

        cc.audioEngine.playEffect(res.mp3_dice);

        this._diceSprite1.setVisible(true);
        this._diceSprite1.stopAllActions();
        this._diceSprite1.runAction(cc.sequence(this._diceAnimate.clone(),this._diceAnimate.clone(),cc.callFunc(function(){
            self._diceSprite1.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(num1+"-1.png"));
            self.scheduleOnce(function(){
                self._diceSprite1.setVisible(false);
            },2);
        },this)));

        this._diceSprite2.setVisible(true);
        this._diceSprite2.stopAllActions();
        this._diceSprite2.runAction(cc.sequence(this._diceAnimate.clone(),this._diceAnimate.clone(),cc.callFunc(function(){
            self._diceSprite2.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(num2+"-1.png"));
            self.scheduleOnce(function(){
                self._diceSprite2.setVisible(false);
            },2);
        },this)));
    },
    onExit:function(){
        this._diceAnimate.release();
        this._super();
    },
});