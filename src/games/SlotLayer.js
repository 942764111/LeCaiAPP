/**
 * Created by lyf on 2017/6/24.
 * 跑道
 */
var SlotLayer=cc.Layer.extend({
    _bgSprite:null,
    _nums:null,
    _clips:null,
    _isStop:null,
    _soundId:null,
    ctor:function () {
        cc.spriteFrameCache.addSpriteFrames(res.plist_shuzi);
        this._nums=[];
        this._clips=[];
        this._isStop=[0,0,0,0,0];
        this._super();

        var bgSprite=cc.Sprite.create(res.png_bg_slot);
        bgSprite.setNormalizedPosition(cc.p(0.5,0.763));
        this.addChild( bgSprite);


        this._bgSprite=cc.Sprite.create(res.png_bg_slot_num);
        this._bgSprite.setNormalizedPosition(cc.p(0.5,0.5));
        bgSprite.addChild(this._bgSprite);



        //5列
        for(var i=0;i<5;i++){
            var bgNumSprite=cc.Sprite.create(res.png_diceng);
            bgNumSprite.setNormalizedPosition(cc.p((i*2+1)*0.1+(2-i)*0.0125,0.5));
            this._bgSprite.addChild(bgNumSprite);



            var stencil =cc.Sprite.create(res.png_diceng);
            stencil.setColor(cc.color(0,0,0));
            var clip=new cc.ClippingNode(stencil);
            clip.setNormalizedPosition(cc.p((i*2+1)*0.1+(2-i)*0.0125,0.5));
            clip.setInverted(false);
            clip.setAlphaThreshold(0);
            this._bgSprite.addChild(clip);
            this._clips[i]=clip;

            for(var j=0;j<2;j++){
                var num=cc.Sprite.create("#shuzi"+j+".png");
                num.setPosition(cc.p(0,j*154));
                num.setTag(j+1);
                this._clips[i].addChild(num);
            }

            var zhegaiSprite=cc.Sprite.create(res.png_zheguangceng);
            zhegaiSprite.setNormalizedPosition(cc.p((i*2+1)*0.1+(2-i)*0.0125,0.5));
            this._bgSprite.addChild(zhegaiSprite,1);

        }

        return true;
    },
    updateNumY:function(){
        for(var i=0;i<this._clips.length;i++){
            if(this._isStop[i]==0){
                for(var j=0;j<2;j++){
                    var num=this._clips[i].getChildByTag(j+1);
                    num.setPositionY(num.getPositionY()-35);
                    if(num.getPositionY()<=-154){
                        var name="shuzi"+Math.floor(Math.random()*10)+".png";
                        num.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(name));
                        num.setPositionY(1*154);
                    }
                }
            }
        }
    },
    startRun:function(){
        this._soundId=cc.audioEngine.playEffect(res.mp3_slot,true);
        this.unschedule(this.updateNumY);
        this.schedule(this.updateNumY, 0.01);
    },
    stopRun:function(result){
        var time=0.6;
        var results=result.split(",");
        for(var i=0;i<this._clips.length;i++) {
            for (var j = 0; j < 2; j++) {
                var num = this._clips[i].getChildByTag(j + 1);
                var action = cc.moveTo(time, cc.p(0,(j-1) * 154));
                num.runAction(cc.sequence(cc.delayTime(i*time),cc.callFunc((function(i,j,num,soundId){
                     return function(){
                         this._isStop[i]=1;
                         var sy=(j+1) * 154;
                         num.setPositionY(sy);
                         if(j==1){
                             var name="shuzi"+results[i]+".png";
                             num.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(name));
                         }
                         if(i==4&&j==1){
                             cc.audioEngine.stopEffect(soundId);
                             cc.audioEngine.stopAllEffects();
                             soundId=null;
                         }
                     }
                })(i,j,num,this._soundId),this),action.easing(cc.easeExponentialOut())));
            }
        }
        this.scheduleOnce(function(){
            cc.audioEngine.stopAllEffects();
            this.unschedule(this.updateNumY);
        },time*5);

    },
    onExit:function(){
        cc.audioEngine.stopEffect(this._soundId);
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        this._super();
    },
    reset:function(){
        for(var i=0;i<5;i++){
            for(var j=0;j<2;j++){
                var num=this._clips[i].getChildByTag(j+1);
                num.setPosition(cc.p(0,j*154));
                var name="shuzi"+j+".png";
                num.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(name));
            }
        }
    },


});

SlotLayer.create=function(type){
    return  new SlotLayer(type);
};

