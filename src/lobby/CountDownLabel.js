/**
 * Created by tanhao on 2017/1/17.
 */

var CountDownLabel = cc.LabelTTF.extend({
    _endTime:null,
    ctor: function () {
        this._super("距离下次开奖剩余", "Arial",30);


        this._min1 =new cc.LabelBMFont("0", res.fnt_count_down);
        this._min1.setNormalizedPosition(cc.p(0,-0.9));
        this.addChild(this._min1);

        this._min2 =new cc.LabelBMFont("0", res.fnt_count_down);
        this._min2.setNormalizedPosition(cc.p(0.30,-0.9));
        this.addChild(this._min2);


        this._sec1 =new cc.LabelBMFont("0", res.fnt_count_down);
        this._sec1.setNormalizedPosition(cc.p(0.71,-0.9));
        this.addChild(this._sec1);

        this._sec2 =new cc.LabelBMFont("0", res.fnt_count_down);
        this._sec2.setNormalizedPosition(cc.p(1.00,-0.9));
        this.addChild(this._sec2);

        return true;
    },
    setCountdown:function(time){
        this._endTime=new Date(new Date().getTime()+time*1000);
        this.unschedule(this.countdownSchedue);
        this.schedule(this.countdownSchedue, 0.2);
    },
    countdownSchedue:function () {
        var time=parseInt((this._endTime-(new Date()).getTime())/1000+0.3);
        if(time<=0){
            this.unschedule(this.scheduleMultipleMsgCallback);
            this._min1.setString("0");
            this._min2.setString("0");
            this._sec1.setString("0");
            this._sec2.setString("0");
            return;
        }
        var min=parseInt(time/60);
        var sec=time%60;

        this._min1.setString(parseInt(min/10));
        this._min2.setString(min%10);
        this._sec1.setString(parseInt(sec/10));
        this._sec2.setString(sec%10);

    }

});

CountDownLabel.create=function(){
    return new CountDownLabel();
};