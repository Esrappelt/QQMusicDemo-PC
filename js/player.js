(function(window){
	function Player($audio){
		return new Player.prototype.init($audio);
	}
	Player.prototype = {
		//因为是简写，所以要修正
		constructor:Player,
		//初始化
		init: function($audio){
			this.$audio = $audio;//这是jq对象
			this.audio = $audio.get(0);//DOM 对象，只能用原生js写
		},
		//判断是否为同一首歌曲的标志
		currentIndex:-1,
		//装音乐列表
		musicList:[],
		isOrder:false,
		stopMusic: function(){
			this.audio.pause();//暂停
		},
		setLoop: function(){
			this.audio.loop = true;
		},
		setOrder: function() {
			this.isOrder = true;
		},
		playMusic: function(index,music){
			//判断是否为同一首歌
			if(index === this.currentIndex) {
				//是同一首
				if(this.audio.paused) {
					this.audio.play();//播放
				}else {
					this.audio.pause();//暂停
				}
			}else {
				//如果不是同一首
				this.currentIndex = index;//把当前的index赋给currentIndex
				this.$audio.attr('src', music.link_url);//设置属性
				this.audio.play();
			}
		},
		//播放当前首歌
		currentPlay:function(){
			//一定记得加this
			return (this.currentIndex === -1) ? 0 : this.currentIndex;
		},
		//上一首
		prePlay:function (){
			return (this.currentIndex - 1) < 0 ? (this.musicList.length - 1) : (this.currentIndex - 1);
			// var index = this.currentIndex - 1;
			// if(index < 0) {
			// 	index = this.musicList.length - 1;
			// }
			// return index;
		},
		//下一首
		nextPlay: function () {
			return (this.currentIndex + 2 > this.musicList.length) ? 0 : (this.currentIndex + 1);
			// var index = this.currentIndex + 1;
			// if(index > this.musicList.length - 1) {
			// 	index = 0;
			// }
			// return index;
		},
		//删除音乐
		delMusic:function(index){
			//删除索引值为index的音乐,这里数组的删除方法很好用
			this.musicList.splice(index,1);

			//判断删除的音乐是不是当前播放音乐的前面的音乐
			if(index < this.currentIndex) {
				//删一首就减掉1
				this.currentIndex = this.currentIndex - 1;
			}
		},
		//获取歌曲当前整首歌的时间
		getMusicDuration:function(){
			return this.audio.duration;
		},
		//获取歌曲当前播放的时间
		getMusicCurrentTime:function(){
			return this.audio.currentTime;
		},
		//同步时间方法
		musicTimeUpdate: function(callback){
			var that = this;//保存一下外部的this
			that.$audio.on('timeupdate', function(event) {
				event.preventDefault();
				var musicBuffered = that.audio.buffered;
				var musicLength = musicBuffered.length;
				if(musicBuffered.length !== 0) {
					var timeRage = musicBuffered.end(0)* 100/that.audio.duration ;
				}
				var duration = that.getMusicDuration();
				var currentTime = that.getMusicCurrentTime();
				var timeStr = that.formatDate(duration,currentTime);
				callback(duration,currentTime,timeStr,timeRage);//这就是回调函数
			});
		},
		formatDate: function(duration,currentTime){
			var startMin = parseInt(currentTime/60);
			var startSecond = parseInt(currentTime%60);
			var endMin = parseInt(duration/60);
			var endSecond = parseInt(duration%60);
			if(startMin < 10) {
				startmin = "0" + startMin;
			}
			if(endMin < 10) {
				endmin = "0" + endMin;
			}
			if(startSecond < 10){
				startSecond = "0" + startSecond;
			}
			return startMin+ ":" + startSecond + " / " + endMin + ":" + endSecond;
		},
		musicSeekTo: function(value){
			if(isNaN(value)) return;
			if(value < 0 || value > 100) return;
			var that = this;
			//设置当前时间比例
			that.audio.currentTime = that.audio.duration * value;
		},
		setVolume: function(value) {
			if(isNaN(value)) return;
			if(value < 0 || value > 1) return;
			this.audio.volume = value;
		},
		getCurrentVolume: function(){
			return this.audio.volume;
		},
		setMuted: function(flag){
			this.audio.muted = flag;
		},
		isPause:function() {
			return this.audio.paused;
		}
	}
	Player.prototype.init.prototype = Player.prototype;
	window.Player = Player;
})(window);

