/**
 * Created by lyf on 2017/7/9.
 * 切换层
 */
var SwitchSprite=cc.Sprite.extend({
    _saicheData:null,// 赛车
    _saitingData:null,
    _shishicaiData:null,

    _saicheTimer:null,
    ctor: function (saicheData,shishicaiData,saitingData) {
        this._super(res.png_img_qiehuanbg);
        var self = this;
        this._saicheData = saicheData<0?0:saicheData;
        this._saitingData = saitingData<0?0:saitingData;
        this._shishicaiData = shishicaiData<0?0:shishicaiData;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan
        }, this);

        this.setPosition(cc.p(GC.W - 50,GC.H / 2 - 95));

        var closeBtn = new ccui.Button(res.png_img_qiehuanCloseBtn);
        closeBtn.setNormalizedPosition(0.5, 0.88);
        closeBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        });
        this.addChild(closeBtn);

        this._saiche = new CountDown(res.png_img_shaicheImg,this._saicheData);
        this._saiche.setNormalizedPosition(0.5, 0.74);
        this._saiche.addClickEventListener(this.btnCallback);
        this._saiche.setActionTag(1);
        this.addChild(this._saiche);

        this._shishicai = new CountDown(res.png_img_shishicaiImg,this._shishicaiData);
        this._shishicai.setNormalizedPosition(0.5, 0.55);
        this._shishicai.addClickEventListener(this.btnCallback);
        this._shishicai.setActionTag(2);
        this.addChild(this._shishicai);

        this._saiting = new CountDown(res.png_img_shaitingImg,this._saitingData);
        this._saiting.setNormalizedPosition(0.5, 0.36);
        this._saiting.addClickEventListener(this.btnCallback);
        this._saiting.setActionTag(3);
        this.addChild(this._saiting);

        var shuaxing = new ccui.Button(res.png_img_shuaxingBtn);
        shuaxing.setNormalizedPosition(0.5, 0.17);
        shuaxing.addClickEventListener(function(){
            cc.audioEngine.playEffect(res.mp3_click);
            var car=parseInt((GC.GAME_MAP["1"].lobbyEndTime-new Date().getTime())/1000);
            var ssc=parseInt((GC.GAME_MAP["2"].lobbyEndTime-new Date().getTime())/1000);
            var boat=parseInt((GC.GAME_MAP["3"].lobbyEndTime-new Date().getTime())/1000);

            self._saiche.setCountDown(car);
            self._shishicai.setCountDown(ssc);
            self._saiting.setCountDown(boat)

        });
        this.addChild(shuaxing);
    },
    onTouchBegan:function (touch, event) {
        var target = event.getCurrentTarget();
        if(!cc.rectContainsPoint(target.getBoundingBox(),touch.getLocation())){
            target.removeFromParent();

        }
        return true;
    },
    btnCallback:function(target){
        cc.audioEngine.playEffect(res.mp3_click);
        var self= target.getParent().getParent();
        var groupType=target.getActionTag();

        if(GC.GAME_MAP[groupType].status!=4){
            var roomLayer=new RoomLayer(groupType,"Room/switchRoomList",function(){

            });
            self.addChild(roomLayer,999);
            target.getParent().removeFromParent();
        }else{
            var popup=th.PopupLayer.create("正在休市，请稍后再来","确定",function(){

            });
            self.addChild(popup,999);
            target.getParent().removeFromParent();
        }



    },
    onEnter:function(){
        this._super();
        this.setScale(0);
        var scaleTo = cc.scaleTo(0.25,1.0);
        this.runAction(scaleTo.easing(cc.easeBackOut()));
    },
    close:function(){
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }
});
