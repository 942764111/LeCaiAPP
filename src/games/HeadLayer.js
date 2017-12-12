/**
 * Created by lyf on 2017/6/24.
 * 头部
 */
var HeadLayer=cc.Layer.extend({
    _bgSprite:null,
    _roomNameLabel:null,
    _type:null,
    ctor:function (type) {
        this._super();
        var self = this;
        this._type = type;

        cc.spriteFrameCache.addSpriteFrames(res.plist_poker);
        cc.spriteFrameCache.addSpriteFrames(res.plist_majiang);
        cc.spriteFrameCache.addSpriteFrames(res.plist_niuniu);

        this._bgSprite=cc.Sprite.create(res.png_bg_game_top);
        this._bgSprite.setAnchorPoint(cc.p(0.5,1));
        this._bgSprite.setPosition(cc.p(GC.W/2,GC.H));
        this.addChild(this._bgSprite);


        //返回按钮
        var backBtn = new ccui.Button(res.png_btn_back,res.png_btn_back);
        backBtn.setNormalizedPosition(0.075, 0.6);
        backBtn.setPressedActionEnabled(true);
        backBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);

            var chenggong=new th.PopupLayer("您得资金将在本局结束后返还\n确定退出？","确定",function(){
                cc.director.runScene(new cc.TransitionFade(0.5,new LobbyScene()));
            },true);
            cc.director.getRunningScene().addChild(chenggong,999);


        });
        this._bgSprite.addChild(backBtn);

        //房间信息
        this._roomNameLabel= cc.LabelTTF.create("xx-xx-xx-xx", "Arial", 22);
        this._roomNameLabel.setNormalizedPosition(0.5, 0.8);
        this._bgSprite.addChild(this._roomNameLabel);

        //结果
        this._resultLabel=new cc.LabelBMFont("0000000000",res.fnt_no_num_big);
        this._resultLabel.setNormalizedPosition(0.5, 0.48);
        this._bgSprite.addChild(this._resultLabel);

        //静音按钮
        var soundCheckBox = new ccui.CheckBox();
        soundCheckBox.setNormalizedPosition(0.95, 0.8);
        soundCheckBox.setTouchEnabled(true);
        soundCheckBox.loadTextures(res.png_sound_on,res.png_sound_on,res.png_sound_off,res.png_sound_on,res.png_sound_on);
        soundCheckBox.addEventListener(function (sender, type) {
            switch (type) {
                case  ccui.CheckBox.EVENT_UNSELECTED:
                    cc.audioEngine.setMusicVolume(1);
                    cc.audioEngine.setEffectsVolume(1);
                    break;
                case ccui.CheckBox.EVENT_SELECTED:
                    cc.audioEngine.setMusicVolume(0);
                    cc.audioEngine.setEffectsVolume(0);
                    break;
                default:
                    break;
            }
        }, this);
        this._bgSprite.addChild(soundCheckBox);


        //开奖结果按钮
        var kaijiangjiluBtn = new ccui.Button(res.png_btn_kaijiangjilu,res.png_btn_kaijiangjilu);
        kaijiangjiluBtn.setNormalizedPosition(0.9, 0.42);
        kaijiangjiluBtn.setPressedActionEnabled(true);
        kaijiangjiluBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            kaijiangjiluBtn.setTouchEnabled(false);
            var reqUrl = GC.URL + "room/getRoomHelp?"
                + "client_id="+GC.CLIENT_ID
                + "&token="+GC.TOKEN;
            ;
            th.Http.inst().get(reqUrl,function (isSuccess, data) {
                kaijiangjiluBtn.setTouchEnabled(true);
                if(isSuccess && data.code == "200")
                {
                    cc.log(data);
                    var betlistview = new BetListLayer(data,self._type,1);
                    self.getParent().addChild(betlistview,99);
                }else
                {
                    var chenggong=new th.PopupLayer(data.message,"确定",function(){
                    });
                    self.addChild(chenggong);
                }
            })

        });
        this._bgSprite.addChild(kaijiangjiluBtn);

        //跑马灯
        this._marqueeText = cc.LabelTTF.create(GC.MARQUEE_TEXT, "Arial",20);
        this._marqueeText.setPositionX(GC.W/2+this._marqueeText.width/2);

        var stencil =cc.Sprite.create(res.png_bg_marquee);
        stencil.setColor(cc.color(0,0,0));
        var clip=new cc.ClippingNode(stencil);
        clip.setNormalizedPosition(0.5, 0.16);
        clip.setInverted(false);
        clip.setAlphaThreshold(0);
        clip.addChild(this._marqueeText);
        this._bgSprite.addChild(clip);

        this.marqueeRun();

        return true;
    },
    marqueeRun:function(){
        this._marqueeText.setPositionX(GC.W/2+this._marqueeText.width/2);
        this._marqueeText.runAction(cc.sequence(cc.moveTo(10, cc.p(-GC.W/2-this._marqueeText.width/2, 0)),cc.callFunc(function (event) {
            this.marqueeRun();
        }, this)));
    },
    setRoomName:function(text){
        this._roomNameLabel.setString(text);
    },
    setResult:function(result){
        this._resultLabel.setString(result.replace("10","A").split(",").join(""));
    },
    setMarquee:function(marquee){
        this._marqueeText.setString(marquee);
    }


});

HeadLayer.create=function(){
    return  new HeadLayer();
};

