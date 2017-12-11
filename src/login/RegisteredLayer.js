/**
 * Created by lyf on 2017/6/24.
 * 注册
 */
var RegisteredLayer=LoginBaseLayer.extend({
    ctor:function () {
        this._super();

        var self = this;

        var bgSprite=cc.Sprite.create(res.png_bg_login);
        bgSprite.setPosition(cc.p(GC.W/2,GC.H/2));
        this.addChild(bgSprite);

       /* var logo  = new cc.Sprite(res.png_img_logoimg);
        logo.setNormalizedPosition(0.5, 0.8);
        this.addChild(logo);*/

        var returnBtn = new ccui.Button(res.png_btn_backbai);
        returnBtn.setNormalizedPosition(0.07, 0.96);
        this.addChild(returnBtn);
        returnBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.onQuit();
        });

        var loginBtn = new ccui.Button(res.png_btn_login,res.png_btn_login);
        loginBtn.setNormalizedPosition(0.5, 0.4);
        loginBtn.setTitleText("用户注册");
        loginBtn.setTitleFontSize(30);
        loginBtn.setZoomScale(0.03);
        loginBtn.setPressedActionEnabled(true);
        loginBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var emailregistered = new EmailRegisteredLayer();
            self.addChild(emailregistered);
        });
        this.addChild(loginBtn);


        var registerBtn = new ccui.Button(res.png_btn_register,res.png_btn_register);
        registerBtn.setNormalizedPosition(0.5, 0.3);
        registerBtn.setTitleText("手机注册");
        registerBtn.setTitleFontSize(30);
        registerBtn.setZoomScale(0.03);
        registerBtn.setPressedActionEnabled(true);
        registerBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            var mobileregistered = new MobileRegisteredLayer();
            self.addChild(mobileregistered);
        });
        this.addChild(registerBtn);

        return true;
    }


});

LoginLayer.create=function(){
    return  new LoginLayer();
};
