/**
 * Created by tanhao on 2017/1/17.
 */

var BaseLayer = cc.Layer.extend({
    _beginPoint:null,
    _leftLayer:null,
    _rightLayer:null,
    _scrollLayerName:null,
    ctor: function () {
        this._super();

       /* this._leftLayer=new ChatLayer();
        this._leftLayer.setPositionX(-600);
        this.addChild(this._leftLayer);*/

        this._leftLayer=new NoticeLayer();
        this._leftLayer.setPositionX(-600);
        this.addChild(this._leftLayer);


        this._rightLayer=new DetailLayer();
        this._rightLayer.setPositionX(600);
        this.addChild(this._rightLayer);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

        return true;
    },
    onTouchBegan:function(touch, event){
        //cc.log("onTouchBegan");
        GC.LOBBY_BUTTON_TOUCH=true;
        var target = event.getCurrentTarget();
        target._beginPoint=touch.getLocation();
        return true;
    },
    onTouchMoved:function(touch, event){
        //cc.log("onTouchMoved111111");
        var target = event.getCurrentTarget();
        var touchPoint = touch.getLocation();
        var offset=touchPoint.x-target._beginPoint.x;
        if(GC.LOBBY_BUTTON_TOUCH&&Math.abs(offset)>1){
            GC.LOBBY_BUTTON_TOUCH=false;
        }
        if(target._scrollLayerName==null&&offset>0){
            target._scrollLayerName="left";
        }else if(target._scrollLayerName==null&&offset<0){
            target._scrollLayerName="right";
        }
        //cc.log("onTouchMoved",offset,target._scrollLayerName);
        if(offset>0&&target._scrollLayerName=="left"){
            target._leftLayer.setOffsetPositionX(offset);
        }else if(offset<0&&target._scrollLayerName=="right"){
            target._rightLayer.setOffsetPositionX(offset);
        }

    },
    onTouchEnded:function(touch, event){
        //cc.log("onTouchEnded");
        var target = event.getCurrentTarget();
        var touchPoint = touch.getLocation();
        var offset=touchPoint.x-target._beginPoint.x;
        if(target._scrollLayerName=="left"){
            target._leftLayer.touchDown(offset);
        }else{
            target._rightLayer.touchDown(offset);
        }
        target._scrollLayerName=null;

    },
    setDetail:function(loginName,nickName,balance,todayWinlose){
       this._rightLayer.setDetail(loginName,nickName,balance,todayWinlose);
    },
    setBalance:function(balance){
        this._rightLayer.setBalance(balance);
    }
});

BaseLayer.create=function(){
    return new BaseLayer();
};