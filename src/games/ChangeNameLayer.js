/**
 * Created by lyf on 2017/7/14.
 *  修改昵称
 */
var ChangeNameLayer=cc.Layer.extend({
    _mobileNumBox:null,
    _bool:null,
    _callback:null,
    ctor:function (bool,callback) {
        this._super();
        var self=this;
        this._bool = bool;
        this._callback=callback;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        var bgImg=cc.Sprite.create(res.png_bg_popup);
        bgImg.x=GC.W/2;
        bgImg.y=GC.H/2;
        this.addChild(bgImg);

        this._mobileNumBox = new cc.EditBox(cc.size(260, 80), new cc.Scale9Sprite(res.png_bg_chat_input));
        this._mobileNumBox.x = GC.W / 2;
        this._mobileNumBox.y = GC.H / 2 + 50;
        this._mobileNumBox.setName("mobileNumBox");
        this._mobileNumBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this._mobileNumBox.setPlaceHolder("请输入昵称");
        this._mobileNumBox.setPlaceholderFontSize(25);
        this._mobileNumBox.setDelegate(this);
        this._mobileNumBox.setFontSize(25);
        this._mobileNumBox.setMaxLength(8);
        this.addChild(this._mobileNumBox);

        var yesBtn = new ccui.Button(res.png_btn_confirm,res.png_btn_confirm);
        yesBtn.setNormalizedPosition(0.7, 0.42);
        yesBtn.setTitleText("确定");
        yesBtn.setTitleColor(cc.color(17,28,67));
        yesBtn.setTitleFontSize(30);
        yesBtn.setPressedActionEnabled(true);
        yesBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            if(self._mobileNumBox.getString() != "")
            {
                var reqUrl = GC.URL + "user/editNickname?"
                    + "nickname=" + self._mobileNumBox.getString()
                    + "&client_id="+GC.CLIENT_ID
                    + "&token="+GC.TOKEN;
                th.Http.inst().get(encodeURI(reqUrl),function (isSuccess, data) {
                    if(isSuccess && data.code == "200")
                    {
                        self._callback(self._mobileNumBox.getString());
                        var chenggong=new th.PopupLayer("设置成功","确定",function(){
                            self.close();
                        });
                        self.addChild(chenggong);
                    }else
                    {
                        var alertStr = new th.AlertLayer(self,res.png_img_tishikuang,data.message);
                    }
                })
            }else
            {
                var alertStr = new th.AlertLayer(self,res.png_img_tishikuang,"昵称不能为空");
            }

        });
        this.addChild(yesBtn);

        var noBtn = new ccui.Button(res.png_btn_cancel,res.png_btn_cancel);
        noBtn.setNormalizedPosition(0.3, 0.42);
        noBtn.setTitleText("取消");
        noBtn.setTitleColor(cc.color(17,28,67));
        noBtn.setTitleFontSize(30);
        noBtn.setPressedActionEnabled(true);
        noBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        });
        if(!self._bool)
        {
            noBtn.setVisible(false);
            yesBtn.setNormalizedPosition(0.5, 0.42);
        }
        this.addChild(noBtn);

        return true;
    },
    editBoxEditingDidEnd: function (editBox) {
        var self = this;
        switch(editBox.getName())
        {
            case"mobileNumBox":
                var patrn=/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
                if(patrn.test(editBox.getString()))
                {

                }else
                {
                    var alertStr = new th.AlertLayer(self,res.png_img_tishikuang,"请输入正确的昵称");
                    // self._mobileNumBox.setString("");
                }
                break;
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
