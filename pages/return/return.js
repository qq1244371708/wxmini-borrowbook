const ajax = require('../../utils/request.js');


// pages/return/return.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qiniuDomain: '',
        dataList: [],
        pageNumber: 1,
        totalRow: 0,
        pageSize: 10,
        lastPage: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '正在加载~',
        });
        this.getQniuDomain();
        this.getMyLendingBook();
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
        this.getMoreData();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    },
    getQniuDomain() {
        ajax.myRequest({
            url: "https://testdatacenter.aiwanshu.com/resServer/common/getImgDomain",
            success: res => {
                console.log('getImgDomain', res);
                this.setData({
                    qiniuDomain: res.data.data
                })
            },
            fial: err => {
                wx.showToast({
                    title: 'getQniuDomain fail'
                })
            }
        })
    },
    getMyLendingBook(pageNum = 1, pageSize = 10) {

        wx.showLoading({
            title: '正在加载~',
        });
        ajax.myRequest({
            url: "https://testdatacenter.aiwanshu.com/resServer/bookLending/myLendingBook",
            data: {
                pageNum,
                pageSize
            },
            success: res => {
                console.log(res);
                if (res.data.status === 0) {

                    let bookList = [];
                    if (res.data.data.pageNumber === 1) {
                        bookList = res.data.data.list;
                    } else {
                        bookList = this.data.dataList.concat(res.data.data.list);
                    }
                    console.log('bookList', bookList);
                    this.setData({
                        dataList: bookList,
                        pageNumber: res.data.data.pageNumber,
                        pageSize: res.data.data.pageSize,
                        totalRow: res.data.data.totalRow,
                        lastPage: res.data.data.lastPage
                    })
                } else {

                }
                wx.hideLoading();
            },
            fial: err => {
                wx.showToast({
                    title: 'getMyLendingBook fail',
                    icon: 'none'
                })
            }
        })
    },
    goReturnBook(e) {
        wx.navigateTo({
            url: `../returnBook/returnBook?lendingId=${e.currentTarget.dataset.lendingId}`,
            success() {
                console.log('前往还书界面...');
            }
        })
    },
    getMoreData() {
        let is_next;
        console.log(this.data.pageSize * this.data.pageNumber, this.data.totalRow);
        if (this.data.lastPage) {//总条数少于单个页面条数的时候，不再发起请求
            is_next = false;
            // wx.showToast({
            //     title: '我是有底线的',
            //     icon: 'none'
            // });
            return false;
        } else {
            is_next = true;
        }
        if (is_next) {
            this.getMyLendingBook(this.data.pageNumber + 1, this.data.pageSize);
        }
    }

});
