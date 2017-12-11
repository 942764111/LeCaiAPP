/**
 * Created by lyf on 2017/7/2.
 *
 * 在线用户列表
 */
var OnlineUsersListLayer = cc.Layer.extend({
    _userListData:null,
    _betListTableView:null,
    ctor:function (userListData) {
        this._super();
        this._layerColor=new cc.LayerColor(cc.color(0,0,0,255*0.5),GC.W,GC.H);
        this.addChild(this._layerColor);

        var self = this;

        this._userListData = userListData;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        var bg = new cc.Sprite(res.png_btn_userlistimg);
        bg.setPosition(cc.p(GC.W/2,GC.H / 2));
        this.addChild(bg);
        var bgHeadimg = new cc.Sprite(res.png_btn_userlisttop);
        bgHeadimg.setPosition(cc.p(bgHeadimg.width/2 + 8,bg.height - bgHeadimg.height / 2 - 8));
        bg.addChild(bgHeadimg);

        var bgBottomimg = new cc.Sprite(res.png_btn_userlistbottom);
        bgBottomimg.setPosition(cc.p(bgBottomimg.width/2 + 8,bgHeadimg.height / 2 - 20));
        bg.addChild(bgBottomimg);

        var closeBtn = new ccui.Button(res.png_btn_closeBtn);
        closeBtn.setNormalizedPosition(0.94, 1.1);
        bg.addChild(closeBtn);
        closeBtn.addClickEventListener(function () {
            cc.audioEngine.playEffect(res.mp3_click);
            self.close();
        })

        var userlistLable = new cc.LabelTTF("玩家列表","微软雅黑", 35);
        userlistLable.setNormalizedPosition(0.5, 0.92);
        bg.addChild(userlistLable);

        var currRoomPop= new cc.LabelTTF("当前房间人数:","微软雅黑", 30);
        currRoomPop.setNormalizedPosition(0.18, 0.83);
        currRoomPop.setColor(cc.color(179,176,162,0));
        bg.addChild(currRoomPop);

        var currRoomPopNum= new cc.LabelTTF(this._userListData.data.online_count,"微软雅黑", 30);
        currRoomPopNum.setNormalizedPosition(0.8, 0.83);
        currRoomPopNum.setColor(cc.color(179,176,162,0));
        bg.addChild(currRoomPopNum);

        this.initUserListView();

        return true;
    },
    initUserListView:function () {
        this._betListTableView = new cc.TableView(this, cc.size(680, 530));
        this._betListTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._betListTableView.setDelegate(this);
        this._betListTableView.setPosition(cc.p(38,330));
        this.addChild(this._betListTableView);
        this._betListTableView.reloadData();
    },
    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },
    tableCellTouched:function (table, cell) {

    },
    tableCellSizeForIndex:function (table, idx) {// 每一列宽高
        return cc.size(335, 25);
    },
    tableCellAtIndex:function (table, idx) {
        var self = this;
        var cell = table.dequeueCell();
        var bianhao;
        var nameTable;
        var index = this._userListData.data.roomUsers.length-1-idx;
        if (!cell) {
            cell = new cc.TableViewCell();

            bianhao = new cc.LabelTTF( index+""+ "","微软雅黑", 30);
            bianhao.setTag(1);
            bianhao.setAnchorPoint(0,0.5);
            bianhao.setColor(cc.color(42,190,174,0));
            cell.addChild(bianhao);

            if((index % 2) != 0)
            {
                bianhao.setPosition(cc.p(70,10));
            }else
            {
                bianhao.setPosition(cc.p(400,35));
            }
        }else
        {
            bianhao = cell.getChildByTag(1);
            bianhao.setString(this._userListData.data.roomUsers[index].num+" :  "+this._userListData.data.roomUsers[index].nickname);

            if((index % 2) == 0)
            {
                bianhao.setPosition(cc.p(70,10));
            }else
            {
                bianhao.setPosition(cc.p(400,35));
            }
        }
        return cell;
    },
    numberOfCellsInTableView:function (table) {
        return this._userListData.data.roomUsers.length;
    },
    onEnter:function(){
        this._super();

        this.setScale(0);
        var scaleTo = cc.scaleTo(0.25,1.0);
        this.runAction(scaleTo.easing(cc.easeBackOut()));
    },
    close:function(){
        //this._layerColor.runAction(cc.fadeOut(0.1));
        this.runAction(cc.sequence( cc.scaleTo(0.25,0).easing(cc.easeBackIn()),cc.callFunc(function(event){
            this.removeFromParent();
        },this)));
    }
});
