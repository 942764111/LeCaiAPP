/**
 * Created by tanhao on 2017/1/17.
 */

var NoticeLayer = cc.Layer.extend({
    _listener:null,
    _chatListView:null,
    _msgBox:null,
    _posX:null,
    _endPosX:null,
    _offsetX:null,
    _beginPoint:null,
    _noticeWebView:null,
    ctor: function () {
        this._super();

        this._listener= cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        });
        this._listener.retain();

        var bgSprite=cc.Sprite.create(res.png_bg_chat);
        bgSprite.setPosition(cc.p(GC.W/2-80,GC.H/2));
        this.addChild(bgSprite);

       /* var noticeTtitleLabel = cc.LabelTTF.create("公告", "Arial", 30);
        noticeTtitleLabel.setNormalizedPosition(0.5, 0.5);
        bgSprite.addChild(noticeTtitleLabel);*/

        var loadingSprite=cc.Sprite.create(res.png_loading);
        loadingSprite.setNormalizedPosition(0.5, 0.5);
        loadingSprite.runAction(cc.rotateTo(0.8,720.0).repeatForever());
        bgSprite.addChild(loadingSprite);

        if((cc.sys.os===cc.sys.OS_ANDROID||cc.sys.os===cc.sys.OS_IOS)&&cc.sys.isNative) {
            this._noticeWebView = new ccui.WebView(); //"http://www.baidu.com"
            this._noticeWebView.setContentSize(600, 1334);
            //this._noticeWebView.setPosition(300 + 60, 1334 / 2 + 60);
            this._noticeWebView.setNormalizedPosition(0.5, 0.5);
            this._noticeWebView.setScalesPageToFit(true);
            this._noticeWebView.setVisible(false);
            bgSprite.addChild(this._noticeWebView, 1);
        }

        return true;
    },
    onEnter:function () {
        this._super();
        this._posX=this.getPositionX();

    },
    onExit:function(){
        this._listener.release();
        this._super();
    },
    setOffsetPositionX:function(x){
        if(Math.abs(x)<Math.abs(this._posX)){
            this._offsetX=x;
            this.setPositionX(this._posX+x);
        }
    },
    touchDown:function(x){
        var self=this;
        if(Math.abs(x)>Math.abs(this._posX)/3){
            var moveToAction = cc.moveTo(0.20,cc.p(0,this.getPositionY()));
            this.runAction(cc.sequence(moveToAction.easing(cc.easeSineIn()),cc.callFunc(function(event){
                this._endPosX=this.getPositionX();
            },this)));
            cc.eventManager.addListener(this._listener, this);
            if((cc.sys.os===cc.sys.OS_ANDROID||cc.sys.os===cc.sys.OS_IOS)&&cc.sys.isNative) {
                var url=GC.URL+"index/getAnnouncementUrl?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN;
                th.Http.inst().get(url,function(success,json){
                    if(success&&json.code==200){
                        var data=json.data;
                        self._noticeWebView.loadURL(data.announcement_url);
                        self._noticeWebView.setVisible(true);
                    }else{
                        cc.log("get user info error")
                    }
                });
            }
        }else{
            var moveToAction = cc.moveTo(0.20,cc.p(this._posX,this.getPositionY()));
            this.runAction(cc.sequence(moveToAction.easing(cc.easeSineIn()),cc.callFunc(function(event){
                this._endPosX=this.getPositionX();
            },this)));
        }

    },
    onTouchBegan:function(touch, event){
        var target = event.getCurrentTarget();
        target._beginPoint=touch.getLocation();
        return true;
    },
    onTouchMoved:function(touch, event){

        var target = event.getCurrentTarget();
        var touchPoint = touch.getLocation();
        var offset=touchPoint.x-target._beginPoint.x;
        if(offset<0){
            target.x=target._endPosX+offset;
        }else{
            target._beginPoint=touch.getLocation();
        }
    },
    onTouchEnded:function(touch, event){
        var target = event.getCurrentTarget();
        var touchPoint = touch.getLocation();
        var offset=touchPoint.x-target._beginPoint.x;
        if(offset!=0){
            if(Math.abs(offset)>Math.abs(target._posX/3)){
                var moveToAction = cc.moveTo(0.20,cc.p(target._posX,target.getPositionY()));
                target.runAction(cc.sequence(moveToAction.easing(cc.easeSineIn()),cc.callFunc(function(event){
                    target._endPosX=target.getPositionX();
                    cc.eventManager.removeListener(target._listener);
                },this)));

            }else{
                var moveToAction = cc.moveTo(0.20,cc.p(0,target.getPositionY()));
                target.runAction(cc.sequence(moveToAction.easing(cc.easeSineIn()),cc.callFunc(function(event){
                    target._endPosX=target.getPositionX();
                },this)));
            }
        }

    }
});

NoticeLayer.create=function(){
    return new NoticeLayer();
};