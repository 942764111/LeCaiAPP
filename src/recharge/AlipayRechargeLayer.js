/**
 * Created by lyf on 2017/7/28.
 * 支付宝充值
 */
var ALIPAYRECHARGELAYER;
var AlipayRechargeLayer = cc.Layer.extend({
    _jine:null,
    _msg:null,
    ctor: function (msg,btnText) {
        this._super();
        var self=this;
        this._msg =msg;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        ALIPAYRECHARGELAYER = this;
        this._layerColor=new cc.LayerColor(cc.color(0,0,0,255*0.6),GC.W,GC.H);
        this.addChild(this._layerColor);

        var bgImg=cc.Sprite.create(res.png_bg_popup);
        bgImg.x=GC.W/2;
        bgImg.y=GC.H/2;
        this.addChild(bgImg);

        var tishi = new cc.LabelTTF("单笔最小充值金额"+msg.minRecharge+"元,最大充值金额"+msg.maxRecharge+"元","微软雅黑", 25);
        tishi.setNormalizedPosition(0.5, 0.85);
        tishi.setColor(cc.color(255,255,0,0));
        bgImg.addChild(tishi);

        var line1 = new cc.Sprite(res.png_btn_enter_wode);
        line1.setNormalizedPosition(0.5, 0.5);
        bgImg.addChild(line1);
        this._jine = new cc.EditBox(cc.size(220, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._jine.x = GC.W / 2-10;
        this._jine.y = GC.H / 2+30;
        this._jine.setName("jine");
        this._jine.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._jine.setPlaceHolder("请输入充值金额");
        this._jine.setPlaceholderFontSize(30);
        this._jine.setDelegate(this);
        this._jine.setFontSize(30);
        this.addChild(this._jine);

        var noBtn = new ccui.Button(res.png_btn_cancel,res.png_btn_cancel);
        noBtn.setNormalizedPosition(0.3, 0.42);
        noBtn.setTitleText("取消");
        noBtn.setTitleColor(cc.color(17,28,67));
        noBtn.setTitleFontSize(30);
        noBtn.setPressedActionEnabled(true);
        noBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        });
        this.addChild(noBtn);


        var yesBtn = new ccui.Button(res.png_btn_confirm,res.png_btn_confirm);
        yesBtn.setNormalizedPosition(0.70, 0.42);
        yesBtn.setTitleText(btnText);
        yesBtn.setTitleColor(cc.color(17,28,67));
        yesBtn.setTitleFontSize(30);
        yesBtn.setPressedActionEnabled(true);
        yesBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var shijian = new Date()
            var nonce_str = hex_md5(shijian.getTime()+GC.LOGIN_NAME);//取当天时间  MD5加密，生成随机字符串
            var sign = "";
            var arr = ["recharge_cash","pay_type","nonce_str","client_id","token"];
            arr.sort(); // 排序
            var str = "";// 各种拼接后的字符串
            for(var i = 0; i < arr.length ; i++)
            {
                switch (arr[i])
                {
                    case "recharge_cash":
                        arr[i] = ("recharge_cash="+ALIPAYRECHARGELAYER._jine.getString());
                        str += arr[i];
                        break;
                    case "pay_type":
                        arr[i] = ("pay_type=alipay");
                        str += arr[i];
                        break;
                    case "nonce_str":
                        arr[i] = ("nonce_str="+nonce_str);
                        str += arr[i];
                        break;
                    case "client_id":
                        arr[i] = ("client_id="+GC.CLIENT_ID);
                        str += arr[i];
                        break;
                    case "token":
                        arr[i] = ("token="+GC.TOKEN);
                        str += arr[i];
                        break;
                }
                if(i < arr.length-1)
                {
                    str += "&"
                }
            }
            str += "guangcai";
            sign = hex_md5(str);
            if(ALIPAYRECHARGELAYER._jine.getString() != "")
            {
                var reqUrl = GC.URL + "pay/onlineRecharge?"
                    + "recharge_cash="+ALIPAYRECHARGELAYER._jine.getString()
                    + "&pay_type=alipay"
                    + "&nonce_str="+nonce_str
                    + "&sign="+sign
                    + "&client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                th.Http.inst().get(reqUrl,function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        cc.sys.openURL(data.data.qr_code);
                        self.close();
                    }else
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                        });
                        self.addChild(chenggong);
                    }
                })
            }else
            {
                var alertStr = new th.AlertLayer(ALIPAYRECHARGELAYER,res.png_img_tishikuang,"请输入正确金额");
                ALIPAYRECHARGELAYER._jine.setString("");
            }
        });
        this.addChild(yesBtn);


        return true;
    },
    editBoxEditingDidEnd: function (editBox) {
        switch(editBox.getName())
        {
            case"jine":
                var patrn=/^[0-9]+$/;
                if(patrn.test(editBox.getString()) && Number(editBox.getString()) >= ALIPAYRECHARGELAYER._msg.minRecharge && Number(editBox.getString())<= ALIPAYRECHARGELAYER._msg.maxRecharge)
                {
                }else
                {
                    var alertStr = new th.AlertLayer(ALIPAYRECHARGELAYER,res.png_img_tishikuang,"请输入正确金额");
                    // ALIPAYRECHARGELAYER._jine.setString("");
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
        this._layerColor.runAction(cc.fadeOut(0.1));
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }

});