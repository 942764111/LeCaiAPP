/**
 * Created by lyf on 2017/6/24.
 * 跑道
 */
var TrackLayer=cc.Layer.extend({
    _chedaoWidth:null,
    _suduWidth:null,
    _bgSprite:null,
    _cars:null,
    _type:null,
    _callback:null,
    _soundId:null,
    ctor:function (type,callback) {
        cc.spriteFrameCache.addSpriteFrames(res.plist_hai0);
        cc.spriteFrameCache.addSpriteFrames(res.plist_hai1);
        cc.spriteFrameCache.addSpriteFrames(res.plist_hai2);
        cc.spriteFrameCache.addSpriteFrames(res.plist_car);
        cc.spriteFrameCache.addSpriteFrames(res.plist_huo);
        cc.spriteFrameCache.addSpriteFrames(res.plist_lunzi);
        cc.spriteFrameCache.addSpriteFrames(res.plist_chuan);
        cc.spriteFrameCache.addSpriteFrames(res.plist_shuihua);

        this._super();
        this._cars=[];
        //1=car,3=boat
        this._type=type;
        this._callback=callback;
        this.initRunway();
        this.initCar();

        return true;
    },
    initCar:function(){
        var x=GC.W-100;
        var bgH=this._bgSprite.height;
        var carH=32;

        for(var i=0;i<10;i++){
            var car=CarSprite.create(this._type,(i+1));
            car.setTag(i+1);
            car.setAnchorPoint(cc.p(0,0.5));
            car.setPosition(cc.p(x,bgH/2+(this._type==3?-8:0)+carH*(10-(i*2+1))/2));
            this._bgSprite.addChild(car,3);
            this._cars[i]=car;
        }
    },
    initRunway:function(){
        //this._bgSprite=cc.Sprite.create(this._type==1?res.png_chedao_bg:res.png_hai_bg);
        this._bgSprite=cc.Sprite.create(this._type==1?res.png_chedao_bg:res.png_hai_bg);
        this._bgSprite.setNormalizedPosition(cc.p(0.5,0.764));
        this.addChild(this._bgSprite);

        //起始线
        this._startLineSprite=cc.Sprite.create(this._type==1?res.png_chedao_start:res.png_boat_start);
        this._startLineSprite.setPosition(cc.p(GC.W-115,this._bgSprite.height/2));
        this._bgSprite.addChild(this._startLineSprite,1);

        //终止线
        this._endLineSprite=cc.Sprite.create(this._type==1?res.png_chedao_start:res.png_boat_start);
        this._endLineSprite.setPosition(cc.p(115,this._bgSprite.height/2));
        this._bgSprite.addChild(this._endLineSprite,1);
        this._endLineSprite.setVisible(false);

        if(this._type==1){

            var bgH=this._bgSprite.height;

            //车道线
            this._chedao1Sprite=cc.Sprite.create(res.png_chedao);
            this._chedao1Sprite.setAnchorPoint(cc.p(1,0.5));
            this._chedao1Sprite.setPosition(cc.p(GC.W,this._bgSprite.height/2));
            this._bgSprite.addChild(this._chedao1Sprite);

            this._chedao2Sprite=cc.Sprite.create(res.png_chedao);
            this._chedao2Sprite.setAnchorPoint(cc.p(1,0.5));
            this._chedao2Sprite.setPosition(cc.p(GC.W-this._chedao1Sprite.width,this._bgSprite.height/2));
            this._bgSprite.addChild(this._chedao2Sprite);

            this._chedao3Sprite=cc.Sprite.create(res.png_chedao);
            this._chedao3Sprite.setAnchorPoint(cc.p(1,0.5));
            this._chedao3Sprite.setPosition(cc.p(GC.W-this._chedao1Sprite.width*2,this._bgSprite.height/2));
            this._bgSprite.addChild(this._chedao3Sprite);

            //速度线上
            this._suduTop1Sprite=cc.Sprite.create(res.png_sudu_car);
            this._suduTop1Sprite.setAnchorPoint(cc.p(1,0.5));
            this._suduTop1Sprite.setPosition(cc.p(GC.W,bgH+this._suduTop1Sprite.height/2));
            this._bgSprite.addChild(this._suduTop1Sprite,2);

            this._suduTop2Sprite=cc.Sprite.create(res.png_sudu_car);
            this._suduTop2Sprite.setAnchorPoint(cc.p(1,0.5));
            this._suduTop2Sprite.setPosition(cc.p(GC.W-this._suduTop1Sprite.width,bgH+this._suduTop2Sprite.height/2));
            this._bgSprite.addChild(this._suduTop2Sprite,2);

            this._suduTop3Sprite=cc.Sprite.create(res.png_sudu_car);
            this._suduTop3Sprite.setAnchorPoint(cc.p(1,0.5));
            this._suduTop3Sprite.setPosition(cc.p(GC.W-this._suduTop2Sprite.width*2,bgH+this._suduTop3Sprite.height/2));
            this._bgSprite.addChild(this._suduTop3Sprite,2);


            //速度线下
            this._suduBottom1Sprite=cc.Sprite.create(res.png_sudu_car);
            this._suduBottom1Sprite.setAnchorPoint(cc.p(1,0.5));
            this._suduBottom1Sprite.setPosition(cc.p(GC.W,-this._suduBottom1Sprite.height/2));
            this._bgSprite.addChild(this._suduBottom1Sprite,2);

            this._suduBottom2Sprite=cc.Sprite.create(res.png_sudu_car);
            this._suduBottom2Sprite.setAnchorPoint(cc.p(1,0.5));
            this._suduBottom2Sprite.setPosition(cc.p(GC.W-this._suduBottom1Sprite.width,-this._suduBottom2Sprite.height/2));
            this._bgSprite.addChild(this._suduBottom2Sprite,2);

            this._suduBottom3Sprite=cc.Sprite.create(res.png_sudu_car);
            this._suduBottom3Sprite.setAnchorPoint(cc.p(1,0.5));
            this._suduBottom3Sprite.setPosition(cc.p(GC.W-this._suduBottom2Sprite.width*2,-this._suduBottom3Sprite.height/2));
            this._bgSprite.addChild(this._suduBottom3Sprite,2);

        }else if(this._type==3){
            /*//车道线
            this._chedao1Sprite=cc.Sprite.create(res.png_haidao);
            this._chedao1Sprite.setAnchorPoint(cc.p(1,0.5))
            this._chedao1Sprite.setPosition(cc.p(GC.W,this._bgSprite.height/2));
            this._bgSprite.addChild(this._chedao1Sprite);

            this._chedaoWidth=this._chedao1Sprite.width;

            this._chedao2Sprite=cc.Sprite.create(res.png_haidao);
            this._chedao2Sprite.setAnchorPoint(cc.p(1,0.5));
            this._chedao2Sprite.setPosition(cc.p(GC.W-this._chedaoWidth,this._bgSprite.height/2));
            this._bgSprite.addChild(this._chedao2Sprite);
            */

            //上方云
            this._suduTop1Sprite=cc.Sprite.create(res.png_yun);
            this._suduTop1Sprite.setAnchorPoint(cc.p(1,0.5))
            this._suduTop1Sprite.setPosition(cc.p(GC.W,this._bgSprite.height-22.5));
            this._bgSprite.addChild(this._suduTop1Sprite,2);

            this._suduTop2Sprite=cc.Sprite.create(res.png_yun);
            this._suduTop2Sprite.setAnchorPoint(cc.p(1,0.5))
            this._suduTop2Sprite.setPosition(cc.p(GC.W-this._suduTop1Sprite.width,this._bgSprite.height-22.5));
            this._bgSprite.addChild(this._suduTop2Sprite,2);


            //水泡线下
            this._suduBottom1Sprite=cc.Sprite.create(res.png_sudu_boat);
            this._suduBottom1Sprite.setAnchorPoint(cc.p(1,0.5));
            this._suduBottom1Sprite.setPosition(cc.p(GC.W,+this._suduBottom1Sprite.height/2));
            this._bgSprite.addChild(this._suduBottom1Sprite,2);

            this._suduBottom2Sprite=cc.Sprite.create(res.png_sudu_boat);
            this._suduBottom2Sprite.setAnchorPoint(cc.p(1,0.5));
            this._suduBottom2Sprite.setPosition(cc.p(GC.W-this._suduBottom2Sprite.width,+this._suduBottom2Sprite.height/2));
            this._bgSprite.addChild(this._suduBottom2Sprite,2);

            this._suduBottom3Sprite=cc.Sprite.create(res.png_sudu_boat);
            this._suduBottom3Sprite.setAnchorPoint(cc.p(1,0.5));
            this._suduBottom3Sprite.setPosition(cc.p(GC.W-this._suduBottom3Sprite.width*2,+this._suduBottom3Sprite.height/2));
            this._bgSprite.addChild(this._suduBottom3Sprite,2);
        }

    },
    updateRunwayX:function(){
        var speed=7;
        if(this._type==1) {
            this._chedao1Sprite.setPositionX(this._chedao1Sprite.getPositionX() + speed);
            this._chedao2Sprite.setPositionX(this._chedao2Sprite.getPositionX() + speed);
            this._chedao3Sprite.setPositionX(this._chedao3Sprite.getPositionX() + speed);
            if (this._chedao1Sprite.getPositionX() >= GC.W + this._chedao1Sprite.width) {
                this._chedao1Sprite.setPositionX(GC.W -  this._chedao1Sprite.width * 2)
            }
            if (this._chedao2Sprite.getPositionX() >= GC.W +  this._chedao2Sprite.width) {
                this._chedao2Sprite.setPositionX(GC.W -  this._chedao2Sprite.width * 2)
            }
            if (this._chedao3Sprite.getPositionX() >= GC.W +  this._chedao3Sprite.width) {
                this._chedao3Sprite.setPositionX(GC.W -  this._chedao3Sprite.width * 2)
            }

            this._suduTop1Sprite.setPositionX(this._suduTop1Sprite.getPositionX() + speed);
            this._suduTop2Sprite.setPositionX(this._suduTop2Sprite.getPositionX() + speed);
            this._suduTop3Sprite.setPositionX(this._suduTop3Sprite.getPositionX() + speed);
            if (this._suduTop1Sprite.getPositionX() >= GC.W + this._suduTop1Sprite.width) {
                this._suduTop1Sprite.setPositionX(GC.W - this._suduTop1Sprite.width * 2)
            }
            if (this._suduTop2Sprite.getPositionX() >= GC.W + this._suduTop2Sprite.width) {
                this._suduTop2Sprite.setPositionX(GC.W - this._suduTop2Sprite.width * 2)
            }
            if (this._suduTop3Sprite.getPositionX() >= GC.W + this._suduTop3Sprite.width) {
                this._suduTop3Sprite.setPositionX(GC.W - this._suduTop3Sprite.width * 2)
            }


        }else if(this._type==3){
            /*this._chedao1Sprite.setPositionX(this._chedao1Sprite.getPositionX() + speed);
            this._chedao2Sprite.setPositionX(this._chedao2Sprite.getPositionX() + speed);
            if (this._chedao1Sprite.getPositionX() >= GC.W + this._chedaoWidth) {
                this._chedao1Sprite.setPositionX(GC.W - this._chedaoWidth+5)
            }
            if (this._chedao2Sprite.getPositionX() >= GC.W + this._chedaoWidth) {
                this._chedao2Sprite.setPositionX(GC.W - this._chedaoWidth+5)
            }
            */
            this._suduTop1Sprite.setPositionX(this._suduTop1Sprite.getPositionX()+5);
            this._suduTop2Sprite.setPositionX(this._suduTop2Sprite.getPositionX()+5);
            if(this._suduTop1Sprite.getPositionX()>=GC.W+this._suduTop1Sprite.width){
                this._suduTop1Sprite.setPositionX(GC.W-this._suduTop1Sprite.width+3)
            }
            if(this._suduTop2Sprite.getPositionX()>=GC.W+this._suduTop1Sprite.width){
                this._suduTop2Sprite.setPositionX(GC.W-this._suduTop1Sprite.width+3)
            }


        }
        this._suduBottom1Sprite.setPositionX(this._suduBottom1Sprite.getPositionX() + speed);
        this._suduBottom2Sprite.setPositionX(this._suduBottom2Sprite.getPositionX() + speed);
        this._suduBottom3Sprite.setPositionX(this._suduBottom3Sprite.getPositionX() + speed);
        if (this._suduBottom1Sprite.getPositionX() >= GC.W + this._suduBottom1Sprite.width) {
            this._suduBottom1Sprite.setPositionX(GC.W - this._suduBottom1Sprite.width * 2)
        }
        if (this._suduBottom2Sprite.getPositionX() >= GC.W + this._suduBottom2Sprite.width) {
            this._suduBottom2Sprite.setPositionX(GC.W - this._suduBottom2Sprite.width * 2)
        }
        if (this._suduBottom3Sprite.getPositionX() >= GC.W + this._suduBottom3Sprite.width) {
            this._suduBottom3Sprite.setPositionX(GC.W - this._suduBottom3Sprite.width* 2)
        }

    },
    runwayRun:function(){
        this._soundId=cc.audioEngine.playEffect(this._type==1?res.mp3_car:res.mp3_boat,true);
        this._startLineSprite.setVisible(false);
        this._endLineSprite.setVisible(false);
        this.unschedule(this.updateRunwayX);
        this.schedule(this.updateRunwayX, 0.01);
    },
    runwayStop:function(){
        this.unschedule(this.updateRunwayX);
    },
    carScheduleCallback:function(){

        var shunxu=[0,1,2,3,4,5,6,7,8,9];
        shunxu=this.shuffle(shunxu);
        for(var i=0;i<shunxu.length;i++){
            var car=this._cars[shunxu[i]];

            var x=Math.floor(Math.random()*400+200);
            car.runTo(i*0.3,x,1,(function(cars,self){
                return function(){
                    self.getCarPosX(cars);
                }
            })(this._cars,this),false);

        }
    },
    getCarPosX:function(cars){
        var carInfo=[];
        for(var j=0;j<cars.length;j++){
            carInfo[j]={"n":cars[j].getTag(),"x":cars[j].getPositionX()}
        }
        carInfo.sort(function(a,b){
            return a.x-b.x;
        });
        var pm=[];
        carInfo.forEach(function(v,i){
            pm[i]=v.n;
        });
        var result=pm.join(",").replace("A","10");
        this._callback(result);

    },
    startRun:function(){
        this.runwayRun();
        this.carScheduleCallback();
        this.schedule(this.carScheduleCallback,3);

        if(this._type==3){
            var haiAnimation = new cc.Animation();
            for(var i=1;i<=27;i++){
                haiAnimation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("hai"+i+".png"));
            }
            haiAnimation.setDelayPerUnit(6/27);
            haiAnimation.setRestoreOriginalFrame(true);
            var haiAnimate = cc.animate(haiAnimation).repeatForever();
            this._bgSprite.runAction(haiAnimate);
        }
    },
    stopRun:function(ranking){
        this.unschedule(this.carScheduleCallback);
        this._startLineSprite.setVisible(false);
        this._endLineSprite.setVisible(true);

        var paiming=ranking.split(",");
        for(var i=0;i<paiming.length;i++){
            var car=this._cars[parseInt(paiming[i])-1];
            car.runTo(0,0,1+i*0.2,(function(ranking,self,i,soundId){
                return function(){
                    self._callback(ranking.replace("10","A").split(",").join(""));
                    if(i==9){
                        self._bgSprite.stopAllActions();
                        cc.audioEngine.stopEffect(soundId);
                        cc.audioEngine.stopAllEffects();
                        soundId=null;
                    }
                }
            })(ranking,this,i,this._soundId),true);
        }

        this.scheduleOnce(function(){
            this.runwayStop();
        },2);
    },
    reset:function(){
        this._endLineSprite.setVisible(false);
        this._startLineSprite.setVisible(true);
        for(var i=0;i<this._cars.length;i++){
            this._cars[i].setPositionX(GC.W-100);
        }
    },
    shuffle:function (array) {
        var currentIndex = array.length
            , temporaryValue
            , randomIndex
            ;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
    onExit:function(){
        cc.audioEngine.stopEffect(this._soundId);
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        this._super();
    }


});

TrackLayer.create=function(type,callback){
    return  new TrackLayer(type,callback);
};

