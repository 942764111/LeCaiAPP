/**
 * Created by lyf on 2017/7/11.
 * 倒计时
 */
var CountDown=ccui.Button.extend({
    _endTime:null,
    ctor: function (img,time) {
        this._super(img);
        this._saicheTimer = new cc.LabelTTF("00:00","微软雅黑", 30);
        this._saicheTimer.setNormalizedPosition(0.5,0.2);
        this.addChild(this._saicheTimer);

        this.setCountDown(time);
    },
    countdownSchedue:function(){
        var time=parseInt((this._endTime-(new Date()).getTime())/1000);
        if(time<=0){
            this.unschedule(this.countdownSchedue);
            this._saicheTimer.setString("00:00");
            return;
        }
        var min=parseInt(time/60);
        var sec=time%60;
        this._saicheTimer.setString(parseInt(min/10)+""+(min%10) + ":" + parseInt(sec/10)+""+(sec%10));

    },
    setCountDown:function(time){
        this._endTime=new Date(new Date().getTime()+time*1000);
        this.unschedule(this.countdownSchedue);
        this.schedule(this.countdownSchedue, 0.2);
    }
});
