/**
 * Created by Administrator on 2017/6/24.
 */
var GameButton=ccui.Button.extend({
    _gameNoLabel:null,
    _resultLabel:null,
    _countDownLabel:null,
    ctor:function(bgImg,gameNo,result,nextTime,callback){
        this._super(bgImg,bgImg,"");
        var self=this;

        this._gameNoLabel = cc.LabelTTF.create("最新开奖0期", "Arial",26);
        this._gameNoLabel.setColor(cc.color(253,224,46,255));
        this._gameNoLabel.setNormalizedPosition(0.75, 0.80);
        this.addChild(this._gameNoLabel);

        this._resultLabel =new cc.LabelBMFont(result, res.fnt_no_num_small);
        this._resultLabel.setNormalizedPosition(0.75, 0.70);
        this.addChild(this._resultLabel);

      /*  var text1 = cc.LabelTTF.create("距离下次开奖剩余", "Arial",24);
        text1.setNormalizedPosition(0.75, 0.5);
        this.addChild(text1);

        this._mins =new cc.LabelBMFont("12:12", res.fnt_daojis);
        this._mins.setNormalizedPosition(0.75, 0.35);
        this.addChild(this._mins);*/

        this._countDownLabel=CountDownLabel.create();
        this._countDownLabel.setNormalizedPosition(0.75, 0.5);
        this.addChild(this._countDownLabel);


        this._stopLabel = cc.LabelTTF.create("游戏暂停", "Arial",30);
        this._stopLabel.setNormalizedPosition(0.75, 0.4);
        this.addChild(this._stopLabel);
        this._stopLabel.setVisible(false);

        this._startTimeLabel = cc.LabelTTF.create("开奖时间00:00~00:00", "Arial",30);
        this._startTimeLabel.setNormalizedPosition(0.73, 0.2);
        this.addChild(this._startTimeLabel);
        this._startTimeLabel.setVisible(false);

        this.setPressedActionEnabled(true);
        this.setZoomScale(-0.01);
        this.addClickEventListener(callback);
        return true;
    },
    _onPressStateChangedToPressed:function(){
        if (this._pressedTextureLoaded) {
            this._gameNoLabel.stopAllActions();
            this._gameNoLabel.runAction(cc.scaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP, 1 + this._zoomScale, 1 + this._zoomScale));

            this._resultLabel.stopAllActions();
            this._resultLabel.runAction(cc.scaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP, 1 + this._zoomScale, 1 + this._zoomScale));

            this._countDownLabel.stopAllActions();
            this._countDownLabel.runAction(cc.scaleTo(ccui.Button.ZOOM_ACTION_TIME_STEP, 1 + this._zoomScale, 1 + this._zoomScale));
        }else{
            this._gameNoLabel.stopAllActions();
            this._gameNoLabel.setScale(1 + this._zoomScale);

            this._resultLabel.stopAllActions();
            this._resultLabel.setScale(1 + this._zoomScale);

            this._countDownLabel.stopAllActions();
            this._countDownLabel.setScale(1 + this._zoomScale);
        }

        this._super();
    },
    _onPressStateChangedToNormal:function(){
        if(this._gameNoLabel){
            if (this._pressedTextureLoaded) {
                this._gameNoLabel.stopAllActions();
                this._gameNoLabel.setScale(1);
            }else{
                this._gameNoLabel.stopAllActions();
                this._gameNoLabel.setScale(1);
            }
        }
        if(this._resultLabel){
            if (this._pressedTextureLoaded) {
                this._resultLabel.stopAllActions();
                this._resultLabel.setScale(1);
            }else{
                this._resultLabel.stopAllActions();
                this._resultLabel.setScale(1);
            }
        }
        if(this._countDownLabel){
            if (this._pressedTextureLoaded) {
                this._countDownLabel.stopAllActions();
                this._countDownLabel.setScale(1);
            }else{
                this._countDownLabel.stopAllActions();
                this._countDownLabel.setScale(1);
            }
        }
        this._super();
    },
    setGameNo:function(gameNo){
        this._gameNoLabel.setString("最新开奖"+gameNo+"期");
    },
    setResult:function(result){
        this._resultLabel.setString(result.replace("10","A").split(",").join(""));
    },
    setCountdown:function(time){
        this._countDownLabel.setCountdown(time);
    },
    setStatus:function(status){
        if(status==4){
            this._stopLabel.setVisible(true);
            this._startTimeLabel.setVisible(true);
            this._countDownLabel.setVisible(false);
        }else{
            this._stopLabel.setVisible(false);
            this._startTimeLabel.setVisible(false);
            this._countDownLabel.setVisible(true);
        }
    },
    setStartTime:function(startTime,endTime){
        this._startTimeLabel.setString("开奖时间"+startTime+"~"+endTime);
    }
});

GameButton.create=function (bgImg,gameNo,result,nextTime,callback) {
    return new GameButton(bgImg,gameNo,result,nextTime,callback);
};