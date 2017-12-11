var GameScene=cc.Scene.extend({
    _gameLayer:null,
    _roomId:null,
    ctor:function(groupType,gameType,gameLimit,roomData){
        this._super();
        this._roomId=roomData.room_id;
        //cc.log("Game:",groupType,gameType,gameLimit,roomData);
        switch (gameType){
            case 1:
                this._gameLayer=new PaiJiuLayer(groupType,gameType,gameLimit,roomData);
                this.addChild(this._gameLayer);
                break;
            case 2:
                this._gameLayer=new NiuNiuLayer(groupType,gameType,gameLimit,roomData);
                this.addChild(this._gameLayer);
                break;
            case 3:
                this._gameLayer=new SanGongLayer(groupType,gameType,gameLimit,roomData);
                this.addChild(this._gameLayer);
                break;
            case 4:
                this._gameLayer=new LongHuLayer(groupType,gameType,gameLimit,roomData);
                this.addChild(this._gameLayer);
                break;
            case 5:
                this._gameLayer=new DanZhangLayer(groupType,gameType,gameLimit,roomData);
                this.addChild(this._gameLayer);
                break;
            case 6:
                this._gameLayer=new LongHuLayer(groupType,gameType,gameLimit,roomData);
                this.addChild(this._gameLayer);
                break;
            case 7:
                this._gameLayer=new PaiJiuLayer(groupType,gameType,gameLimit,roomData);
                this.addChild(this._gameLayer);
                break;
            case 8:
                this._gameLayer=new NiuNiuLayer(groupType,gameType,gameLimit,roomData);
                this.addChild(this._gameLayer);
                break;
            case 9:
                this._gameLayer=new SanGongLayer(groupType,gameType,gameLimit,roomData);
                this.addChild(this._gameLayer);
                break;
            case 10:
                this._gameLayer=new LongHuLayer(groupType,gameType,gameLimit,roomData);
                this.addChild(this._gameLayer);
                break;
        }

        GC.ACTIVE_LAVYER=this._gameLayer;
    },
    onEnter:function(){
        this._super();
        var self = this;
        GC.ACTIVE_LAVYER=this._gameLayer;
        GC.ACTIVE_POS="GAME";
        cc.log("game scene onEnter");
        if(GC.IS_RECHARGE)
        {
            var recharge = new RechargeLayer(GC.RECHARGE,GC.RECHARGE_DATA._RECHARGENum);
            self.addChild(recharge);
        }
        /*
         var url=GC.URL+"room/index?client_id="+GC.CLIENT_ID+"&token="+GC.TOKEN+"&room_id="+this._roomId;
         th.Http.inst().get(url,function(success,json){
             if(success&&json.code==200){
                 var room=json.data;
                 cc.log("room init:",room);

             }else{
                 cc.log("get room info error");
                 var popup=th.PopupLayer.create("进入房间失败","确定",function(){
                     cc.director.runScene(new cc.TransitionFade(0.5,new LobbyScene()));
                 });
                 self.addChild(popup);
             }
         });
         */
    }
});


GameScene.create=function(groupType,gameType,gameLimit,roomData){
    return new GameScene(groupType,gameType,gameLimit,roomData);
};