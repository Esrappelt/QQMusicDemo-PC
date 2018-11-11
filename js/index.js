$(function() {
	//自定义滚动条
	$(".songlist").mCustomScrollbar();
	
	//获取用来播放的audio
	var $audio = $("audio");
	
	//定义歌词变量
	var lyric;
	
	//控制声音进度条
	var $play_voice_bar = $(".voicewrapper");
	var $play_voice_line = $(".play_voice_line");
	var $play_voice_dot = $(".play_voice_dot");
	
	//控制时间进度条
	var $music_bar = $(".wrapper");
	var $music_line = $(".play_mid_top_line");
	var $music_dot = $(".play_mid_top_dot");

	//获取歌词列表$musicUl
	var $musicUl =  $(".songlist ul");
	
	//创建歌曲实例player
	var player = new Player($audio);

	//创建声音进度条实例对象voiceProgress
	var voiceProgress = new Progress($play_voice_bar,$play_voice_line,$play_voice_dot);
	
	//创建时间进度条实例progress
	var progress = new Progress($music_bar,$music_line,$music_dot);
	
	//0.加载歌曲
	getPlayerList();
	//1.初始化
	initEvents();
	
	//监听音量点击时的变化
	voiceProgress.progressClick(function(value){
		player.setVolume(value);
	});
	
	//监听音量移动时的变化
	voiceProgress.progressMove(function(value){
		player.setVolume(value);
	});

	//监听歌曲进度条被点击时的进度
	progress.progressClick(function(value){
		player.musicSeekTo(value);
	});

	//监听歌曲进度条被点击并移动时的进度控制
	progress.progressMove(function(value){
		player.musicSeekTo(value);
	});

	//获取歌词列表 
	function getPlayerList(){
		//利用ajax获取本地歌曲或者服务器的歌曲
		$.ajax({
			url: '../audio/musicList.json',
			dataType: 'json'
		})
		.done(function(res) {
			//把数据歌曲赋值给对象player
			player.musicList = res;
			
			//遍历获取到的数据，创建每一条音乐
			$.each(res,function(index, el) {
				//创建音乐DOM对象
				var $item = createMusicItem(index, el);
				//添加到页面去
				$item.appendTo($musicUl);
			});

			//默认是列表循环播放,若是用户设置好了，就从网络获取，这里是本地
			listCirclePlay();
			
			//初始化第一首音乐的信息，这里默认是第一首，若是用户最后播放的那首，就从网络获取
			initMusicInfo(res[0]);
			
			//初始化歌词信息，默认是第一首
			initLyricInfo(res[0]);

		})
		.fail(function(res) {
			//返回错误打印原因
			console.log(res.status);
		})
	}

	//初始化歌词信息
	function initLyricInfo(music){
		//创建一个歌词实例对象
		lyric = new Lyric(music.link_lrc);
		//获取装歌词的容器
		var $liricContainer = $(".music_lyric .lyrics");
		//先清空上一次的歌词
		$liricContainer.text("");
		//清空后，开始加载歌曲

		//在纯净模式下的歌词
		var $pureModeBar = $(".pureMode .pureModeBar");
		//也要清空
		$pureModeBar.text("");
		lyric.loadLyric(function(){
			//遍历歌曲的歌词数组
			$.each(lyric.lyrics,function(index, el) {
				//动态创建li元素，其内容为歌词
				var $item1 = $("<li>"+el+"</li>");
				//添加到装歌词的容器里面
				$liricContainer.append($item1);
				//再创建一个Li,再装进去
				var $item2 = $("<li>"+el+"</li>");
				//纯净模式下装进去
				$pureModeBar.append($item2);
			});
		});
	}

	//初始化音乐信息
	function initMusicInfo(music) {
		//去获取要渲染的元素
		
		//获取歌曲图片元素
		var $musicImage = $(".pic_name img");
		//获取歌名元素
		var $musicName = $(".song_name a");
		//获取歌曲歌手元素
		var $musicSinger = $(".singer2 a");
		//获取歌曲专辑
		var $musicAlbum = $(".album_name a");
		// 获取歌曲背景设置图（高斯模糊图）
		var $musicBg = $(".mask_bg");
		//获取歌曲的底部的控制条信息
		var $musicBottomInfo =  $(".play_mid_top_s_left a");
		//获取歌曲的事件元素
		var $musicTime = $(".play_mid_top_s_right");
		
		//开始赋值
		//得到图片URL地址
		var $img_url =  music.cover;

		//设置图片属性
		$musicImage.attr('src', music.cover);

		//设置歌曲名字
		$musicName.text(music.name);

		//设置歌手
		$musicSinger.text(music.singer);

		//设置专辑
		$musicAlbum.text(music.album);

		//设置背景
		$musicBg.css("background-image", "url("+ $img_url +")");

		//设置底部控制条歌手和歌名信息
		$musicBottomInfo.text(music.singer + " - " + music.name);

		//设置音乐时间信息
		$musicTime.text("00:00" + " / " +  music.time);
	}

	//创建音乐DOM对象
	function createMusicItem(index, el) {
		//创建音乐DOM对象
		var $item = $("<li class=\"list_song\"><div class=\"box\"><label class=\"checkBox\"><input type=\"checkbox\" class=\"subcheck\"></label></div><div class=\"number\"><span>"+(index+1)+"</span></div><div class=\"name\"><span>"+el.name+"</span><div class=\"menu\"><a href=\"javascript:;\" title=\"播放\" ><i class=\"menu_play\"></i></a><a href=\"javascript:;\" title=\"添加到歌单\"><i></i></a><a href=\"javascript:;\" title=\"分享\"><i></i></a></div></div><div class=\"singer\"><a href=\"javascript:;\">"+el.singer+"</a></div><div class=\"time\"><span>"+el.time+"</span><a href=\"javascript:;\" title=\"删除\"><i class=\"delMusic\"></i></a></div></li>");
		
		//每次都创建一个，然后新创建的这个给它添加两个属性为index和el
		//原生DOM对象,li对象
		$item.get(0).index = index;
		$item.get(0).el = el;
		return $item;
	}

	//初始化页面交互事件
	function initEvents() {
		//委托事件，移入移出事件
		$(".songlist").on('mouseenter',".list_song",function(event) {
			event.preventDefault();
			//1.隐藏时长
			$(this).find('.time span').hide();
			//2.显示播放器
			$(this).find('.menu').stop().fadeIn(100);
			//3.显示删除
			$(this).find('.time a').show();
		});
		$(".songlist").on('mouseleave', ".list_song", function(event) {
			event.preventDefault();

			//隐藏删除
			$(this).find('.time a').hide();
			//显示时长
			$(this).find('.time span').show();
			//隐藏播放器

			$(this).find('.menu').stop().fadeOut(100);
		});
		
		var $checkboxall = $musicUl.find('li.list_title input[type="checkbox"]');
		//点击事件
		$checkboxall.on('click', function(event) {
			event.preventDefault();
			$checkboxall.toggleClass('songChecked');
			var $subcheck = $musicUl.find('li.list_song input[type="checkbox"]');
			if($checkboxall.hasClass('songChecked')) {
				$subcheck.each(function(index, el) {
					$(this).addClass('songChecked');
				});
			}
			else{
				$subcheck.each(function(index, el) {
					$(this).removeClass('songChecked');
				});	
			}
		});
		$(".songlist").on('click', '.subcheck', function(event) {
			event.preventDefault();
			$(this).toggleClass('songChecked');
		});

		var $play2 = $(".play .play2");
		$(".songlist").on('click', '.menu_play', function(event) {
			event.preventDefault();
			//找到当前所在的li元素
			var $list_song = $(this).parents(".list_song");
			//在这里我就得到了我创建的时候，对象保存的属性index和el了
			// console.log($list_song.get(0).index);
			// console.log($list_song.get(0).el);
			//切换播放图标
			$(this).toggleClass('menu_play2');

			//head 里面的title动态改变
			var $title = $("head title");
			$title.text("正在播放"+ $list_song.get(0).el.name + "-" + $list_song.get(0).el.singer);
			//这里加动画title
			
			//移出其它图标
			$list_song.siblings().find('.menu_play').removeClass('menu_play2');
			//切换播放波浪图标
			var $num = $list_song.find('.number span');
			//找到歌手
			var $singer = $list_song.find('.singer2 a');
			//找到歌名
			var $songname = $list_song.find('.name a');

			//同步播放按钮
			if($(this).hasClass('menu_play2')) {
				//属于正在播放
				$play2.addClass('playing');
				$num.addClass('songWave');
				//播放图标
				$list_song.siblings().find('.number span').removeClass('songWave');
				//文字高亮
				$singer.css('color', 'white');
				$list_song.siblings().find('.singer a').css('color', 'rgba(255,255,255,.8)');
				//文字高亮
				$songname.css('color', 'white');
				$list_song.siblings().find('.name span').css('color', 'rgba(255,255,255,.8)');
			}else {
				//属于没有播放
				$play2.removeClass('playing');
				$num.removeClass('songWave');
				$singer.css('color', 'rgba(255,255,255,.8)');
				$songname.css('color', 'rgba(255,255,255,.8)');
			}
			//2.播放音乐
			var $playMusic = $list_song.get(0).el;
			var $playIndex = $list_song.get(0).index;
			player.playMusic($playIndex,$playMusic);
			//切换音乐的信息
			initMusicInfo($playMusic);
			initLyricInfo($playMusic);
			
		});
		//3.底部控制播放
		$play2.on('click', function(event) {
			event.preventDefault();
			$("li.list_song").eq(player.currentPlay()).find('.menu_play').trigger('click');
		});
		//4.底部上一首
		var $play1 = $(".play .play1");
		$play1.on('click', function(event) {
			event.preventDefault();
			$("li.list_song").eq(player.prePlay()).find('.menu_play').trigger('click');
		});
		//5.底部下一首
		var $play3 = $(".play .play3");
		$play3.on('click', function(event) {
			event.preventDefault();
			$("li.list_song").eq(player.nextPlay()).find('.menu_play').trigger('click');
		});

		//删除音乐
		//得到全部删除按钮
		$(".songlist").on('click', '.delMusic', function(event) {
			event.preventDefault();
			//得到点击的这条音乐的li元素
			var $list_song = $(this).parents('.list_song');
			//判断当前这首是否在播放
			if($list_song.get(0).index === player.currentIndex){
				//是正在播放，就自动触发下一首
				$play3.trigger('click');
			}
			//删除这条音乐
			var $index = $list_song.get(0).index;
			player.delMusic($index);
			$list_song.remove();

			//重新排序
			//这个el是原生DOM节点
			//要利用$()方法转换成jq对象
			$(".list_song").each(function(index, el) {
				//el里面我是绑定了index和el属性的,这里是更新index属性
				el.index = index;
				var $li = $(el);//要把它变成jq对象，因为el是原生DOM对象
				$li.find('.number span').text(index + 1);
			});
		});
		//3.时间、进度条同步
		player.musicTimeUpdate(function(duration,currentTime,timeStr){
			//同步时间
			$(".play_mid_top_s_right").text(timeStr);
			//同步进度条
			var value = currentTime / duration * 100;
			progress.setProgress(value);

			var lyricIndex = lyric.currentIndex(currentTime);
			if(lyricIndex <= 0) {
				return;
			}
			//拿到当前时间播放的这句歌词，然后高亮一下
			var $liricItem = $(".lyrics li").eq(lyricIndex);
			$liricItem.addClass('cur').siblings().removeClass('cur');
			$(".lyrics").css('marginTop', -lyricIndex * 20 );

			var $pureItem = $(".pureModeBar li").eq(lyricIndex);
			$pureItem.addClass('cur').siblings('li').removeClass('cur');
			$(".pureModeBar").css('marginTop', -lyricIndex * 58 );
		});
		//点击静音按钮
		$(".voice .play9").on('click', function(event) {
			event.preventDefault();
			$(this).toggleClass('play9_2');
			//关闭状态
			if($(this).attr('class').indexOf("play9_2") != -1) {
				player.setMuted(true);
			}else {
				player.setMuted(false);
			}
		});
		//点击设置为顺序播放
		$(".play_right").on('click','.play4',function(event) {
			event.preventDefault();
			//设置类为play4_1
			$(this).attr('class', 'play4_1');
			orderPlay();
		});
		//点击设置为随机播放
		$(".play_right").on('click', '.play4_1',function(event) {
			event.preventDefault();
			//设置类为play4_2
			$(this).attr('class', 'play4_2');
			randomPlay();
		});
		//点击设置为单曲播放
		$(".play_right").on('click','.play4_2',function(event) {
			event.preventDefault();
			//设置类为play4_3
			$(this).attr('class', 'play4_3');
			circlePlay();
		});
		//点击设置为列表循环
		$(".play_right").on('click','.play4_3', function(event) {
			event.preventDefault();
			//设置类为play4
			$(this).attr('class', 'play4');
			//待会要设置为默认是列表循环
			listCirclePlay();
		});

		//点击下载
		var $download = $(".play_right .play6");
		$download.click(function(event) {
			if($(".list_song").length == 0) {
				alert("没有可播放的音乐");
				return false;
			}
			var url,filename;
			if(player.currentIndex === -1) {
				url = player.musicList[0].link_url;
				filename = player.musicList[0].name;
			}
			else {
				url = player.musicList[player.currentIndex].link_url;
				filename = player.musicList[player.currentIndex].name;
			}
			$(this).attr('href', url);
			$(this).attr('download', filename + ".mp3");
		});

		//清除列表
		var $delAllMusicIcon = $(".delTip .topDel i ");
		var $noDel = $(".bottomDel .noDel");
		$delAllMusicIcon.on('click', function(event) {
			event.preventDefault();
			concealTip()
		});
		$noDel.on('click', function(event) {
			event.preventDefault();
			concealTip();
		});
		var $delAllMusic = $("#delAllMusic");
		$delAllMusic.on('click', function(event) {
			event.preventDefault();
			//弹出框
			delTip();
		});

		function delTip() {
			$(".delTipSet").css('display', 'block');
		}
		function concealTip() {
			$(".delTipSet").css('display', 'none');
		}

		var $yesDel = $(".delTip .yesDel");
		$yesDel.on('click', function(event) {
			event.preventDefault();
			//删除所有音乐
			$(".list_song").remove();
			//隐藏弹出框
			concealTip();
		});


		//纯净模式
		$(".play .play8").on('click', function(event) {
			event.preventDefault();
			$(this).toggleClass('play8_1');
			
			if($(this).hasClass('play8_1')) {
				//是纯净模式
				$(".MusicAll .pureMode").css('display', 'block');
				$(".MusicAll .music").css('display', 'none');
			}else {
				//普通模式
				$(".MusicAll .pureMode").css('display', 'none');
				$(".MusicAll .music").css('display', 'block');
			}
		});

	}

	//设置随机播放
	function randomPlay() {
		// 产生随机数n~m的随机数（包括n和m）
		//1.计算n-m的值w
		//2.Math.random() * w
		//3.Math.random() * w + n
		//4.Math.round(Math.random() * w + n)  --Math.round()是把数四舍五入为最接近的整数
		var n = 0,m = player.musicList.length;
		var randomNum = Math.round(Math.random() * (m - n) + n);
		player.musicTimeUpdate(function(duration,currentTime,timeStr){
			//若当前播放时间等于总的时间，相当于播放完，进行下一曲的播放
			if(duration === currentTime) {
				//触发下一首的点击事件
				$("li.list_song").eq(randomNum).find('.menu_play').trigger('click');
			}
		});
		//处理实现0-musicList长度的随机数
	}

	//设置单曲循环
	function circlePlay(){
		//设置单曲循环,audio.loop = true
		player.setLoop();
	} 

	//设置顺序播放
	function orderPlay() {

		player.musicTimeUpdate(function(duration,currentTime,timeStr){
			if(currentTime === duration && ( player.currentIndex === player.musicList.length - 1) ) {
				//这里处理一下暂停图标的切换
				console.log("以为na");
				return;
			}
			console.log("正在播放");
			if(currentTime === duration) {
				console.log("播放下一首");
				//播放下一首
				$("li.list_song").eq(player.nextPlay()).find('.menu_play').trigger('click');
			}
		});
		player.setOrder();
	}

	//设置列表循环播放
	function listCirclePlay() {
		player.musicTimeUpdate(function(duration,currentTime,timeStr){
			if(currentTime === duration) {
				//播放下一首
				$("li.list_song").eq(player.nextPlay()).find('.menu_play').trigger('click');
			}
		});
	}
});

