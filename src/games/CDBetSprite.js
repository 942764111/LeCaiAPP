/**
 * Created by lyf on 2017/6/24.
 */
var CDBetSprite=cc.Sprite.extend({
    _endTime:null,
    _countdownLabel:null,
    _countdownLabelBig:null,
    _callback:null,
    _soundId:null,
    ctor:function (callback,gameType) {
        this._super(res.png_bg_bet_countdown);

        this._callback=callback;
        this._soundId=null;

        var betLabel= cc.LabelTTF.create("离投注结束还剩", "Arial", 23);
        betLabel.setNormalizedPosition(0.5, 0.62);
        this.addChild(betLabel);

        this._countdownLabel= cc.LabelTTF.create("(0)", "Arial", 24);
        this._countdownLabel.setColor(cc.color(255,171,13));
        this._countdownLabel.setNormalizedPosition(0.5, 0.23);
        this.addChild(this._countdownLabel);

        this._countdownLabelBig= new cc.LabelBMFont("29", res.fnt_countdown);
        this._countdownLabelBig.setScale(1.5);
        this._countdownLabelBig.setNormalizedPosition(0.5, 6);
        if(gameType==2||gameType==8){
            this._countdownLabelBig.setNormalizedPosition(0.5, 5.5);
        }
        this._countdownLabelBig.setVisible(false);
        this.addChild(this._countdownLabelBig);


    },
    setCountdown:function(time){
        if(!isFinite(time)){
            return;
        }
        //cc.log("BetCountdown:",time);
        if(time<=0){
            this.setVisible(false);
            this.unschedule(this.countdownSchedue);
            this._callback();
            return;
        }
        //GC.IS_ANIMATION=false;
        this._soundId=null;
        this._endTime=new Date(new Date().getTime()+time*1000);
        this.unschedule(this.countdownSchedue);
        this.schedule(this.countdownSchedue, 0.25);
    },
    countdownSchedue:function () {
        var time=parseInt((this._endTime-(new Date()).getTime())/1000);
        if(time<=0){
            this.setVisible(false);
            this._countdownLabelBig.setVisible(false);
            this._countdownLabelBig.setString("0");
            this.unschedule(this.countdownSchedue);
            this._countdownLabel.setString("0s");
            this._callback();
            return;
        }
        if(time==30){
            this._soundId=cc.audioEngine.playEffect(res.mp3_countdown30);
        }
        if(time==3&&this._soundId==null){
            this._soundId=cc.audioEngine.playEffect(res.mp3_countdown);
            if(this._soundId==null){
                this._soundId=1;
            }
        }
        if(time<=30){
            this._countdownLabelBig.setVisible(true);
            this._countdownLabelBig.setString(time+"");
        }
        this._countdownLabel.setString(time+"s");


    },
    isCountdown:function(){
         //是否还在倒计时
        var time=parseInt((this._endTime-(new Date()).getTime())/1000);
        if(time>0){
            this.setVisible(true);
        }
    }

});


CDBetSprite.create=function(callback,gameType){
    return  new CDBetSprite(callback,gameType);
};


