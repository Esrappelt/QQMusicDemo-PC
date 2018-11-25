(function(window){
	function Progress($music_bar,$music_line,$music_dot){
		return new Progress.prototype.init($music_bar,$music_line,$music_dot);
	}
	Progress.prototype = {
		constructor:Progress,
		init: function($music_bar,$music_line,$music_dot){
			this.$music_bar = $music_bar;
			this.$music_line = $music_line;
			this.$music_dot = $music_dot;
		},
		isMove:false,
		progressClick:function (callback){
			var that = this;//这个this是progress
			//获取进度条默认窗口的距离
			that.$music_bar.on('click', function(event) {
				//这个this是$music_bar，不一样的
				event.preventDefault();	
				var normalLeft = $(this).offset().left;
                var evenLeft = event.pageX;
                //这里以后优化一下：当我鼠标移过的时候，会超出范围的
                that.$music_line.css('width', evenLeft - normalLeft);
                that.$music_dot.css('left', evenLeft - normalLeft);
                var value = (evenLeft - normalLeft) / that.$music_bar.width();
				callback(value);
			});
		},

		progressMove: function (callback) {
			//引用this
			var that = this;
			//让自动进度条不播放了
			//获取默认位置
			var normalLeft = that.$music_bar.offset().left;
			//获取进度条的宽度
			var barWidth = that.$music_bar.width();
			//获取每次距离左窗口的距离
			var evenLeft;
			//1.监听鼠标按下事件
			that.$music_bar.on('mousedown', function(event) {
				//鼠标按下去之后才可以移动
				//2.监听鼠标移动事件
				that.isMove = true;
				// that.trottle();
				$(document).on('mousemove', function(event) {
					evenLeft = event.pageX;//移动的时候获取值
					var offset = evenLeft - normalLeft;
					if(offset >= 0 && offset <= barWidth) {
		                that.$music_line.css('width', offset);
		                that.$music_dot.css('left', offset);
					}
				});
				//3.监听鼠标抬起事件,而且是让整个文档去监听
				$(document).mouseup(function(event) {
					$(document).off("mousemove");//关闭mousemove事件
					//这里又让进度条继续播放
					that.isMove = false;
					//拿到拖动的时候的比例
					var value = (evenLeft - normalLeft) / that.$music_bar.width();
					callback(value);
				});
			});
		},
		setMove: function (){
			
		},
		setProgress: function(value){
			//如果拖拽的时候在移动，那么我
			if(this.isMove) return;
			if(value < 0 || value > 100) return;
			var that = this;
			//把他换成百分比
			that.$music_line.css('width', value + "%");
			that.$music_dot.css('left', value + "%");
		},
		trottle:function(method,context) {
			context = context || window;
			clearTimeout(method.tId);
			method.tId = setTimeout(function(){
				method.call(context);
			},10);
		}
		
	}
	Progress.prototype.init.prototype = Progress.prototype;
	window.Progress = Progress;
})(window);

