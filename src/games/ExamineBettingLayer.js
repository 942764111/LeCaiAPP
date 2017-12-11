/**
 * Created by lyf on 2017/7/5.
 *
 *  查看下注点详情
 */
var ExamineBettingLayer = cc.Layer.extend({
    _betListData:null,
    _betListTableView:null,
    ctor:function (betListData) {
        this._super();
        this._layerColor=new cc.LayerColor(cc.color(0,0,0,255*0.5),GC.W,GC.H);
        this.addChild(this._layerColor);

        var self = this;

        this._betListData = betListData;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true}
        }, this);

        var bg = new cc.Sprite(res.png_btn_userlistimg);
        bg.setPosition(cc.p(GC.W/2,GC.H / 2));
        this.addChild(bg);
        var bgHeadimg = new cc.Sprite(res.png_img_xiangqingHead);
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

        var nameTable= new cc.LabelTTF("昵称:","微软雅黑", 30);
        nameTable.setNormalizedPosition(0.15, 0.93);
        nameTable.setColor(cc.color(179,176,162,0));
        bg.addChild(nameTable);

        var balanceTable= new cc.LabelTTF("金额","微软雅黑", 30);
        balanceTable.setNormalizedPosition(0.8, 0.93);
        balanceTable.setColor(cc.color(179,176,162,0));
        bg.addChild(balanceTable);

        this.initUserListView();

        return true;
    },
    initUserListView:function () {
        this._betListTableView = new cc.TableView(this, cc.size(680, 530));
        this._betListTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._betListTableView.setDelegate(this);
        this._betListTableView.setPosition(cc.p(38,360));
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
        return cc.size(335, 40);
    },
    tableCellAtIndex:function (table, idx) {
        var self = this;
        var cell = table.dequeueCell();
        var nameTable;
        var balanceTable;
        if (!cell) {
            cell = new cc.TableViewCell();

            nameTable = new cc.LabelTTF( this._betListData.data[idx].nickname + "","微软雅黑", 30);
            nameTable.setTag(1);
            nameTable.setPosition(cc.p(100,10));
            nameTable.setColor(cc.color(42,190,174,0));
            cell.addChild(nameTable);

            balanceTable = new cc.LabelTTF( this._betListData.data[idx].balance +"","微软雅黑", 30);
            balanceTable.setTag(2);
            balanceTable.setPosition(cc.p(530,10));
            balanceTable.setColor(cc.color(42,190,174,0));
            cell.addChild(balanceTable);
        }else
        {
            nameTable = cell.getChildByTag(1);
            nameTable.setString(this._betListData.data[idx].nickname + "");

            balanceTable = cell.getChildByTag(2);
            balanceTable.setString(this._betListData.data[idx].balance +"");
        }
        return cell;
    },
    numberOfCellsInTableView:function (table) {
        return this._betListData.data.length;
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
