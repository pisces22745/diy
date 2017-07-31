;
(function($) {
	var LightBox = function() {
		var self = this;
		//创建遮罩和弹出框
		this.popupMask = $('<div id="g-lightbox-mask">');
		this.popupWin = $('<div id="g-lightbox-popup">');
		//保存body
		this.bodyNode = $(document.body);
		//渲染剩余dom并且插入body
		this.renderDOM();

		//图片信息获取
		this.picViewArea = this.popupWin.find('.lightbox-pic-view');
		this.popupPic = this.popupWin.find('.lightbox-image');
		this.picCaptionArea = this.popupWin.find('.lightbox-pic-caption');
		this.nextBtn = this.popupWin.find('.lightbox-next-btn');
		this.prevBtn = this.popupWin.find('.lightbox-prev-btn');
		this.captionText = this.popupWin.find('.lightbox-pic-desc');
		this.currentIndex = this.popupWin.find('.lightbox-of-index');
		this.closeBtn = this.popupWin.find('.lightbox-close-btn');

		//开发事件委托，获取组数据
		this.groupName = null;
		this.groupData = []; //放置同一组数据
		this.bodyNode.delegate('.js-lightbox,*[data-role=lightbox]', 'click', function(e) {
			e.stopPropagation();
			var currentGroupName = $(this).attr('data-group');
			if(currentGroupName != self.groupName) {
				self.groupName = currentGroupName;
				//根据当前组名获取同一组数据
				self.getGroup();
			}
			//初始化弹框
			self.initPopup($(this));
		});
		this.popupMask.on('click', function(e) {
			e.preventDefault();
			self.clear = false;
			$(this).fadeOut();
			self.popupWin.fadeOut();
		});
		this.closeBtn.on('click', function(e) {
			e.preventDefault();
			self.clear = false;
			self.popupMask.fadeOut();
			self.popupWin.fadeOut();
		});
		this.flag = true;
		this.nextBtn.hover(function() {
			if(!$(this).hasClass('disable') && self.groupData.length > 1) {
				$(this).addClass('lightbox-next-btn-show');
			}
		}, function() {
			if(!$(this).hasClass('disable') && self.groupData.length > 1) {
				$(this).removeClass('lightbox-next-btn-show');
			}
		}).on('click', function(e) {
			e.preventDefault();
			if(!$(this).hasClass('disable') && self.flag) {
				self.flag = false;
				self.goto('next');
			}
		});
		this.prevBtn.hover(function() {
			if(!$(this).hasClass('disable') && self.groupData.length > 1) {
				$(this).addClass('lightbox-prev-btn-show');
			}
		}, function() {
			if(!$(this).hasClass('disable') && self.groupData.length > 1) {
				$(this).removeClass('lightbox-prev-btn-show');
			}
		}).on('click', function(e) {
			e.preventDefault();
			if(!$(this).hasClass('disable') && self.flag) {
				self.flag = false;
				self.goto('prev');
			}
		});
		var timer = null;
		this.clear = false;
		$(window).resize(function() {
			if(self.clear) {
				window.clearTimeout(timer);
				timer = window.setTimeout(function() {
					self.loadPicSize(self.groupData[self.index].src);
				}, 500);
			}
		});
	}
	LightBox.prototype = {
		goto: function(dir) {
			if(dir === 'next') {
				this.index++;
				if(this.index >= this.groupData.length - 1) {
					this.nextBtn.addClass('disable').removeClass('lightbox-next-btn-show');
				}
				if(this.index != 0) {
					this.prevBtn.removeClass('disable');
				}
				var src = this.groupData[this.index].src;
				this.loadPicSize(src);
			} else if(dir === 'prev') {
				this.index--;
				if(this.index <= 0) {
					this.prevBtn.addClass('disable').removeClass('lightbox-prev-btn-show');
				}
				if(this.index != this.groupData.length - 1) {
					this.nextBtn.removeClass('disable');
				}
				var src = this.groupData[this.index].src;
				this.loadPicSize(src);
			}
		},
		loadPicSize: function(sourceSrc) {
			var self = this;
			self.popupPic.css({
				'width': 'auto',
				'height': 'auto'
			}).hide();
			this.picCaptionArea.hide();
			this.preLoadImg(sourceSrc, function() {
				self.popupPic.attr('src', sourceSrc);
				var picWidth = self.popupPic.width(),
					picHeight = self.popupPic.height();
				self.changePic(picWidth, picHeight);
			});
		},
		changePic: function(width, height) {
			var self = this,
				winWidth = $(window).width(),
				winHeight = $(window).height();
			var scale = Math.min(winWidth / (width + 10), winHeight / (height + 10), 1);
			width = width * scale;
			height = height * scale;
			this.picViewArea.animate({
				'width': width - 10,
				'height': height - 10
			});
			this.popupWin.animate({
				'width': width,
				'height': height,
				'margin-left': -(width / 2),
				'top': (winHeight - height) / 2
			}, function() {
				self.popupPic.css({
					'width': width - 10,
					'height': height - 10,
				}).fadeIn();
				self.picCaptionArea.fadeIn();
				self.flag = true;
				self.clear = true;
			});
			this.captionText.text(this.groupData[this.index].caption);
			this.currentIndex.text('当前索引： ' + (this.index + 1) + 'of ' + this.groupData.length);
		},
		preLoadImg: function(src, callback) {
			var img = new Image();
			if(window.ActiveXObject) {
				img.onreadystatechange = function() {
					if(this.onreadystatechange == 'complete') {
						callback();
					}
				}
			} else {
				img.onload = function() {
					callback();
				}
			}
			img.src = src;
		},
		showMaskAndPopup: function(sourceSrc, currentId) {
			var self = this;

			this.popupPic.hide();
			this.picCaptionArea.hide();
			this.popupMask.fadeIn();

			var winWidth = $(window).width(),
				winHeight = $(window).height(),
				viewHeight = winHeight / 2 + 10;
			this.picViewArea.css({
				'width': winWidth / 2,
				'height': winHeight / 2
			});
			this.popupWin.fadeIn();
			this.popupWin.css({
				'width': winWidth / 2 + 10,
				'height': viewHeight,
				'margin-left': -(winWidth / 2 + 10) / 2,
				'top': -viewHeight
			}).animate({
				'top': (winHeight - viewHeight) / 2
			}, function() {
				//加载图片
				self.loadPicSize(sourceSrc);
			});
			//根据当前点击元素id获取在当前组别的索引
			this.index = this.getIndexOf(currentId);
			var groupDataLength = this.groupData.length;
			if(groupDataLength > 1) {
				if(this.index === 0) {
					this.prevBtn.addClass('disable');
					this.nextBtn.removeClass('disable');
				} else if(this.index === groupDataLength - 1) {
					this.nextBtn.addClass('disable');
					this.prevBtn.removeClass('disable');
				} else {
					this.nextBtn.removeClass('disable');
					this.prevBtn.removeClass('disable');
				}
			}
		},

		getIndexOf: function(currentId) {
			var index = 0;
			$(this.groupData).each(function(i) {
				index = i;
				if(this.id === currentId) {
					return false;
				}
			});
			return index;
		},
		initPopup: function(currentObj) {
			var self = this,
				sourceSrc = currentObj.attr('data-source'),
				currentId = currentObj.attr('data-id');
			this.showMaskAndPopup(sourceSrc, currentId);
		},
		getGroup: function() {
			var self = this;
			//根据当前组别名称获取同一组数据
			var groupList = this.bodyNode.find('*[data-group=' + this.groupName + ']');
			self.groupData.length = 0;
			groupList.each(function(index, value) {
				self.groupData.push({
					'src': $(this).attr('data-source'),
					'id': $(this).attr('data-id'),
					'caption': $(this).attr('data-caption')
				});
			});
		},
		renderDOM: function() {
			var strDom = '<div class="lightbox-pic-view">' +
				'<span class="lightbox-btn lightbox-prev-btn"></span>' +
				'<img src="" class="lightbox-image"/>' +
				'<span class="lightbox-btn lightbox-next-btn"></span>' +
				'</div>' +
				'<div class="lightbox-pic-caption">' +
				'<div class="lightbox-caption-area">' +
				'<p class="lightbox-pic-desc"></p>' +
				'<span class="lightbox-of-index">当前索引：0 of 0</span>' +
				'</div>' +
				'<span class="lightbox-close-btn"></span>' +
				'</div>';
			//插入this.popupWind
			this.popupWin.html(strDom);
			//插入this.popupMask和this.popupWind
			this.bodyNode.append(this.popupMask, this.popupWin);
		}
	}
	window["LightBox"] = LightBox;
})(jQuery);