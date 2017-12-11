/**
 * Created by tanhao on 2017/1/17.
 */
var LobbyScene=cc.Scene.extend({
    _lobbyLayer:null,
    ctor:function () {
        this._super();

        //cc.audioEngine.setEffectsVolume(1.0);
        //cc.audioEngine.setMusicVolume(1.0);

        this._lobbyLayer= LobbyLayer.create();
        this.addChild(this._lobbyLayer);

        GC.ACTIVE_LAVYER=this._lobbyLayer;

    },
    onEnter:function(){
        this._super();
        GC.ACTIVE_LAVYER=this._lobbyLayer;
        GC.ACTIVE_POS="LOBBY";
        cc.log("lobby scene onEnter");
    },
    onExit:function(){
        cc.log("lobby scene onExit");
        this._super();
    }
});