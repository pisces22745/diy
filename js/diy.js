(function ($) {
    var Diy = function (config) {
        var _this = this;
        this.count = 0;
        this.moveImg(); //使图片可点击
        $('.toolbar img').on('click', function (e) { //添加图片到编辑区
            e.preventDefault();
            var src = $(this).attr('src')
            _this.addImgToDiy(src)
        })
        $('body').delegate('.tl', 'mousedown', function (e) {
            e.preventDefault();
            var $zc = $(this).parent(),
                data_id = $zc.attr('data-id'),
                startStatus = {
                    left: $zc.position().left,
                    top: $zc.position().top,
                    width: $zc.width(),
                    height: $zc.height(),
                    x: e.pageX,
                    y: e.pageY
                }
            $('body').on('mousemove', function (e) {
                e.preventDefault();
                _this.scale(0, data_id, startStatus, e);
            })
        }).delegate('.tr', 'mousedown', function (e) {
            e.preventDefault();
            var $zc = $(this).parent(),
                data_id = $zc.attr('data-id'),
                startStatus = {
                    left: $zc.position().left,
                    top: $zc.position().top,
                    width: $zc.width(),
                    height: $zc.height(),
                    x: e.pageX,
                    y: e.pageY
                }
            $('body').on('mousemove', function (e) {
                e.preventDefault();
                _this.scale(1, data_id, startStatus, e);
            })
        }).delegate('.bl', 'mousedown', function (e) {
            e.preventDefault();
            var $zc = $(this).parent(),
                data_id = $zc.attr('data-id'),
                startStatus = {
                    left: $zc.position().left,
                    top: $zc.position().top,
                    width: $zc.width(),
                    height: $zc.height(),
                    x: e.pageX,
                    y: e.pageY
                }
            $('body').on('mousemove', function (e) {
                e.preventDefault();
                _this.scale(2, data_id, startStatus, e);
            })
        }).delegate('.br', 'mousedown', function (e) {
            e.preventDefault();
            var $zc = $(this).parent(),
                data_id = $zc.attr('data-id'),
                startStatus = {
                    left: $zc.position().left,
                    top: $zc.position().top,
                    width: $zc.width(),
                    height: $zc.height(),
                    x: e.pageX,
                    y: e.pageY
                }
            $('body').on('mousemove', function (e) {
                e.preventDefault();
                _this.scale(3, data_id, startStatus, e);
            })
        }).delegate('.rotate', 'mousedown', function (e) {
            e.stopPropagation()
            var $zc = $(this).parent(),
                data_id = $zc.attr('data-id');
            $('body').on('mousemove', function (e) {
                e.preventDefault();
                _this.rotate(this,data_id);
            })
        }).on('mouseup', function (e) {
            e.preventDefault();
            $('body').off('mousemove')
        })
    }
    Diy.prototype = {
        init: function (img) {
            this.resetImgSize(img);
        },
        resetImgSize: function (img) {
            var className = $(img).attr('data-id')
            $(img).width($(img).parent().width())
            $('.zc[data-id=' + className + ']').width($(img).width()).height($(img).height())
        },
        moveImg: function () {
            var _this = this;
            $('body').delegate('.zc', 'mousedown', function (e) {
                e.preventDefault();
                var data_id = $(this).attr('data-id'),
                    startPoint = {
                        x: e.pageX,
                        y: e.pageY
                    },
                    leftStart = $(this).position().left,
                    topStart = $(this).position().top;
                _this.activation(data_id)
                $(this).on('mousemove', function (e) {
                    e.preventDefault();
                    if ($(this).hasClass('active')) {
                        var currentPoint = {
                                x: e.pageX,
                                y: e.pageY
                            },
                            className = $(this).attr('data-id'),
                            leftCurrent = $(this).position().left,
                            topCurrent = $(this).position().top
                        $('.' + className).css({
                            left: (currentPoint.x - startPoint.x) + leftStart,
                            top: (currentPoint.y - startPoint.y) + topStart
                        })
                    }

                });
            }).on('mouseup', function (e) {
                e.preventDefault();
                $('.zc').off('mousemove')
            });
        },
        activation: function (data_id) {
            $('.zc').removeClass('active')
            $('.zc[data-id=' + data_id + ']').addClass('active');
        },
        rotate: function (that, data_id) {
            var div = $(that),
                centerX = div.width() / 2,
                centerY = div.height() / 2,
                left = div.position().left,
                top = div.position().top,
                pageX = event.pageX,
                pageY = event.pageY,
                dy = pageY - (top + centerY),
                dx = pageX - (left + centerX),
                angle = 180 / Math.PI * (Math.atan2(dy, dx) + Math.PI / 2);
            $('.' + data_id).css({
                transform: 'rotate(' + angle + 'deg)'
            })
        },
        scale: function (direction, data_id, startStatus, moveEvent) {
            $('.zc').off('mousemove')
            var distance = {
                    x: moveEvent.pageX - startStatus.x,
                    y: moveEvent.pageY - startStatus.y
                },
                $obj = $('.' + data_id)
            switch (direction) {
                case 0: //左上
                    $obj.css({
                        top: startStatus.top - (startStatus.height * (startStatus.width - distance.x) / startStatus.width - startStatus.height),
                        left: startStatus.left + distance.x,
                        width: startStatus.width - distance.x,
                        height: startStatus.height * (startStatus.width - distance.x) / startStatus.width
                    })
                    break;
                case 1: //右上
                    $obj.css({
                        top: startStatus.top - (startStatus.height * (startStatus.width + distance.x) / startStatus.width - startStatus.height),
                        width: startStatus.width + distance.x,
                        height: startStatus.height * (startStatus.width + distance.x) / startStatus.width
                    })
                    break;
                case 2: //左下
                    $obj.css({
                        left: startStatus.left - (startStatus.height * (startStatus.width - distance.x) / startStatus.width - startStatus.width),
                        width: startStatus.width - distance.x,
                        height: startStatus.height * (startStatus.width - distance.x) / startStatus.width
                    })
                    break;
                case 3: //右下
                    $obj.css({
                        width: startStatus.width + distance.x,
                        height: startStatus.height * (startStatus.width + distance.x) / startStatus.width
                    })
                    break;
            }
        },
        addImgToDiy: function (src) {
            $('.zc').removeClass('active')
            var _this = this,
                count = this.count++,
                img = $('<img src="' + src + '" class="layer' + count + '" data-id="layer' + count + '" />'),
                zc = '<div class="zc  active layer' + count + '" data-id="layer' + count + '">' +
                    '<div class="zc-handle tl"></div>' +
                    '<div class="zc-handle tr"></div>' +
                    '<div class="zc-handle bl"></div>' +
                    '<div class="zc-handle br"></div>' +
                    '<div class="zc-handle rotate"></div>' +
                    '</div>',
                $zc = $(zc);
            $('.diy-view').append(img)
            $('.diy-modify').append(zc)
            this.resetImgSize($(img))
        }
    }
    window.Diy = Diy
})(jQuery);