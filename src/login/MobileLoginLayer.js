/**
 * Created by lyf on 2017/6/24.
 * 手机登录
 */
var MobileLoginLayer=LoginBaseLayer.extend({
    // _self:null,
    _mobileNumBox:null,
    _passwordBox1:null,
    _passwordBox:null,
    ctor:function () {
        this._super();
        var self = this;
        var bgSprite=cc.Sprite.create(res.png_bg_login);
        bgSprite.setPosition(cc.p(GC.W/2,GC.H/2));
        this.addChild(bgSprite);

       /* var logo  = new cc.Sprite(res.png_img_logoimg);
        logo.setNormalizedPosition(0.5, 0.75);
        this.addChild(logo);*/

        var mobileLoginStr = new cc.LabelTTF("手机登录","微软雅黑", 30);
        mobileLoginStr.setNormalizedPosition(0.5, 0.96);
        this.addChild(mobileLoginStr);

        var returnBtn = new ccui.Button(res.png_btn_backbai);
        returnBtn.setNormalizedPosition(0.07, 0.96);
        this.addChild(returnBtn);
        returnBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.onQuit();
        });

        var line1 = new cc.Sprite(res.png_btn_enter_wode);
        line1.setNormalizedPosition(0.5, 0.5);
        this.addChild(line1);
        this._mobileNumBox = new cc.EditBox(cc.size(580, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._mobileNumBox.x = GC.W / 2;
        this._mobileNumBox.y = 700;
        this._mobileNumBox.setPlaceHolder("手机");
        this._mobileNumBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._mobileNumBox.setPlaceholderFontSize(30);
        this._mobileNumBox.setDelegate(this);
        this._mobileNumBox.setName("mobileNumBox");
        this._mobileNumBox.setFontSize(28);
        //this._mobileNumBox.setString("17097538912");
        this.addChild(this._mobileNumBox);

        var line2 = new cc.Sprite(res.png_btn_enter_wode);
        line2.setNormalizedPosition(0.5, 0.42);
        this.addChild(line2);
        this._passwordBox = new cc.EditBox(cc.size(380, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._passwordBox.x = GC.W / 2-100;
        this._passwordBox.y = 590;
        this._passwordBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._passwordBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._passwordBox.setPlaceHolder("密码");
        this._passwordBox.setPlaceholderFontSize(30);
        this._passwordBox.setDelegate(this);
        this._passwordBox.setName("passwordBox");
        this._passwordBox.setMaxLength(18);
        this._passwordBox.setFontSize(28);
        // this._passwordBox.setString("aa123456");
        this.addChild(this._passwordBox);

        this._passwordBox1 = new cc.EditBox(cc.size(380, 50), new cc.Scale9Sprite(res.png_bg_input));
        this._passwordBox1.x = GC.W / 2-100;
        this._passwordBox1.y = 590;
        this._passwordBox1.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
        this._passwordBox1.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);// 限制只能一行
        this._passwordBox1.setPlaceHolder("密码");
        this._passwordBox1.setPlaceholderFontSize(30);
        this._passwordBox1.setDelegate(this);
        this._passwordBox1.setName("passwordBox");
        this._passwordBox1.setMaxLength(18);
        this._passwordBox1.setFontSize(28);
        //_passwordBox1.setString("bb123456");
        this.addChild(this._passwordBox1);
        this._passwordBox1.setVisible(false);

        var registerBtn = new ccui.Button(res.png_btn_mobilelogin);
        registerBtn.setNormalizedPosition(0.5, 0.26);
        registerBtn.setTitleText("登录");
        registerBtn.setTitleFontSize(30);
        registerBtn.setPressedActionEnabled(true);
        registerBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(self._mobileNumBox.getString() != "" && self._passwordBox.getString() != "")
            {
                var reqUrl = GC.URL + "user/login?"
                    + "user_name=" + self._mobileNumBox.getString()
                    + "&password="+self._passwordBox.getString()
                    + "&client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                ;

                th.Http.inst().get(reqUrl,function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        GC.LOGIN_NAME=self._mobileNumBox.getString();
                        GC.PASSWORD=self._passwordBox.getString();

                        cc.sys.localStorage.setItem("LOGIN_NAME",GC.LOGIN_NAME);
                        // cc.sys.localStorage.setItem("PASSWORD",GC.PASSWORD);

                        cc.director.runScene(new cc.TransitionFade(0.5,new LobbyScene()));
                    }else
                    {

                        var chenggong=new th.PopupLayer(data.message,"确定",function(){
                        });
                        self.addChild(chenggong,999);
                    }
                })
            }
        });
        this.addChild(registerBtn);

        var eyeOperBtn = new ccui.Button(res.png_btn_eyesopen);
        eyeOperBtn.setNormalizedPosition(0.85, 0.45);
        this.addChild(eyeOperBtn);
        eyeOperBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self._passwordBox1.setString(self._passwordBox.getString());
            self._passwordBox1.visible = true;
            self._passwordBox.visible = false;
            eyeCloseBtn.visible = true;
            eyeOperBtn.visible = false;
        });

        var eyeCloseBtn = new ccui.Button(res.png_btn_eyeclose);
        eyeCloseBtn.setNormalizedPosition(0.85, 0.45);
        this.addChild(eyeCloseBtn);
        eyeCloseBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self._passwordBox.setString(self._passwordBox1.getString());
            self._passwordBox1.visible = false;
            self._passwordBox.visible = true;
            eyeCloseBtn.visible = false;
            eyeOperBtn.visible = true;
        });
        eyeCloseBtn.visible = false;

        var forgotPasswordBtn = new ccui.Button();
        forgotPasswordBtn.setNormalizedPosition(0.8, 0.39);
        forgotPasswordBtn.setTitleText("忘记密码");
        forgotPasswordBtn.setTitleFontSize(25);
        this.addChild(forgotPasswordBtn);
        forgotPasswordBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var mobileLayer = new MobileGetCodeLayer();
            self.getParent().addChild(mobileLayer);
        });

        return true;
    },
    onEnter:function(){
        this._super();
        var loginName=cc.sys.localStorage.getItem("LOGIN_NAME");
        //var password=cc.sys.localStorage.getItem("PASSWORD");
        if(loginName){  //&&password
            this._mobileNumBox.setString(loginName);
            //this._passwordBox.setString(password);
            //this._passwordBox1.setString(password);
        }
    }

});

LoginLayer.create=function(){
    return  new LoginLayer();
};