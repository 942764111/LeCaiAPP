/**
 * Created by lyf on 2017/6/24.
 */
var CDStartSprite=cc.Sprite.extend({
    _endTime:null,
    _countdownLabel:null,
    _callback:null,
    ctor:function (callback) {
        //this._super(res.png_bg_countdown);
        this._super(res.png_bg_tishixinxi);

        this._callback=callback;

        this._countdownLabel= cc.LabelTTF.create("0s", "Arial", 50);
        this._countdownLabel.setColor(cc.color(255,171,13));
        this._countdownLabel.setNormalizedPosition(0.5, 0.65);
        this.addChild(this._countdownLabel);

        var fengpanLabel= cc.LabelTTF.create("离下局开始还剩", "Arial", 26);
        fengpanLabel.setNormalizedPosition(0.5, 0.25);
        this.addChild(fengpanLabel);

    },
    setCountdown:function(time){
        if(!isFinite(time)){
            return;
        }
        //cc.log("NextStartCountdown:",time);
        if(time<=0){
            this.setVisible(false);
            this.unschedule(this.countdownSchedue);
            this._callback();
            return;
        }
        this._endTime=new Date(new Date().getTime()+time*1000);
        this.unschedule(this.countdownSchedue);
        this.schedule(this.countdownSchedue, 0.25);
    },
    countdownSchedue:function () {
        var time=parseInt((this._endTime-(new Date()).getTime())/1000);
        if(time<=0){
            this.setVisible(false);
            this.unschedule(this.countdownSchedue);
            this._countdownLabel.setString("0s");
            this._callback();
            return;
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


CDStartSprite.create=function(callback){
    return  new CDStartSprite(callback);
};


