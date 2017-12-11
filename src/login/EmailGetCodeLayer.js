/**
 * Created by lyf on 2017/6/24.
 * 邮箱获取验证码
 */
var G_EMAILGETCODELAYER;
var EmailGetCodeLayer=LoginBaseLayer.extend({
    _mobileNumBox:null,
    _bankBox:null,
    _zijingBox:null,
    _xinPasswordBox:null,
    _querenPasswordBox:null,
    ctor:function () {
        this._super();

        G_EMAILGETCODELAYER = this;
        var self = this;
        var bgSprite=cc.Sprite.create(res.png_bg_login);
        bgSprite.setPosition(cc.p(GC.W/2,GC.H/2));
        this.addChild(bgSprite);

        var mobileLoginStr = new cc.LabelTTF("修改密码","微软雅黑", 30);
        mobileLoginStr.setNormalizedPosition(0.5, 0.97);
        this.addChild(mobileLoginStr);

        var returnBtn = new ccui.Button(res.png_btn_backbai);
        returnBtn.setNormalizedPosition(0.07, 0.96);
        this.addChild(returnBtn);
        returnBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.onQuit();
        });

        var line1 = new cc.Sprite(res.png_btn_enter_wode);
        line1.setNormalizedPosition(0.5, 0.86);
        this.addChild(line1);
        this._mobileNumBox = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._mobileNumBox.x = GC.W / 2;
        this._mobileNumBox.y = GC.H - 160;
        this._mobileNumBox.setPlaceHolder("请输入用户名");
        this._mobileNumBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._mobileNumBox.setPlaceholderFontSize(30);
        this._mobileNumBox.setDelegate(this);
        this._mobileNumBox.setName("mobileNumBox");
        this._mobileNumBox.setFontSize(28);
        this.addChild(this._mobileNumBox);

        var line2 = new cc.Sprite(res.png_btn_enter_wode);
        line2.setNormalizedPosition(0.5, 0.78);
        this.addChild(line2);
        this._bankBox = new cc.EditBox(cc.size(380, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._bankBox.x = GC.W / 2-100;
        this._bankBox.y = this._mobileNumBox.y - this._mobileNumBox.height-60;
        this._bankBox.setPlaceHolder("请输入绑定的银行卡账号");
        this._bankBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._bankBox.setPlaceholderFontSize(30);
        this._bankBox.setDelegate(this);
        this._bankBox.setName("bankBox");
        this._bankBox.setFontSize(28);
        this.addChild(this._bankBox);

        var line3 = new cc.Sprite(res.png_btn_enter_wode);
        line3.setNormalizedPosition(0.5, 0.7);
        this.addChild(line3);
        this._zijingBox = new cc.EditBox(cc.size(380, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._zijingBox.x = GC.W / 2-100;
        this._zijingBox.y = this._bankBox.y - this._bankBox.height-60;
        this._zijingBox.setPlaceHolder("请输入资金密码");
        this._zijingBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._zijingBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._zijingBox.setPlaceholderFontSize(30);
        this._zijingBox.setDelegate(this);
        this._zijingBox.setName("zijingBox");
        this._zijingBox.setFontSize(28);
        this.addChild(this._zijingBox);

        var line3 = new cc.Sprite(res.png_btn_enter_wode);
        line3.setNormalizedPosition(0.5, 0.615);
        this.addChild(line3);
        this._xinPasswordBox = new cc.EditBox(cc.size(380, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._xinPasswordBox.x = GC.W / 2-100;
        this._xinPasswordBox.y = this._zijingBox.y - this._zijingBox.height-60;
        this._xinPasswordBox.setPlaceHolder("请输入新密码");
        this._xinPasswordBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._xinPasswordBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._xinPasswordBox.setPlaceholderFontSize(30);
        this._xinPasswordBox.setDelegate(this);
        this._xinPasswordBox.setMaxLength(18);
        this._xinPasswordBox.setName("xinPasswordBox");
        this._xinPasswordBox.setFontSize(28);
        this.addChild(this._xinPasswordBox);

        var line4 = new cc.Sprite(res.png_btn_enter_wode);
        line4.setNormalizedPosition(0.5, 0.535);
        this.addChild(line4);
        this._querenPasswordBox = new cc.EditBox(cc.size(380, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._querenPasswordBox.x = GC.W / 2-100;
        this._querenPasswordBox.y = this._xinPasswordBox.y - this._xinPasswordBox.height-60;
        this._querenPasswordBox.setPlaceHolder("请输入确认新密码");
        this._querenPasswordBox.setMaxLength(18);
        this._querenPasswordBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._querenPasswordBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._querenPasswordBox.setPlaceholderFontSize(30);
        this._querenPasswordBox.setDelegate(this);
        this._querenPasswordBox.setName("querenPasswordBox");
        this._querenPasswordBox.setFontSize(28);
        this.addChild(this._querenPasswordBox);

        var tishi = new cc.LabelTTF("验证账号对于的银行主卡、资金密码,主卡才能修改"+"\n"+"以上消息不明确,请联系客服","微软雅黑", 25);
        tishi.x = GC.W / 2;
        tishi.y = this._querenPasswordBox.y - this._querenPasswordBox.height - 60;
        tishi.setColor(cc.color(255,255,0,0));
        this.addChild(tishi);

        // var getCodeBtn = new ccui.Button(res.png_btn_getcode_btn);
        // getCodeBtn.setTitleText("发送");
        // getCodeBtn.setTitleFontSize(30);
        // getCodeBtn.setNormalizedPosition(0.8, 0.812);
        // this.addChild(getCodeBtn);
        // getCodeBtn.addClickEventListener(function () {
        //     if(self._mobileNumBox.getString() != null)
        //     {
        //         var reqUrl = GC.URL +"user/getVerifyCode?"
        //             + "user_name=" + self._mobileNumBox.getString()
        //             + "&type=email"
        //             + "&client_id="+GC.CLIENT_ID
        //             + "&token="+GC.TOKEN;
        //         th.Http.inst().get(reqUrl,function (isSuccess, data) {
        //             if(isSuccess && data.code == "200")
        //             {
        //                 cc.log(data)
        //             }else
        //             {
        //                 var chenggong=new th.PopupLayer(data.message,"确定",function(){
        //                 });
        //                 self.addChild(chenggong);
        //             }
        //         })
        //     }
        // })


        var registerBtn = new ccui.Button(res.png_btn_mobilelogin);
        registerBtn.setNormalizedPosition(0.5, 0.35);
        registerBtn.setTitleText("确定");
        registerBtn.setTitleFontSize(30);
        registerBtn.setPressedActionEnabled(true);
        this.addChild(registerBtn);
        registerBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(self._mobileNumBox.getString() != ""&&
                self._bankBox.getString() != ""&&
                self._zijingBox.getString() != ""&&
                self._querenPasswordBox.getString() != ""&&
                self._xinPasswordBox.getString() != "")
            {
                var reqUrl = GC.URL + "user/forgetPasswordByBank?"
                    + "user_name=" + self._mobileNumBox.getString()
                    + "&account_number="+self._bankBox.getString()
                    + "&pay_password="+self._zijingBox.getString()
                    + "&password="+self._xinPasswordBox.getString()
                    + "&repassword="+self._querenPasswordBox.getString()
                    + "&token="+GC.TOKEN
                    + "&client_id="+GC.CLIENT_ID;
                th.Http.inst().get(encodeURI(reqUrl),function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                            cc.director.runScene(new LoginScene());
                        });
                        self.addChild(chenggong);
                    }else
                    {
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                        });
                        self.addChild(chenggong);
                    }
                })
            }else
            {

            }
        });

        return true;
    },
    editBoxEditingDidEnd: function (editBox) {
        switch(editBox.getName())
        {
            case"mobileNumBox":
                var patrn=/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()))
                {

                }else
                {
                    var alertStr = new th.AlertLayer(G_EMAILGETCODELAYER,res.png_img_tishikuang,"请输入正确的用户名");
                    // G_EMAILGETCODELAYER._mobileNumBox.setString("");
                }
                break;
            case"bankBox":
                var patrn=/^[0-9]+$/;
                if(patrn.test(editBox.getString()))
                {

                }else
                {
                    var alertStr = new th.AlertLayer(G_EMAILGETCODELAYER,res.png_img_tishikuang,"请输入正确的银行卡账号");
                    // G_EMAILGETCODELAYER._bankBox.setString("");
                }
                break;
            case"zijingBox":
                var patrn=/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()) && String(editBox.getString()).length >= 8)
                {

                }else
                {
                    var alertStr = new th.AlertLayer(G_EMAILGETCODELAYER,res.png_img_tishikuang,"请输入正确资金密码");
                    // G_EMAILGETCODELAYER._zijingBox.setString("");
                }
                break;
            case"xinPasswordBox":
                var patrn=/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()) && String(editBox.getString()).length >= 8)
                {

                }else
                {
                    var alertStr = new th.AlertLayer(G_EMAILGETCODELAYER,res.png_img_tishikuang,"密码长度最小为8");
                    // G_EMAILGETCODELAYER._xinPasswordBox.setString("");
                }
                break;
            case"querenPasswordBox":
                var patrn=/^[\u4E00-\u9FA5A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()))
                {

                }else
                {
                    var alertStr = new th.AlertLayer(G_EMAILGETCODELAYER,res.png_img_tishikuang,"两次密码不一致");
                    // G_EMAILGETCODELAYER._querenPasswordBox.setString("");
                }
                break;
        }
    }

});

