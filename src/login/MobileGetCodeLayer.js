/**
 * Created by lyf on 2017/6/24.
 * 手机获取验证码
 */
var MobileGetCodeLayer = LoginBaseLayer.extend({
    _mobileNumBox:null,
    _verificationCode:null,
    _self:null,
    ctor:function () {
        this._super();

        _self = this;
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
            _self.onQuit();
        });

        var line1 = new cc.Sprite(res.png_btn_enter_wode);
        line1.setNormalizedPosition(0.5, 0.86);
        this.addChild(line1);
        this._mobileNumBox = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._mobileNumBox.x = GC.W / 2;
        this._mobileNumBox.y = GC.H - 160;
        this._mobileNumBox.setPlaceHolder("请输入手机号码");
        this._mobileNumBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._mobileNumBox.setPlaceholderFontSize(30);
        this._mobileNumBox.setDelegate(this);
        this._mobileNumBox.setName("mobileNumBox");
        this._mobileNumBox.setFontSize(28);
        this.addChild(this._mobileNumBox);

        var line2 = new cc.Sprite(res.png_btn_enter_wode);
        line2.setNormalizedPosition(0.5, 0.78);
        this.addChild(line2);
        this._verificationCode = new cc.EditBox(cc.size(380, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._verificationCode.x = GC.W / 2-100;
        this._verificationCode.y = this._mobileNumBox.y - this._mobileNumBox.height-60;
        this._verificationCode.setPlaceHolder("请输入验证码");
        this._verificationCode.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._verificationCode.setPlaceholderFontSize(30);
        this._verificationCode.setDelegate(this);
        this._verificationCode.setMaxLength(6);
        this._verificationCode.setName("verificationCode");
        this._verificationCode.setFontSize(28);
        this.addChild(this._verificationCode);

        var getCodeBtn = new ccui.Button(res.png_btn_getcode_btn);
        getCodeBtn.setTitleText("发送");
        getCodeBtn.setTitleFontSize(30);
        getCodeBtn.setNormalizedPosition(0.8, 0.81);
        this.addChild(getCodeBtn);
        getCodeBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(_self._mobileNumBox.getString() != "")
            {
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
            }
        })

        var registerBtn = new ccui.Button(res.png_btn_mobilelogin);
        registerBtn.setNormalizedPosition(0.5, 0.35);
        registerBtn.setTitleText("确定");
        registerBtn.setTitleFontSize(30);
        registerBtn.setPressedActionEnabled(true);
        this.addChild(registerBtn);
        registerBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(_self._mobileNumBox.getString() != "" && _self._verificationCode.getString() != "")
            {
                var changepassword = new ChangePasswordLayer(_self._mobileNumBox.getString(),_self._verificationCode.getString());
                _self.addChild(changepassword);
            }else {
                var alertStr = new th.AlertLayer(_self,res.png_img_tishikuang,"手机号码和验证码不能为空");
                _self._mobileNumBox.setString("");
            }

        });

        return true;
    },
    editBoxEditingDidEnd: function (editBox) {
        switch(editBox.getName())
        {
            case"mobileNumBox":
                var patrn=/^[0-9]+$/;
                if(patrn.test(editBox.getString()))
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
        }
    }

});
