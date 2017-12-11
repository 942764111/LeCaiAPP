/**
 * Created by lyf on 2017/7/3.
 *
 * 上庄
 */
var ONVILLAGELAYER;
var OnVillageLayer = cc.Layer.extend({
    _onVillageData:null,
    _currDairuTable:null,
    _dq_dairuBtn:null,
    _minData:null, // 最小上庄值
    _buyInScale:null,
    buyInGold:null,
    _max_host_banlance:null,// 最大上庄值
    ctor:function (minData,max_host_banlance) {
        this._super();

        var self = this;
        ONVILLAGELAYER = this;
        this._minData = Number(minData);
        this._max_host_banlance = Number(max_host_banlance);

        this.buyInGold = this._minData;

        this._layerColor=new cc.LayerColor(cc.color(0,0,0,255*0.5),GC.W,GC.H);
        this.addChild(this._layerColor);
        var self = this;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        var bg = new cc.Sprite(res.png_img_shangzhuangBg);
        bg.setPosition(cc.p(GC.W/2,GC.H / 2));
        this.addChild(bg);
        var bgHeadimg = new cc.Sprite(res.png_img_shangzhuangBg_t);
        bgHeadimg.setPosition(cc.p(bgHeadimg.width/2 + 12,bg.height - bgHeadimg.height / 2 - 12));
        bg.addChild(bgHeadimg);
        var userlistLable = new cc.LabelTTF("申请上庄","微软雅黑", 35);
        userlistLable.setNormalizedPosition(0.5, 0.93);
        bg.addChild(userlistLable);
        var zuixiao = new cc.LabelTTF("最小带入","微软雅黑", 30);
        zuixiao.setNormalizedPosition(0.12, 0.74);
        zuixiao.setColor(cc.color(179,176,162,0));
        bg.addChild(zuixiao);

        var zuixiaoNumTable = new cc.LabelTTF(this._minData+"","微软雅黑", 30);
        zuixiaoNumTable.setNormalizedPosition(0.12, 0.5);
        zuixiaoNumTable.setColor(cc.color(179,176,162,0));
        bg.addChild(zuixiaoNumTable);

        var zuida = new cc.LabelTTF("最大带入","微软雅黑", 30);
        zuida.setNormalizedPosition(0.88, 0.74);
        zuida.setColor(cc.color(179,176,162,0));
        bg.addChild(zuida);

        if(GC.BALANCE <= this._max_host_banlance)
        {
            var zuidaNumTable = new cc.LabelTTF(GC.BALANCE+"","微软雅黑", 30);
            this._buyInScale = Math.round((GC.BALANCE - this._minData)/100);
        }else
        {
            var zuidaNumTable = new cc.LabelTTF(this._max_host_banlance,"微软雅黑", 30);
            this._buyInScale = Math.round((this._max_host_banlance - this._minData)/100);
        }
        zuidaNumTable.setNormalizedPosition(0.85, 0.5);
        zuidaNumTable.setColor(cc.color(179,176,162,0));
        bg.addChild(zuidaNumTable);

        // _currDairuTable
        var dangqiandairu = new cc.LabelTTF("当前带入","微软雅黑", 30);
        dangqiandairu.setNormalizedPosition(0.12, 0.35);
        dangqiandairu.setColor(cc.color(179,176,162,0));
        bg.addChild(dangqiandairu);

        // 当前下注金额
        // this._dq_dairuBtn = new ccui.Button(res.png_img_dairuImg);
        // this._dq_dairuBtn.setNormalizedPosition(0.5, 0.35);
        // this._dq_dairuBtn.setTouchEnabled(false);
        // this._dq_dairuBtn.setTitleText(this._minData+"");
        // this._dq_dairuBtn.setTitleColor(cc.color(255,171,13,0));
        // this._dq_dairuBtn.setTitleFontSize(30);
        // bg.addChild(this._dq_dairuBtn);

        this._dq_dairuBtn = new cc.EditBox(cc.size(220, 50), new cc.Scale9Sprite(res.png_img_dairuImg));
        this._dq_dairuBtn.x = GC.W / 2+20;
        this._dq_dairuBtn.y = GC.H / 2 - 80;
        this._dq_dairuBtn.setString(this._minData);
        this._dq_dairuBtn.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._dq_dairuBtn.setPlaceholderFontSize(30);
        this._dq_dairuBtn.setDelegate(this);
        this._dq_dairuBtn.setFontSize(30);
        this._dq_dairuBtn.setName("dq_dairuBtn");
        this.addChild(this._dq_dairuBtn);

        var huakuaibg = new cc.Sprite(res.png_img_huakuaiBg);
        huakuaibg.setNormalizedPosition(0.5,0.62);
        bg.addChild(huakuaibg);

        var slider = new ccui.Slider();
        slider.setTouchEnabled(true);
        slider.loadBarTexture(res.png_img_huakuai_xian);
        slider.loadSlidBallTextures(res.png_btn_huakuaiBtn, res.png_btn_huakuaiBtn, "");
        slider.loadProgressBarTexture(res.png_btn_huakuaiBtn);
        slider.setNormalizedPosition(0.5,0.62);
        slider.addEventListener(this.sliderEvent, this);
        bg.addChild(slider);

        var queren = new ccui.Button(res.png_img_huakuai_quedingBtn);
        queren.setTitleText("确定");
        queren.setTitleFontSize(28);
        queren.setNormalizedPosition(0.5, 0.12);
        bg.addChild(queren);
        queren.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var reqUrl = GC.URL + "room/beHost?"
                + "&host_balance="+self._dq_dairuBtn.getString()
                + "&client_id="+GC.CLIENT_ID
                + "&token="+GC.TOKEN;
            ;
            th.Http.inst().get(reqUrl,function (isSuccess, data) {
                if(isSuccess && data.code == "200")
                {
                    self.close();
                }else
                {
                    var chenggong=new th.PopupLayer(data.message,"确定",function(){
                    });
                    ONVILLAGELAYER.addChild(chenggong);
                }
            })
        })

        var closeBtn = new ccui.Button(res.png_btn_closeBtn);
        closeBtn.setNormalizedPosition(0.94, 1.1);
        bg.addChild(closeBtn);
        closeBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        })
        return true;
    },
    sliderEvent: function (sender, type) {
        switch (type) {
            case ccui.Slider.EVENT_PERCENT_CHANGED:
                var slider = sender;
                var percent = slider.getPercent();
                ONVILLAGELAYER.buyInGold = ONVILLAGELAYER._minData+Math.round(ONVILLAGELAYER._buyInScale * percent);
                ONVILLAGELAYER._dq_dairuBtn.setString(ONVILLAGELAYER.buyInGold);

                break;
            default:
                break;
        }
    },
    editBoxEditingDidEnd: function (editBox)
    {
        switch (editBox.getName())
        {
            case"dq_dairuBtn":
                var patrn=/^[0-9]+$/;
                if(patrn.test(editBox.getString()))
                {

                }else
                {
                    var alertStr = new th.AlertLayer(ONVILLAGELAYER,res.png_img_tishikuang,"请输入正确的钱数");
                    // ONVILLAGELAYER._dq_dairuBtn.setString("");
                }
                break;
        }
    },
    onEnter:function(){
        this._super();

        this.setScale(0);
        var scaleTo = cc.scaleTo(0.25,1.0);
        this.runAction(scaleTo.easing(cc.easeBackOut()));
    },
    close:function(){
        //this._layerColor.runAction(cc.fadeOut(0.1));
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }
});