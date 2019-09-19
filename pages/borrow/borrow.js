const ajax = require('../../utils/request.js');
const qiniuUploader = require("../../static/js/qiniuUploader.js");

let _app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        // show: false,
        tempFilePaths: '',
        qiniuToken: '',
        qiniuDomain: '',
        formData: {
            bookId: null,
            bookName: '',
            resourceImgUrl: '',
            score: 0
        },
        validCount: 999,
        dataList: null,
        btnDisabled: false,
        abc: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            qiniuDomain: wx.getStorageSync('qiniuDomain'),
            qiniuToken: wx.getStorageSync('qiniuToken')
        })

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
    change() {
        this.setData({
            show: !this.data.show
        })
    },

    openCamera: function () {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],// ['original', 'compressed'] 原片、压缩
            sourceType: ['camera'],//['album', 'camera'] 相册、相机
            success: res => {
                console.log('chooseImage', res);
                // this.setData({
                //     tempFilePaths: res.tempFilePaths[0],
                // });

                let tempFilePaths = res.tempFilePaths[0];
                this.uploadQiniu(tempFilePaths);
            },
            fail: err => {
                wx.showToast({
                    title: '选择照片失败',
                    image: '../../static/img/warn.svg',
                    icon: 'none'

                })
            }

        });
    },
    uploadQiniu(tempFilePath) {
        let _that = this;

        wx.showLoading({
            title: '上传中,请稍等~',
        });
        qiniuUploader.upload(tempFilePath, (res) => {
            wx.hideLoading();
            console.log('上传成功', res);
            // 每个文件上传成功后,处理相关的事情
            // 其中 info 是文件上传成功后，服务端返回的json，形式如
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            _that.setData({
                tempFilePaths: `${res.imageURL}`,
            });
            wx.showLoading({
                title: '正在匹配~',
            });
            this.goBookSearch(res.key);

        }, (error) => {
            console.log('error:', error);
        }, {
            uploadURL: 'https://up.qiniup.com',
            domain: _that.data.qiniuDomain, // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
            key: `mini-borrowbook-${new Date().getTime()}.${tempFilePath.split('.')[tempFilePath.split('.').length - 1]}`, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
            // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
            uptoken: _that.data.qiniuToken, // 由其他程序生成七牛 uptoken
            // uptokenURL: 'UpTokenURL.com/uptoken', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
            // uptokenFunc: function () {
            //     return '[yourTokenString]';
            // }
        }, (res) => {
            console.log('上传进度', res.progress)
            console.log('已经上传的数据长度', res.totalBytesSent)
            console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        }, () => {
            // 取消上传
        }, () => {
            // `before` 上传前执行的操作
        }, (err) => {
            // `complete` 上传接受后执行的操作(无论成功还是失败都执行)
        });
    },
    goBookSearch(imgKey) {//以图识图

        ajax.myRequest({
            // url: "http://172.16.6.133:8080/resServer/bookLending/bookSearch",
            url: `${_app.globalData.host}${_app.globalData.api.bookSearch}`,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            data: {
                imgKey: imgKey
            },
            success: res => {
                console.log(res);
                wx.hideLoading();

                if (res.data.status === 0) {

                    let dataParse = res.data.data;

                    let count = dataParse.length;

                    dataParse.map((temp) => {
                        temp.brief = JSON.parse(temp.brief);
                        temp.score = (temp.score * 100).toFixed(2);
                        if (temp.score < 50) {
                            count--;
                        }
                    });

                    this.setData({
                        dataList: res.data.data,
                        validCount: count

                    })

                }
            }
        })
    },
    confirmBorrowBook(e) {

        if (this.data.btnDisabled) {
            return false;
        }
        this.setData({
            btnDisabled: true
        });

        ajax.myRequest({
            // url: "http://172.16.6.133:8080/resServer/bookLending/lendBook",
            url: `${_app.globalData.host}${_app.globalData.api.lendBook}`,
            data: {
                bookId: e.currentTarget.dataset.bookId
            },
            success: res => {
                console.log(res);
                if (res.data.status === 0) {
                    wx.showToast({
                        title: '借书成功~',
                        duration: 1000
                    })
                    setTimeout(function () {
                        wx.reLaunch({
                            url: '../home/home'
                        })
                    }, 1000)
                } else if (res.data.status === 30001) {
                    wx.showToast({
                        title: '该书被借光喽，换一本吧~',
                        icon: 'none'
                    })
                } else {
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                wx.reLaunch({
                                    url: '../home/home'
                                })
                            }
                        }
                    })
                }
            }
        })
    }


})
