/**
 * Created by tanhao on 2017/1/17.
 * 登录
 */
var LoginLayer=cc.Layer.extend({
    _niuniuView:null,
    _mobileView:null,
    _emailView:null,
    ctor:function () {
        this._super();
        var bgSprite=cc.Sprite.create(res.png_bg_login);
        bgSprite.setPosition(cc.p(GC.W/2,GC.H/2));
        this.addChild(bgSprite);

        var self = this;

        /*
        var logo  = new cc.Sprite(res.png_img_logoimg);
        logo.setNormalizedPosition(0.5, 0.75);
        this.addChild(logo);
        */
        var loginBtn = new ccui.Button(res.png_btn_login,res.png_btn_login);
        loginBtn.setNormalizedPosition(0.5, 0.4);
        loginBtn.setTitleText("用户登录");
        loginBtn.setTitleFontSize(30);
        loginBtn.setZoomScale(0.03);
        loginBtn.setPressedActionEnabled(true);
        loginBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            this._emailView = new EmailLoginLayer();
            self.addChild(this._emailView);
        });
        this.addChild(loginBtn);


        var registerBtn = new ccui.Button(res.png_btn_register,res.png_btn_register);
        registerBtn.setNormalizedPosition(0.5, 0.3);
        registerBtn.setTitleText("手机号码登录");
        registerBtn.setTitleFontSize(30);
        registerBtn.setZoomScale(0.03);
        registerBtn.setPressedActionEnabled(true);
        registerBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            this._mobileView = new MobileLoginLayer();
            self.addChild(this._mobileView);
        });
        this.addChild(registerBtn);

        var quickLoginBtn = new ccui.Button();
        quickLoginBtn.setTitleText("快速登录");
        quickLoginBtn.setTitleFontSize(28);
        quickLoginBtn.setNormalizedPosition(0.5, 0.18);
        quickLoginBtn.setTitleColor(cc.color(255,255,0,0));
        this.addChild(quickLoginBtn);
        quickLoginBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
           // cc.log("快速登录,测试直接去大厅");
           cc.director.runScene(new cc.TransitionFade(0.5,new LobbyScene()));


          /* var trackLayer =new TrackLayer(1,function(result){
               cc.log("VVVVV:",result);
           });
           self.addChild(trackLayer);*/


           /* var gridRect = cc.rect(0, 0,GC.W,GC.H);
            var nodeGrid = new cc.NodeGrid();
            self.addChild(nodeGrid);

           var test=cc.Sprite.create(res.png_hai_bg);
           test.setNormalizedPosition(cc.p(0.5,0.5));
            nodeGrid.addChild(test);
           //bgSprite.setNormalizedPosition(cc.p(0.5,0.5));
            //gridNodeTarget.addChild(bgSprite);

           var action=cc.liquid( 3, cc.size(20,20), 4, 4);
            //var action =cc.waves( 3, cc.size(16,12), 4, 4, true, true);
            nodeGrid.runAction(action.repeatForever());*/


            //cc.audioEngine.playEffect(res.mp3_slot,true);
        });


        var registeredAccountBtn = new ccui.Button();
        registeredAccountBtn.setTitleText("注册账号");
        registeredAccountBtn.setTitleFontSize(25);
        registeredAccountBtn.setNormalizedPosition(0.75, 0.08);
        // registeredAccountBtn.setTitleColor(cc.color(255,255,0,0));
        this.addChild(registeredAccountBtn);
        registeredAccountBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            // cc.director.runScene(new cc.TransitionFade(0.5,new RegisteredLayer()));
            var registered = new RegisteredLayer();
            self.addChild(registered);
        });


        // var coinLabel = new cc.LabelBMFont("1234567890", res.fnt_no_num_big);
        // coinLabel.setNormalizedPosition(0.5,0.5);
        // this.addChild(coinLabel);

        return true;
    }
});

LoginLayer.create=function(){
    return  new LoginLayer();
};
