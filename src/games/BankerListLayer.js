/**
 * Created by lyf on 2017/7/4.
 *  上庄列表
 */
var BankerListLayer = cc.Layer.extend({
    _bankerListData:null,
    _betListTableView:null,
    _wuzhuangSprite:null,
    _paiduiLabel:null,
    _nicknameLabel:null,
    _amountLabel:null,
    ctor:function (bankerListData) {
        this._super();
        var self = this;

        this._bankerListData = bankerListData;

        var tableHeadSprite = new cc.Sprite(res.png_img_zhuangbgImg);
        tableHeadSprite.setNormalizedPosition(cc.p(0.16,0.762));
        this.addChild(tableHeadSprite);

        var shangzhuangLabel = new cc.LabelTTF("上庄列表","微软雅黑", 30);
        shangzhuangLabel.setNormalizedPosition(0.5, 0.94);
        tableHeadSprite.addChild(shangzhuangLabel);


        // 无上庄  则显示
        this._wuzhuangSprite = new cc.Sprite(res.png_img_wuzhuangImg);
        this._wuzhuangSprite.setNormalizedPosition(cc.p(0.16,0.76));
        this.addChild(this._wuzhuangSprite);
        this._wuzhuangSprite.setVisible(false);

        // 有上庄  则显示
        this._paiduiLabel = new cc.LabelTTF("排队","微软雅黑", 20);
        this._paiduiLabel.setNormalizedPosition(cc.p(0.14,0.85));
        tableHeadSprite.addChild(this._paiduiLabel);

        this._nicknameLabel = new cc.LabelTTF("昵称","微软雅黑", 20);
        this._nicknameLabel.setNormalizedPosition(cc.p(0.37,0.85));
        tableHeadSprite.addChild(this._nicknameLabel);

        this._amountLabel = new cc.LabelTTF("金额","微软雅黑", 20);
        this._amountLabel.setNormalizedPosition(cc.p(0.80,0.85));
        tableHeadSprite.addChild(this._amountLabel);


        this._paiduiLabel.setVisible(false);
        this._nicknameLabel.setVisible(false);
        this._amountLabel.setVisible(false);


        this.initUserListView();

        return true;
    },
    initUserListView:function () {
        this._betListTableView = new cc.TableView(this, cc.size(248, 255));
        this._betListTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._betListTableView.setDelegate(this);
        this._betListTableView.setPosition(cc.p(0,860));
        this.addChild(this._betListTableView);
    },
    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },
    tableCellTouched:function (table, cell) {

    },
    tableCellSizeForIndex:function (table, idx) {// 每一列宽高
        return cc.size(130, 30);
    },
    tableCellAtIndex:function (table, idx) {
        var self = this;
        var cell = table.dequeueCell();
        var paiduiLabel;
        var nameLabel;
        var amountLabel;
        var bankSprite;
        var index = this._bankerListData.waitHostList.length-1-idx;
        var data=this._bankerListData.waitHostList[index];
        var isBank=this._bankerListData.current_host==null?false:this._bankerListData.current_host.user_id==data.user_id?true:false;
        if (!cell) {
            cell = new cc.TableViewCell();

            bankSprite=new cc.Sprite(res.png_icon_bank);
            bankSprite.setPosition(cc.p(25,10));
            bankSprite.setTag(4);
            bankSprite.setVisible(isBank);
            bankSprite.setScale(0.6);
            cell.addChild(bankSprite);

            paiduiLabel = new cc.LabelTTF(data.key + "","Arial", 20);
            paiduiLabel.setTag(1);
            paiduiLabel.setPosition(cc.p(25,10));
            paiduiLabel.setColor(isBank?cc.color.YELLOW:cc.color.WHITE);
            paiduiLabel.setVisible(!isBank);
            cell.addChild(paiduiLabel);

            nameLabel = new cc.LabelTTF(data.nickname,"Arial", 20);
            nameLabel.setTag(2);
            nameLabel.setPosition(cc.p(90,10));
            nameLabel.setColor(isBank?cc.color.YELLOW:cc.color.WHITE);
            cell.addChild(nameLabel);

            amountLabel = new cc.LabelTTF(data.host_balance + "","Arial", 20);
            amountLabel.setTag(3);
            amountLabel.setPosition(cc.p(190,10));
            amountLabel.setColor(isBank?cc.color.YELLOW:cc.color.WHITE);
            cell.addChild(amountLabel);
        }else {

            bankSprite=cell.getChildByTag(4);
            bankSprite.setVisible(isBank);

            paiduiLabel = cell.getChildByTag(1);
            paiduiLabel.setString(data.key + "");
            paiduiLabel.setColor(isBank?cc.color.YELLOW:cc.color.WHITE);
            paiduiLabel.setVisible(!isBank);

            nameLabel = cell.getChildByTag(2);
            nameLabel.setString(data.nickname);
            nameLabel.setColor(isBank?cc.color.YELLOW:cc.color.WHITE);

            amountLabel = cell.getChildByTag(3);
            amountLabel.setString(data.host_balance + "");
            amountLabel.setColor(isBank?cc.color.YELLOW:cc.color.WHITE);

        }
        return cell;
    },
    numberOfCellsInTableView:function (table) {
        if(this._bankerListData&&this._bankerListData.waitHostList){
            return this._bankerListData.waitHostList.length;
        }else {
            return 0;
        }
    },
    updateBankerList:function(data){
        this._bankerListData=data;
        this._betListTableView.reloadData();
        if(this._bankerListData.waitHostList.length==0){
            this._paiduiLabel.setVisible(false);
            this._nicknameLabel.setVisible(false);
            this._amountLabel.setVisible(false);
        }else{
            this._paiduiLabel.setVisible(true);
            this._nicknameLabel.setVisible(true);
            this._amountLabel.setVisible(true);
        }
        // this._wuzhuangSprite.setVisible(this._bankerListData.current_host==null);
    }
});