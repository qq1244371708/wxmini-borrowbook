const ajax = require('../../utils/request.js');

let _app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        qiniuDomain: '',
        bookList: [],
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

        this.setData({
            qiniuDomain:wx.getStorageSync('qiniuDomain')
        })



        this.getBookList();
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
    getBookList(pageNum = 1, pageSize = 10) {//pageNum pageSize

        ajax.myRequest({
            // url: `http://172.16.6.133:8080/resServer/bookLending/bookList`,
            url: `${_app.globalData.host}${_app.globalData.api.bookList}`,
            data: {
                pageNum,
                pageSize
            },
            success: res => {
                console.log('getBookList', res);

                if (res.data.status === 0) {

                    res.data.data.list.map(function (item, index) {
                        item.BOOK_IMG_KEY = `${item.BOOK_IMG_KEY}?imageView2/0/q/30`
                    });


                    this.setData({
                        bookList: this.data.bookList.concat(res.data.data.list),
                        lastPage: res.data.data.lastPage
                    });

                    this.data.pageNumber = res.data.data.pageNumber;
                    this.data.pageSize = res.data.data.pageSize;
                    this.data.totalRow = res.data.data.totalRow;

                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
                wx.hideLoading();
            },
            fial: err => {
                wx.showToast({
                    title: 'getBookList fail',
                    icon: 'none'
                })
            }
        });
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
            wx.showLoading({
                title: '正在加载~',
            });
            this.getBookList(this.data.pageNumber + 1, this.data.pageSize);
        }
    },
    goBorrowPage() {
        wx.navigateTo({
            url: '../borrow/borrow'
        })
    }


})
