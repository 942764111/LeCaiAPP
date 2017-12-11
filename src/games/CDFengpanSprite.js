/**
 * Created by lyf on 2017/6/24.
 */
var CDFengpanSprite=cc.Sprite.extend({
    _endTime:null,
    _countdownLabel:null,
    _callback:null,
    ctor:function (callback) {
        this._super(res.png_bg_tishixinxi);

        this._callback=callback;

        var fengpanLabel= cc.LabelTTF.create("封盘", "Arial", 46);
        fengpanLabel.setColor(cc.color(255,171,13));
        fengpanLabel.setNormalizedPosition(0.5, 0.65);
        this.addChild(fengpanLabel);


        this._countdownLabel= cc.LabelTTF.create("等待开奖结果0S", "Arial", 26);
        this._countdownLabel.setNormalizedPosition(0.5, 0.25);
        this.addChild(this._countdownLabel);

    },
    setCountdown:function(time){
        if(!isFinite(time)){
            return;
        }
        //cc.log("FengpanCountdown:",time);
        if(time<=0){
            this.setVisible(false);
            this.unschedule(this.countdownSchedue);
            this._callback();
            return;
        }
        //GC.IS_ANIMATION=false;
        this._endTime=new Date(new Date().getTime()+time*1000);
        this.unschedule(this.countdownSchedue);
        this.schedule(this.countdownSchedue, 0.25);
    },
    countdownSchedue:function () {
        var time=parseInt((this._endTime-(new Date()).getTime())/1000);
        if(time<=0){
            this.setVisible(false);
            this.unschedule(this.countdownSchedue);
            this._countdownLabel.setString("等待开奖结果0S");
            this._callback();
            return;
        }
        this._countdownLabel.setString("等待开奖结果"+time+"S");

    }
});


CDFengpanSprite.create=function(callback){
    return  new CDFengpanSprite(callback);
};


