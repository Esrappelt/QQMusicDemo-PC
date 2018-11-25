(function(window){
	function Lyric(path){
		return new Lyric.prototype.init(path);
	}
	Lyric.prototype = {
		constructor:Lyric,
		init: function(path){
			this.path = path;
		},
		index: -1,
		times: [],
		lyrics: [],
		loadLyric: function(callback){
			var that = this;
			$.ajax({
				url: that.path,
				dataType: 'text'
			})
			.done(function(res) {
				that.parseLyric(res);
				callback();
			})
			.fail(function(res) {
				console.log(res.status);
			})
		},
		parseLyric: function(data){
			var that = this;
			that.delTimeAndLycis();
			var array = data.split("\n"); 
			$.each(array,function(index, el) {
				//找到歌词
				var lyc = el.split("]");
				//排除没歌词的元素
				if(lyc[1] === "") return true;
				//装入歌词数组
				that.lyrics.push(lyc[1]);
				var timeReg = /\[(\d+:\d+\.\d+)\]/;
				var res = timeReg.exec(el);//取出每个匹配的
				if(res == null) return true;
				//res[0]返回的是整个匹配的结果
				//res[1]是我括号里的匹配结果
				var timeStr = res[1];
				//然后用分号切割一下
				var res2 = timeStr.split(":");
				//得到res2[0]是分钟,res2[1]是秒
				//把分钟化为秒
				var min = parseInt(res2[0]) * 60;
				//把秒转化为浮点类型的
				var sec = parseFloat(res2[1]);

				//把分秒加起来就是总的时间，也就是currentTime了
				var time = parseFloat(Number(min + sec).toFixed(2));
				//放入存放时间的数组
				that.times.push(time);
			});
		},
		currentIndex: function(currentTime) {
			var that = this;
			// if(that.index === -1) return;
			if(currentTime >= that.times[0]) {
				that.index++;
				//总是删除数组的第一个元素
				that.times.shift();
			}
			return that.index;
		},
		delTimeAndLycis: function(){
			this.times = [];
			this.lyrics = [];
		}
	}
	Lyric.prototype.init.prototype = Lyric.prototype;
	window.Lyric = Lyric;
})(window);

