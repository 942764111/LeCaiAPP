/**
 * Created by lyf on 2017/7/16.
 * 充值
 */
var RECHARGEDETAILSLAYER;
var RechargeDetailsLayer = cc.Layer.extend({
    _mobileNumBox:null,
    _msg:null,
    ctor:function (msg) {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        var self = this;
        this._msg = msg;
        RECHARGEDETAILSLAYER = this;

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

        var rechargeMess = new cc.LabelTTF("充值详情","微软雅黑", 35);
        rechargeMess.setNormalizedPosition(0.5, 0.96);
        bg.addChild(rechargeMess);

        var chongzhiBg_s = new cc.Sprite(res.png_img_chongzhiBg_s);
        chongzhiBg_s.setNormalizedPosition(0.5, 0.7);
        bg.addChild(chongzhiBg_s);

        var jingeText = new cc.LabelTTF("请输入充值金额","微软雅黑", 35);
        jingeText.setNormalizedPosition(0.05, 0.9);
        jingeText.setAnchorPoint(cc.p(0,0.5));
        chongzhiBg_s.addChild(jingeText);

        var tishi = new cc.LabelTTF("单笔最小充值金额"+msg.minRecharge+"元,最大充值金额"+msg.maxRecharge+"元","微软雅黑", 25);
        tishi.setNormalizedPosition(0.5, 0.35);
        tishi.setColor(cc.color(255,255,0,0));
        chongzhiBg_s.addChild(tishi);

        var line1 = new cc.Sprite(res.png_btn_enter_wode);
        line1.setNormalizedPosition(0.5, 0.55);
        chongzhiBg_s.addChild(line1);
        this._mobileNumBox = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._mobileNumBox.x = GC.W / 2;
        this._mobileNumBox.y = GC.H /2 + 330;
        this._mobileNumBox.setPlaceHolder("请输入充值金额");
        this._mobileNumBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._mobileNumBox.setPlaceholderFontSize(30);
        this._mobileNumBox.setDelegate(this);
        this._mobileNumBox.setName("mobileNumBox");
        this._mobileNumBox.setFontSize(28);
        this.addChild(this._mobileNumBox);

        var jingeText = new cc.LabelTTF("元","微软雅黑", 35);
        jingeText.setNormalizedPosition(0.91, 0.6);
        jingeText.setAnchorPoint(cc.p(0,0.5));
        chongzhiBg_s.addChild(jingeText);

        var yesBtn = new ccui.Button(res.png_btn_confirm,res.png_btn_confirm);
        yesBtn.setNormalizedPosition(0.5, 0.15);
        yesBtn.setTitleText("确定");
        yesBtn.setTitleColor(cc.color(17,28,67));
        yesBtn.setTitleFontSize(30);
        yesBtn.setPressedActionEnabled(true);
        chongzhiBg_s.addChild(yesBtn);
        yesBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(Number(self._mobileNumBox.getString()) >= 10)
            {
                var reqUrl = GC.URL + "user/getRechargeInfo?"
                    + "client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                ;
                th.Http.inst().get(reqUrl,function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        GC.RECHARGE = data;
                        GC.RECHARGE_DATA._RECHARGENum = self._mobileNumBox.getString();
                        var recharge = new RechargeLayer(data,self._mobileNumBox.getString());
                        self.addChild(recharge);
                    }else
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                        });
                        self.addChild(chenggong);
                    }
                })
            }else {
                var alertStr = new th.AlertLayer(self,res.png_img_tishikuang,"请输入正确金额");
            }
        })

        return true;
    },
    editBoxEditingDidEnd: function (editBox) {
        switch(editBox.getName())
        {
            case"mobileNumBox":
                var patrn=/^[0-9]+$/;
                if(patrn.test(editBox.getString()) && Number(editBox.getString())>= RECHARGEDETAILSLAYER._msg.minRecharge && Number(editBox.getString())<= RECHARGEDETAILSLAYER._msg.maxRecharge)
                {

                }else
                {
                    var alertStr = new th.AlertLayer(RECHARGEDETAILSLAYER,res.png_img_tishikuang,"请输入正确金额");
                    // RECHARGEDETAILSLAYER._mobileNumBox.setString("");
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
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }
});