/**
 * Created by lyf on 2017/6/28.
 *   龙虎
 */
var LongHuLayer=GameBaseLayer.extend({
    ctor:function (groupType,gameType,gameLimit,roomData) {
        this._super(groupType,gameType,gameLimit,roomData);


        var zhuomian = new cc.Sprite(res.png_img_zhuomian);
        zhuomian.setPosition(cc.p(GC.W/2,zhuomian.height / 2));
        this.addChild(zhuomian);

        this.initGameMenu();

        return true;
    },
    initGameMenu:function(){
        var danshuangBtn=cc.MenuItemImage.create( res.png_btn_longhuMenuBtn,res.png_btn_longhuMenuBtn_s,res.png_btn_longhuMenuBtn_s,function(){
            danshuangBtn.setEnabled(false);
            daxiaoBtn.setEnabled(true);
            longhuBtn.setEnabled(true);
        },this);
        danshuangBtn.setNormalizedPosition(cc.p(0.195,0.537));
        danshuangBtn.setEnabled(false);

        var daxiaoBtn=cc.MenuItemImage.create( res.png_btn_longhuMenuBtn,res.png_btn_longhuMenuBtn_s,res.png_btn_longhuMenuBtn_s,function(){
            danshuangBtn.setEnabled(true);
            daxiaoBtn.setEnabled(false);
            longhuBtn.setEnabled(true);
        },this);
        daxiaoBtn.setNormalizedPosition(cc.p(0.5,0.537));

        var longhuBtn=cc.MenuItemImage.create( res.png_btn_longhuMenuBtn,res.png_btn_longhuMenuBtn_s,res.png_btn_longhuMenuBtn_s,function(){
            danshuangBtn.setEnabled(true);
            daxiaoBtn.setEnabled(true);
            longhuBtn.setEnabled(false);
        },this);
        longhuBtn.setNormalizedPosition(cc.p(0.805,0.537));

        var danshuangText = new cc.LabelTTF("猜单双","微软雅黑", 20);
        danshuangText.setNormalizedPosition(0.5, 0.5);
        danshuangBtn.addChild(danshuangText);

        var daxiaoText = new cc.LabelTTF("猜大小","微软雅黑", 20);
        daxiaoText.setNormalizedPosition(0.5, 0.5);
        daxiaoBtn.addChild(daxiaoText);

        var longhuText = new cc.LabelTTF("龍虎","微软雅黑", 20);
        longhuText.setNormalizedPosition(0.5, 0.5);
        longhuBtn.addChild(longhuText);

        var _gameMenu=cc.Menu.create(danshuangBtn,daxiaoBtn,longhuBtn);
        _gameMenu.x=0;
        _gameMenu.y=0;
        this.addChild(_gameMenu);
    },
    setTotalBet:function (text) { // 刷新总额
        this._totalChipsText.setTitleText(text);
    },
    onEnter:function(){
        this._super();

        this.setPositionX(-GC.W);
        var moveTo=cc.moveTo(0.25,cc.p(0,this.getPositionY()));
        this.runAction(moveTo.easing(cc.easeExponentialOut()));
    },
    onExit:function(){
        this.removeFromParent();
        this._super();
    },
    onQuit:function () {
        var moveTo=cc.moveTo(0.25,cc.p(-GC.W,this.getPositionY()));
        this.runAction(moveTo.easing(cc.easeExponentialOut()));
    }
});