/**
 * Created by lyf on 2017/7/17.
 * 提款详情
 */
var WITHDRAWALSLAYER;
var WithDrawalsLayer = cc.Layer.extend({
    _mobileNumBox:null,
    _withDrawalsData:null,
    _bankId:null,
    ctor:function (withDrawalsData,bankId) {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        WITHDRAWALSLAYER = this;
        var self = this;
        this._bankId = bankId;
        this._withDrawalsData = withDrawalsData;

        var bg = new cc.Sprite(res.png_img_rechargeBg);
        bg.setPosition(cc.p(GC.W/2,GC.H / 2));
        this.addChild(bg);

        var backBtn = new ccui.Button(res.png_btn_back);
        backBtn.setNormalizedPosition(cc.p(0.1,0.96));
        this.addChild(backBtn);
        backBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        })

        var rechargeMess = new cc.LabelTTF("提现详情","微软雅黑", 35);
        rechargeMess.setNormalizedPosition(0.5, 0.96);
        bg.addChild(rechargeMess);

        var chongzhiBg_s = new cc.Sprite(res.png_img_chongzhiBg_s);
        chongzhiBg_s.setNormalizedPosition(0.5, 0.7);
        bg.addChild(chongzhiBg_s);

        var jingeText = new cc.LabelTTF("提现金额","微软雅黑", 35);
        jingeText.setNormalizedPosition(0.05, 0.9);
        jingeText.setAnchorPoint(cc.p(0,0.5));
        chongzhiBg_s.addChild(jingeText);

        var keyongText = new cc.LabelTTF("可用余额:   "+this._withDrawalsData.data.balance,"微软雅黑", 30);
        keyongText.setNormalizedPosition(0.05, 0.8);
        keyongText.setColor(cc.color(42,190,174,255))
        keyongText.setAnchorPoint(cc.p(0,0.5));
        chongzhiBg_s.addChild(keyongText);

        var shenyuText = new cc.LabelTTF("剩余免费提现次数:   "+this._withDrawalsData.data.free_times,"微软雅黑", 30);
        shenyuText.setNormalizedPosition(0.05, 0.7);
        shenyuText.setColor(cc.color(42,190,174,255))
        shenyuText.setAnchorPoint(cc.p(0,0.5));
        chongzhiBg_s.addChild(shenyuText);

        var line1 = new cc.Sprite(res.png_btn_enter_wode);
        line1.setNormalizedPosition(0.5, 0.45);
        chongzhiBg_s.addChild(line1);
        this._mobileNumBox = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._mobileNumBox.x = GC.W / 2;
        this._mobileNumBox.y = GC.H /2 + 280;
        this._mobileNumBox.setPlaceHolder("请输入提现金额");
        this._mobileNumBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._mobileNumBox.setPlaceholderFontSize(30);
        this._mobileNumBox.setDelegate(this);
        this._mobileNumBox.setFontSize(28);
        this.addChild(this._mobileNumBox);
        var jingeText = new cc.LabelTTF("元","微软雅黑", 35);
        jingeText.setNormalizedPosition(0.91, 0.5);
        jingeText.setAnchorPoint(cc.p(0,0.5));
        chongzhiBg_s.addChild(jingeText);

        var yesBtn = new ccui.Button(res.png_btn_confirm,res.png_btn_confirm);
        yesBtn.setNormalizedPosition(0.5, 0.3);
        yesBtn.setTitleText("确定");
        yesBtn.setTitleColor(cc.color(17,28,67));
        yesBtn.setTitleFontSize(30);
        yesBtn.setPressedActionEnabled(true);
        chongzhiBg_s.addChild(yesBtn);
        yesBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(self._mobileNumBox.getString() != "" && (Number(self._mobileNumBox.getString()) <= Number(self._withDrawalsData.data.balance)))
            {
                var inputPassWordLayer = new InputPassWordLayer(self._mobileNumBox.getString(),self._bankId);
                self.addChild(inputPassWordLayer);
            }else {
                var alertStr = new th.AlertLayer(self,res.png_img_tishikuang,"请输入正确提款金额");
            }
        })

        var zhuyiText = new cc.LabelTTF(this._withDrawalsData.data.tips+"","微软雅黑", 28);
        zhuyiText.setNormalizedPosition(0.5, 0.12);
        zhuyiText.setColor(cc.color(255,255,0,0));
        chongzhiBg_s.addChild(zhuyiText);

        return true;
    },
    onEnter:function(){
        this._super();
        this.setScale(0);
        var scaleTo = cc.scaleTo(0.25,1.0);
        this.runAction(scaleTo.easing(cc.easeBackOut()));
    },
    close:function(){
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }
});
