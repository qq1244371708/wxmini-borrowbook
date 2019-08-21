const ajax = require('../../utils/request.js');

// pages/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.getSetting();


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

    bindGetUserInfo(e) {
        console.log('bindGetUserInfo', e.detail.userInfo);
        if (e.detail.userInfo) {

            wx.showLoading({
                title: '授权中'
            });

            wx.login({
                success(res) {
                    console.log('getLoginCode', res);

                    wx.showLoading({
                        title: '登录中'
                    });

                    ajax.myRequest({
                        url: 'https://testdatacenter.aiwanshu.com/resServer/bookLending/login',
                        data: {
                            code: res.code
                        },
                        success(val) {
                            wx.hideLoading();
                            console.log('bookLending login', val);
                            if (val.data.status === 0) {
                                wx.reLaunch({
                                    url: '../home/home'
                                })
                            } else {

                            }
                        },
                        fail(err) {
                            wx.hideLoading();
                            wx.showToast({
                                title: '登录失败',
                                icon: 'none'
                            })
                        }
                    })


                }
            })

        }

    },
    getSetting() {
        wx.getSetting({
            success(res) {
                console.log('getSetting', res.authSetting['scope.userInfo']);
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function (res) {
                            console.log(res.userInfo);
                            // wx.setStorage({key: 'userInfo', data: res.userInfo});
                            wx.reLaunch({
                                url: '../home/home'
                            })
                        }
                    })
                }
            },
            fail() {
            }
        })
    }
})
