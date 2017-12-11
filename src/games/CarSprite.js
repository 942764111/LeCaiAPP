/**
 * Created by lyf on 2017/6/24.
 */
var CarSprite=cc.Sprite.extend({
    _huoSprite:null,
    _lunziSprite:null,
    ctor:function (type,i) {
        var name=("#"+(type==1?"car":"chuan")+i+".png");
        this._super(name);


        var aname=(type==1?"huo":"shuihua");


        if(type==1){
            this._lunziSprite=cc.Sprite.create("#lunzi1.png");
            this._lunziSprite.setNormalizedPosition(0.5,0.5);
            this.addChild(this._lunziSprite);

            var lunziAnimation = new cc.Animation();
            lunziAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("lunzi4.png"));
            lunziAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("lunzi3.png"));
            lunziAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("lunzi2.png"));
            lunziAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("lunzi1.png"));
            lunziAnimation.setDelayPerUnit(0.1/4.0);
            lunziAnimation.setRestoreOriginalFrame(true);
            var lunziAnimate = cc.animate(lunziAnimation).repeatForever();
            this._lunziSprite.runAction(lunziAnimate);

            this._lunziSprite.setVisible(false);
        }else{
            this._lunziSprite=cc.Sprite.create();
            this.addChild(this._lunziSprite);
        }

        this._huoSprite=cc.Sprite.create("#"+aname+"1.png");
        this._huoSprite.setNormalizedPosition(type==1?1.15:0.75,type==1?0.4:0.5);
        this.addChild(this._huoSprite);

        var huoAnimation = new cc.Animation();
        huoAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(aname+"1.png"));
        huoAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(aname+"2.png"));
        huoAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(aname+"3.png"));
        huoAnimation.setDelayPerUnit(0.1/3.0);
        huoAnimation.setRestoreOriginalFrame(true);
        var huoAnimate = cc.animate(huoAnimation).repeatForever();
        this._huoSprite.runAction(huoAnimate);


        this._huoSprite.setVisible(false);

    },
    runTo:function(d,x,t,callback,isStopLunzi){
        this._huoSprite.setVisible(false);
        this._lunziSprite.setVisible(true);
        this.stopAllActions();
        var actionTo = cc.moveTo(t, cc.p(x, this.y));
        this.runAction(cc.sequence(cc.delayTime(d),cc.callFunc(function(){
            this._huoSprite.setVisible(x<this.x);
            //this._lunziSprite.setVisible(true);
        },this),actionTo,cc.callFunc(function(){
            callback();
            this._huoSprite.setVisible(false);
            if(isStopLunzi){
                this._lunziSprite.setVisible(false);
            }
        },this)));
        //.easing(cc.easeExponentialInOut())
    }
});


CarSprite.create=function(type,i){
    return  new CarSprite(type,i);
};


