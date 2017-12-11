/**
 * Created by tanhao on 2017/1/17.
 */

var ChatLayer = cc.Layer.extend({
    _listener:null,
    _listenerChat:null,
    _chatListView:null,
    _msgBox:null,
    _posX:null,
    _endPosX:null,
    _offsetX:null,
    _beginPoint:null,
    _nullLayer:null,
    ctor: function () {
        this._super();

        this.initChatView();
        this.testMsg();

        this._nullLayer=new cc.Layer();
        this.addChild(this._nullLayer);

        this._listener= cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        });
        this._listener.retain();
        this._listenerChat= cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch,event){return true;},
            onTouchMoved: function(touch,event){},
            onTouchEnded: function(touch,event){}
        });
        this._listenerChat.retain();


        return true;
    },
    testMsg:function(){

        //消息名
        var nameText = new ccui.Text("TM第一：","Arial",30);
        nameText.setAnchorPoint(cc.p(0,1));
        nameText.setColor(cc.color(255,171,13));
        nameText.setName("nameText");
        nameText.ignoreContentAdaptWithSize(false);
        //cc.log("Fuck:",nameText.width);
        nameText.setContentSize(cc.size(nameText.width, 40));

        //消息体
        var msgText = new ccui.Text("一地在要工上是中国同和的有人我主产不为这民了发以经","Arial",30);
        msgText.setAnchorPoint(cc.p(0,1));
        msgText.setColor(cc.color(184,187,199));
        msgText.setName("nameText");
        msgText.ignoreContentAdaptWithSize(false);

        var row=parseInt(msgText.width/(this._chatListView.width-nameText.width))+(msgText.width%(this._chatListView.width-nameText.width)>0?1:0);
        msgText.setContentSize(cc.size(this._chatListView.width-nameText.width,row*40));


        var chatItem = new ccui.Layout();
        chatItem.setTouchEnabled(true);
        chatItem.setContentSize(msgText.getContentSize());
        chatItem.width = this._chatListView.width;


        nameText.y = chatItem.height;
        chatItem.addChild(nameText);

        msgText.x = nameText.width;
        msgText.y = chatItem.height;
        chatItem.addChild(msgText);

        // set model
        this._chatListView.setItemModel(chatItem);

        for(i = 0; i < 50; ++i) {
            var item = chatItem.clone();
            item.setTag(i);
            //var btn = item.getChildByName('textTest');
            //btn.setString("AAAAAAA"+i);
            this._chatListView.pushBackCustomItem(item);
        }
    },
    initChatView:function(){
        var bgSprite=cc.Sprite.create(res.png_bg_chat);
        bgSprite.setPosition(cc.p(GC.W/2-80,GC.H/2));
        this.addChild(bgSprite);

        var bgBottomSprite=cc.Sprite.create(res.png_bg_chat_bottom);
        bgBottomSprite.setNormalizedPosition(cc.p(0.495,0.08));
        bgSprite.addChild(bgBottomSprite);


        //消息输入框
        this._msgBox = new cc.EditBox(cc.size(384+60, 68), new cc.Scale9Sprite(res.png_bg_chat_input));
        this._msgBox.setPlaceholderFontColor(cc.color(184, 187, 198));
        this._msgBox.setPlaceHolder("点击这里聊天");
        this._msgBox.setPlaceholderFontSize(30);
        this._msgBox.setFontColor(cc.color(184, 187, 198));
        this._msgBox.setFontSize(30);
        this._msgBox.setPosition(cc.p(240,45));
        this._msgBox.setDelegate(this);
        this.addChild(this._msgBox);


        //发送按钮
        var sendBtn = new ccui.Button(res.png_btn_send,res.png_btn_send);
        sendBtn.setPosition(cc.p(530,45));
        //sendBtn.setTitleText("发送");
        //sendBtn.setTitleFontSize(24);
        sendBtn.setPressedActionEnabled(true);
        sendBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            cc.log("我的!");
        });
        this.addChild(sendBtn);


        //聊天记录
        this._chatListView = new ccui.ListView();
        this._chatListView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this._chatListView.setTouchEnabled(true);
        this._chatListView.setBounceEnabled(true);
        this._chatListView.setContentSize(cc.size(580, 1230));
        //this._chatListView.setBackGroundImage(res.png_btn_my);
        //this._chatListView.setBackGroundImageScale9Enabled(true);
        this._chatListView.setPosition(cc.p(10,100));
        this.addChild(this._chatListView);
    },
    onEnter:function () {
        this._super();
        this._posX=this.getPositionX();
    },
    onExit:function(){
        this._listener.release();
        this._listenerChat.release();
        this._super();
    },
    setOffsetPositionX:function(x){
        if(Math.abs(x)<Math.abs(this._posX)){
            this._offsetX=x;
            this.setPositionX(this._posX+x);
        }
    },
    touchDown:function(x){
        if(Math.abs(x)>Math.abs(this._posX)/3){
            var moveToAction = cc.moveTo(0.20,cc.p(0,this.getPositionY()));
            this.runAction(cc.sequence(moveToAction.easing(cc.easeSineIn()),cc.callFunc(function(event){
                this._endPosX=this.getPositionX();

            },this)));
            cc.eventManager.addListener(this._listenerChat, this);
            cc.eventManager.addListener(this._listener, this._nullLayer);
        }else{
            var moveToAction = cc.moveTo(0.20,cc.p(this._posX,this.getPositionY()));
            this.runAction(cc.sequence(moveToAction.easing(cc.easeSineIn()),cc.callFunc(function(event){
                this._endPosX=this.getPositionX();
            },this)));
        }

    },
    onTouchBegan:function(touch, event){
        var target = event.getCurrentTarget().getParent();
        target._beginPoint=touch.getLocation();
        return true;
    },
    onTouchMoved:function(touch, event){
        var target = event.getCurrentTarget().getParent();
        var touchPoint = touch.getLocation();
        var offset=touchPoint.x-target._beginPoint.x;
        if(offset<0){
            target.x=target._endPosX+offset;
        }else{
            target._beginPoint=touch.getLocation();
        }
    },
    onTouchEnded:function(touch, event){
        var target = event.getCurrentTarget().getParent();
        var touchPoint = touch.getLocation();
        var offset=touchPoint.x-target._beginPoint.x;
        if(offset!=0){
            if(Math.abs(offset)>Math.abs(target._posX/3)){
                var moveToAction = cc.moveTo(0.20,cc.p(target._posX,target.getPositionY()));
                target.runAction(cc.sequence(moveToAction.easing(cc.easeSineIn()),cc.callFunc(function(event){
                    target._endPosX=target.getPositionX();
                    cc.eventManager.removeListener(target._listener);
                    cc.eventManager.removeListener(target._listenerChat);
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

ChatLayer.create=function(){
    return new ChatLayer();
};