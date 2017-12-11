/**
 * Created by lyf on 2017/7/24.
 * 修改用户名密码
 */
var ChangePasswordNameLayer = LoginBaseLayer.extend({
    ctor:function () {
        this._super();
        self = this;

        var bgSprite = cc.Sprite.create(res.png_bg_login);
        bgSprite.setPosition(cc.p(GC.W / 2, GC.H / 2));
        this.addChild(bgSprite);

        var mobileLoginStr = new cc.LabelTTF("修改密码","微软雅黑", 30);
        mobileLoginStr.setNormalizedPosition(0.5, 0.97);
        this.addChild(mobileLoginStr);

        var registerBtn = new ccui.Button(res.png_btn_mobilelogin);
        registerBtn.setNormalizedPosition(0.5, 0.35);
        registerBtn.setTitleText("确定");
        registerBtn.setTitleFontSize(30);
        registerBtn.setPressedActionEnabled(true);
        registerBtn.addClickEventListener(function () {

        });
        this.addChild(registerBtn);

        return true;
    }
});