/**
 * Created by lyf on 2017/6/24.
 */
var CancelBetButton=ccui.Button.extend({
    _callback:null,
    ctor:function (callback) {
        this._super(res.png_btn_bet_cancel);

        this._callback=callback;
        this._betLabel= cc.LabelTTF.create("取消下注", "Arial", 30);
        this._betLabel.setColor(cc.color(253,224,46,100));
        this._betLabel.setNormalizedPosition(0.5, 0.65);
        this.addChild(this._betLabel);

        this._countdownLabel= cc.LabelTTF.create("（0）", "Arial", 24);
        this._countdownLabel.setNormalizedPosition(0.5, 0.25);
        this.addChild(this._countdownLabel);

    },
    _onPressStateChangedToPressed:function(){
        if (this._pressedTextureLoaded) {
            this._betLabel.stopAllActions();
            this._betLabel.runAction(cc.scaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP, 1 + this._zoomScale, 1 + this._zoomScale));

            this._countdownLabel.stopAllActions();
            this._countdownLabel.runAction(cc.scaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP, 1 + this._zoomScale, 1 + this._zoomScale));
        }else{
            this._betLabel.stopAllActions();
            this._betLabel.setScale(1 + this._zoomScale);

            this._countdownLabel.stopAllActions();
            this._countdownLabel.setScale(1 + this._zoomScale);
        }
        this._super();
    },
    _onPressStateChangedToNormal:function(){
        if(this._betLabel){
            this._betLabel.stopAllActions();
            this._betLabel.setScale(1);

            this._countdownLabel.stopAllActions();
            this._countdownLabel.setScale(1);
        }
        this._super();
    },
    setCountdown:function(time){
        if(time<=0){
            this.setVisible(false);
            return;
        }
        this._endTime=new Date(new Date().getTime()+time*1000);
        this.unschedule(this.countdownSchedue);
        this.schedule(this.countdownSchedue, 0.2);
    },
    countdownSchedue:function () {
        var time=parseInt((this._endTime-(new Date()).getTime())/1000);
        if(time<=0){
            this.unschedule(this.countdownSchedue);
            this._countdownLabel.setString("（0）");
            this.setVisible(false);
            this._callback();
            return;
        }
        this._countdownLabel.setString("（"+time+"）");

    }

});



