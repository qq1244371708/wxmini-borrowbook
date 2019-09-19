// pages/catalog/catalog.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        catalog: [
            {id:'catalog1',name: '语言类', checked: false},
            {id:'catalog1',name: '数学类', checked: true},
            {id:'catalog1',name: '百科类', checked: false},
            {id:'catalog1',name: '工艺书', checked: false},
            {id:'catalog1',name: '立体书', checked: false},
            {id:'catalog1',name: '玩书类', checked: false},
            {id:'catalog1',name: '工具书', checked: false}
        ],
        toView: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    checkedCata(e) {
        let catalogTemp = JSON.parse(JSON.stringify(this.data.catalog));

        catalogTemp = catalogTemp.map((item) => {
            if (item.name === e.currentTarget.dataset.cataName) {
                item.checked = true;
            } else {
                item.checked = false;
            }
            return item;
        });

        this.setData({
            catalog: catalogTemp,
            toView: e.currentTarget.dataset.cataName
        })
    }

})
