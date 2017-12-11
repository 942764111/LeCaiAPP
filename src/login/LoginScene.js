var LoginScene=cc.Scene.extend({
    _loginLayer:null,
    ctor:function(){
        this._super();
        cc.audioEngine.setEffectsVolume(1.0);
        cc.audioEngine.setMusicVolume(1.0);

        this._loginLayer= LoginLayer.create();
        this.addChild(this._loginLayer);



    },
    onEnter:function(){
        this._super();
        GC.ACTIVE_LAVYER=this._loginLayer;
        GC.ACTIVE_POS="LOGIN";
        if(!GC.SOCKET){
           GC.SOCKET=new WebScoketManager();
           GC.SOCKET.openConnect();
        }

    }
});