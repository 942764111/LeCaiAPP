/**
 * Created by lyf on 2017/6/27.
 * 时时彩里面的龙虎
 */
var SSCLongHuLayer=GameBaseLayer.extend({
    ctor:function (groupType,gameType,gameLimit,roomData) {
        this._super(groupType,gameType,gameLimit,roomData);


        var danBtn = new BettingButton(res.png_btn_longhuZBtn);
        danBtn.setNormalizedPosition(0.327, 0.45);
        danBtn.setTitleText("单");
        danBtn.setTitleFontSize(60);
        this.addChild(danBtn);
        var shuangBtn = new BettingButton(res.png_btn_longhuYBtn);
        shuangBtn.setNormalizedPosition(0.673, 0.45);
        shuangBtn.setTitleText("双");
        shuangBtn.setTitleFontSize(60);
        this.addChild(shuangBtn);

        var bigBtn = new BettingButton(res.png_btn_longhuZBtn);
        bigBtn.setNormalizedPosition(0.327, 0.33);
        bigBtn.setTitleText("大");
        bigBtn.setTitleFontSize(60);
        this.addChild(bigBtn);
        var smallBtn = new BettingButton(res.png_btn_longhuYBtn);
        smallBtn.setNormalizedPosition(0.673, 0.33);
        smallBtn.setTitleText("小");
        smallBtn.setTitleFontSize(60);
        this.addChild(smallBtn);var bigBtn = new BettingButton(res.png_btn_longhuZBtn);

        var longBtn = new BettingButton(res.png_btn_longhuZBtn);
        longBtn.setNormalizedPosition(0.327, 0.21);
        longBtn.setTitleText("龍");
        longBtn.setTitleFontSize(60);
        this.addChild(longBtn);
        var huBtn = new BettingButton(res.png_btn_longhuYBtn);
        huBtn.setNormalizedPosition(0.673, 0.21);
        huBtn.setTitleText("虎");
        huBtn.setTitleFontSize(60);
        this.addChild(huBtn);

        // var danshuangDSBtn = new BettingButton(res.png_btn_longhuBtn);
        // danshuangDSBtn.setNormalizedPosition(0.5, 0.45);
        // this.addChild(danshuangDSBtn);

        return true;
    },
    setTotalBet:function (text) { // 刷新总额
        this._totalChipsText.setTitleText(text);
    },
    onEnter:function(){
        this._super();

        this.setPositionX(-GC.W);
        var moveTo=cc.moveTo(0.25,cc.p(0,this.getPositionY()));
        this.runAction(moveTo.easing(cc.easeExponentialOut()));
    },
    onExit:function(){
        this.removeFromParent();
        this._super();
    },
    onQuit:function () {
        var moveTo=cc.moveTo(0.25,cc.p(-GC.W,this.getPositionY()));
        this.runAction(moveTo.easing(cc.easeExponentialOut()));
    }
});