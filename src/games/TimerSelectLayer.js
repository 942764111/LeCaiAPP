/**
 * Created by lyf on 2017/7/3.
 *
 * 上庄列表时间选择
 */
var TimerSelectLayer = cc.Layer.extend({
    _betListTableView:null,
    _shijianBg:null,
    _shijian:null,
    _callback:null,
    ctor:function (callback) {
        this._super();
        var self = this;
        this._callback = callback;

        this._shijianBg = new ccui.Button(res.png_img_bettingSJ_bg);
        this._shijianBg.setPosition(cc.p(343,430));
        this._shijianBg.setPressedActionEnabled(true);
        this._shijianBg.setZoomScale(0);
        this.addChild(this._shijianBg);

        this.initUserListView();
        this._betListTableView.reloadData();

        return true;
    },
    initUserListView:function () {
        this._betListTableView = new cc.TableView(this, cc.size(380, 430));
        this._betListTableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._betListTableView.setDelegate(this);
        this._betListTableView.setPosition(cc.p(0,0));
        this._shijianBg.addChild(this._betListTableView);
        this._betListTableView.reloadData();
    },
    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },
    tableCellTouched:function (table, cell) {
        // cc.log("*****",cell.getChildByTag(1).getName())
        // var event = new cc.EventCustom("TIMERLISTCLICK");
        // event.setUserData(cell.getChildByTag(1).getName()); // 参数
        // cc.eventManager.dispatchEvent(event);
        this._callback(cell.getChildByTag(1).getName());
    },
    tableCellSizeForIndex:function (table, idx) {// 每一列宽高
        return cc.size(190, 50);
    },
    tableCellAtIndex:function (table, idx) {
        var self = this;
        var dataLable = new Date(new Date().getTime()-(29-idx)*24*60*60*1000).format("yyyy-MM-dd");
        var cell = table.dequeueCell();
        var bianhao;
        if (!cell) {
            cell = new cc.TableViewCell();
            bianhao = new cc.LabelTTF(dataLable+"","微软雅黑", 35);
            bianhao.setTag(1);
            bianhao.setColor(cc.color(236,64,28,0));
            bianhao.setPosition(cc.p(180,25));
            bianhao.setName(dataLable);
            cell.addChild(bianhao);

            var sp = new cc.Sprite(res.png_img_gengduoBtn);
            sp.setPosition(cc.p(sp.width/2,40));
            cell.addChild(sp);
        }else
        {
            bianhao = cell.getChildByTag(1);
            bianhao.setString(dataLable);
            bianhao.setName(dataLable);
        }
        return cell;
    },
    numberOfCellsInTableView:function (table) {
        return 30;
    }
});
