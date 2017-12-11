/**
 * Created by lyf on 2017/6/24.
 * 修改密码
 */
var ChangePasswordLayer = LoginBaseLayer.extend({
    _mobileNumBox:null,
    _verificationCode:null,
    _user_name:null,
    _verify_code:null,
    ctor:function (user_name,verify_code) {
        this._super();
        self = this;
        this._user_name = user_name;
        this._verify_code = verify_code;

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
        this._mobileNumBox.setPlaceHolder("请输入密码");
        this._mobileNumBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._mobileNumBox.setPlaceholderFontSize(30);
        this._mobileNumBox.setDelegate(this);
        this._mobileNumBox.setMaxLength(18);
        this._mobileNumBox.setName("mobileNumBox");
        this._mobileNumBox.setFontSize(28);
        this.addChild(this._mobileNumBox);

        var line2 = new cc.Sprite(res.png_btn_enter_wode);
        line2.setNormalizedPosition(0.5, 0.78);
        this.addChild(line2);
        this._verificationCode = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._verificationCode.x = GC.W / 2;
        this._verificationCode.y = this._mobileNumBox.y - this._mobileNumBox.height - 60;
        this._verificationCode.setPlaceHolder("请输入密码");
        this._verificationCode.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._verificationCode.setPlaceholderFontSize(30);
        this._verificationCode.setDelegate(this);
        this._verificationCode.setMaxLength(18);
        this._verificationCode.setName("verificationCode");
        this._verificationCode.setFontSize(28);
        this.addChild(this._verificationCode);

        var registerBtn = new ccui.Button(res.png_btn_mobilelogin);
        registerBtn.setNormalizedPosition(0.5, 0.35);
        registerBtn.setTitleText("确定");
        registerBtn.setTitleFontSize(30);
        registerBtn.setPressedActionEnabled(true);
        registerBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(self._mobileNumBox.getString() != "" && self._verificationCode.getString() != "")
            {
                var reqUrl = GC.URL + "user/forgetPassword?"
                    + "user_name=" + self._user_name
                    + "&verify_code="+self._verify_code
                    + "&password="+self._mobileNumBox.getString()
                    + "&repassword="+self._verificationCode.getString()
                    + "&client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                cc.log("user_name",self._user_name)
                cc.log("password",self._mobileNumBox.getString())
                cc.log("repassword",self._verificationCode.getString())
                cc.log("client_id",GC.CLIENT_ID)
                cc.log("token",GC.TOKEN)
                th.Http.inst().get(reqUrl,function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        var chenggong=new th.PopupLayer("修改密码成功","确定",function(){
                            cc.director.runScene(new LoginScene());
                        });
                        self.addChild(chenggong);
                    }else
                    {
                        // cc.log(MessageCod[data.code]);
                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                        });
                        self.addChild(chenggong);
                    }
                })
            }else
            {
                var alertStr = new th.AlertLayer(self,res.png_img_tishikuang,"请输入密码和确认密码");
            }
        });
        this.addChild(registerBtn);

        return true;
    },
    editBoxEditingDidEnd: function (editBox) {
        switch(editBox.getName())
        {
            case"mobileNumBox":
                var patrn=/^[A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()) && String(editBox.getString()).length >= 6)
                {

                }else
                {
                    var alertStr = new th.AlertLayer(self,res.png_img_tishikuang,"密码最少6位");
                    // self._mobileNumBox.setString("");
                }
                break;
            case"verificationCode":
                var patrn=/^[A-Za-z0-9]+$/;
                if(patrn.test(editBox.getString()) && (self._mobileNumBox.getString()) == editBox.getString())
                {
                    cc.log("两次密码一样");
                }else
                {
                    var alertStr = new th.AlertLayer(self,res.png_img_tishikuang,"两次机密码不一致，请重新输入");
                    // self._verificationCode.setString("");
                }
                break;
        }
    }

});