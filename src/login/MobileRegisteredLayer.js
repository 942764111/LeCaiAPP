/**
 * Created by lyf on 2017/6/24.
 * 手机注册
 */
var MobileRegisteredLayer=LoginBaseLayer.extend({
    _mobileNumBox:null,
    _passwordBox:null,
    _passwordConfirmBox:null,
    _verificationCode:null,
    _securityCodeBox:null,
    _self:null,

    ctor:function () {
        this._super();

        _self = this;

        var bgSprite=cc.Sprite.create(res.png_bg_login);
        bgSprite.setPosition(cc.p(GC.W/2,GC.H/2));
        this.addChild(bgSprite);

        var mobileLoginStr = new cc.LabelTTF("手机注册","微软雅黑", 30);
        mobileLoginStr.setNormalizedPosition(0.5, 0.97);
        this.addChild(mobileLoginStr);

        var returnBtn = new ccui.Button(res.png_btn_backbai);
        returnBtn.setNormalizedPosition(0.07, 0.96);
        this.addChild(returnBtn);
        returnBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            _self.onQuit();
        });

        var line1 = new cc.Sprite(res.png_btn_enter_wode);
        line1.setNormalizedPosition(0.5, 0.87);
        this.addChild(line1);
        this._mobileNumBox = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._mobileNumBox.x = GC.W / 2;
        this._mobileNumBox.y = GC.H - 150;
        this._mobileNumBox.setName("mobileNumBox");
        this._mobileNumBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._mobileNumBox.setPlaceHolder("手机号码");
        this._mobileNumBox.setPlaceholderFontSize(30);
        this._mobileNumBox.setDelegate(this);
        this._mobileNumBox.setFontSize(30);
        this._mobileNumBox.setMaxLength(11);
        this.addChild(this._mobileNumBox);

        var line2 = new cc.Sprite(res.png_btn_enter_wode);
        line2.setNormalizedPosition(0.5, 0.78);
        this.addChild(line2);
        this._verificationCode = new cc.EditBox(cc.size(380, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._verificationCode.x = GC.W / 2-100;
        this._verificationCode.y = this._mobileNumBox.y - this._mobileNumBox.height - 60;
        this._verificationCode.setPlaceHolder("验证码");
        this._verificationCode.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._verificationCode.setName("verificationCode");
        this._verificationCode.setPlaceholderFontSize(30);
        this._verificationCode.setDelegate(this);
        this._verificationCode.setMaxLength(6);
        this._verificationCode.setFontSize(28);
        this.addChild(this._verificationCode);

        var getCodeBtn = new ccui.Button(res.png_btn_getcode_btn);
        getCodeBtn.setTitleText("获取");
        getCodeBtn.setTitleFontSize(30);
        getCodeBtn.setNormalizedPosition(0.8, 0.81);
        getCodeBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var reqUrl = GC.URL + "user/getVerifyCode?"
                + "user_name=" + _self._mobileNumBox.getString()
                + "&type=phone"
                + "&client_id="+GC.CLIENT_ID
                + "&token="+GC.TOKEN;
            th.Http.inst().get(reqUrl,function (isSuccess, data) {
                if(isSuccess && data.code == "200")
                {
                    cc.log(data)
                }else
                {
                    // cc.log(MessageCod[data.code]);
                    var chenggong=new th.PopupLayer(data.message,"确定",function(){
                    });
                    _self.addChild(chenggong);
                }
            })

        });
        this.addChild(getCodeBtn);

        var line3 = new cc.Sprite(res.png_btn_enter_wode);
        line3.setNormalizedPosition(0.5, 0.70);
        this.addChild(line3);
        this._passwordBox = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._passwordBox.x = GC.W / 2;
        this._passwordBox.y = this._verificationCode.y - this._verificationCode.height - 60;
        this._passwordBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordBox.setPlaceHolder("请输入密码(6-18位数字或字母)");
        this._passwordBox.setPlaceholderFontSize(30);
        this._passwordBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._passwordBox.setName("passwordBox");
        this._passwordBox.setDelegate(this);
        this._passwordBox.setMaxLength(18);
        this._passwordBox.setFontSize(28);
        this.addChild(this._passwordBox);

        var line4 = new cc.Sprite(res.png_btn_enter_wode);
        line4.setNormalizedPosition(0.5, 0.62);
        this.addChild(line4);
        this._passwordConfirmBox = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._passwordConfirmBox.x = GC.W / 2;
        this._passwordConfirmBox.y = this._passwordBox.y - this._passwordBox.height - 60;
        this._passwordConfirmBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordConfirmBox.setPlaceHolder("请再输入密码(6-18位数字或字母)");
        this._passwordConfirmBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._passwordConfirmBox.setPlaceholderFontSize(30);
        this._passwordConfirmBox.setDelegate(this);
        this._passwordConfirmBox.setName("passwordConfirmBox");
        this._passwordConfirmBox.setMaxLength(18);
        this._passwordConfirmBox.setFontSize(28);
        this.addChild(this._passwordConfirmBox);

        var line5 = new cc.Sprite(res.png_btn_enter_wode);
        line5.setNormalizedPosition(0.5, 0.54);
        this.addChild(line5);
        this._securityCodeBox = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._securityCodeBox.x = GC.W / 2;
        this._securityCodeBox.y = this._passwordConfirmBox.y - this._passwordConfirmBox.height - 58;
        this._securityCodeBox.setPlaceHolder("请输入邀请码");
        this._securityCodeBox.setPlaceholderFontSize(30);
        this._securityCodeBox.setName("securityCodeBox");
        this._securityCodeBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._securityCodeBox.setDelegate(this);
        this._securityCodeBox.setMaxLength(6);
        this._securityCodeBox.setFontSize(28);
        this.addChild(this._securityCodeBox);

        var registerBtn = new ccui.Button(res.png_btn_mobilelogin);
        registerBtn.setNormalizedPosition(0.5, 0.4);
        registerBtn.setTitleText("注册");
        registerBtn.setTitleFontSize(30);
        registerBtn.setPressedActionEnabled(true);
        registerBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if( _self._mobileNumBox.getString() != "" &&
                _self._verificationCode.getString() != "" &&
                _self._passwordBox.getString() != "" &&
                _self._passwordConfirmBox.getString() != "" &&
                _self._securityCodeBox.getString() != ""
            )
            {
                var reqUrl = GC.URL + "user/register?"
                    + "user_name=" + _self._mobileNumBox.getString()
                    + "&verify_code=" + _self._verificationCode.getString()
                    + "&password="+_self._passwordBox.getString()
                    + "&repassword="+_self._passwordConfirmBox.getString()
                    + "&invite_code=" + _self._securityCodeBox.getString()
                    + "&type=phone"
                    + "&client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                ;
cc.log("**********",reqUrl);
                th.Http.inst().get(reqUrl,function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        var chenggong=new th.PopupLayer("注册成功","确定",function(){
                            cc.director.runScene(new LoginScene());
                        });
                        _self.addChild(chenggong);
                    }else
                    {
                        var alertStr = new th.AlertLayer(_self,res.png_img_tishikuang,data.message);
                    }
                })
            }else {

                var alertStr = new th.AlertLayer(_self,res.png_img_tishikuang,"请输入正确信息");
            }
        });
        this.addChild(registerBtn);
        return true;
    },
    editBoxEditingDidEnd: function (editBox) {
        switch(editBox.getName())
        {
            case"mobileNumBox":
                var patrn=/^[0-9]+$/;
                if(patrn.test(editBox.getString()) && String(editBox.getString()).length == 11)
                {

                }else
                {
                    var alertStr = new th.AlertLayer(_self,res.png_img_tishikuang,"请输入正确的手机号码");
                    // _self._mobileNumBox.setString("");
                }
                break;
            case"verificationCode":
                var patrn=/^[0-9]+$/;
                if(patrn.test(editBox.getString()) && String(editBox.getString()).length == 6)
                {

                }else
                {
                    var alertStr = new th.AlertLayer(_self,res.png_img_tishikuang,"请输入正确的验证码");
                    // _self._verificationCode.setString("");
                }
                break;
            case"passwordBox":
                var patrn=/^[A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()) && String(editBox.getString()).length >= 6)
                {

                }else
                {
                    var alertStr = new th.AlertLayer(_self,res.png_img_tishikuang,"密码最少6位");
                    // _self._passwordBox.setString("");
                }
                break;
            case"passwordConfirmBox":
                var patrn=/^[A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()) && (_self._passwordBox.getString()) == editBox.getString())
                {
                }else
                {
                    var alertStr = new th.AlertLayer(_self,res.png_img_tishikuang,"两次机密码不一致，请重新输入");
                    // _self._passwordConfirmBox.setString("");
                }
                break;
            case"securityCodeBox":
                var patrn=/^[0-9]+$/;
                if(patrn.test(editBox.getString()) && String(editBox.getString()).length == 6)
                {

                }else
                {
                    var alertStr = new th.AlertLayer(_self,res.png_img_tishikuang,"请输入正确的安全码");
                    // _self._securityCodeBox.setString("");
                }
                break;

        }
    }

});

