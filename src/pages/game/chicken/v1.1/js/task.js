var CK = CK || {};

(function () {
	var showTask = function (type) {
		$.get('/common/getChickenTaskResult', {
			usk: CK.data.selfId,
			type: (CK.data.tenter? 2: 1)
		}, (data)=>{
			if(!data) {
				return;
			}

			console.log('ta_desc: %s\nval: %s\ntar: %s\ncomp_desc: %s\nrcv_url: %s\ntype: %s', data.taskDes, data.val, data.totalVal, data.compDes, data.rcvUrl, data.type);
			
			var style = {
				display: "flex",
				display: "-webkit-flex"
			};
			// $('.task-ongoing').css(style);
			// return;
			// 结果页y坐标需要上调
			if(type === 'result') {
				style.top = '0.2rem;';
				style['z-index'] = '10';
			}

			if(data.val >= data.totalVal) {// 达成任务
				if(type === 'match') {
					return;// 匹配界面不显示任务完成
				}
				// $('.comp-text').html('任务达成！' + data.taskDes + data.totalVal + '/' + data.totalVal);
				$('.comp-text').html('已完成！');
				$('.go-tips').html('任务奖励：' + data.compDes);
				$('.task-complete').css(style);

				if(data.type === 1){// 大厅入口
					if(data.rcvResult === 1) { // 已领取
						$('.comp-btn-label').html('已领取');
						$('.comp-btn-label').css({"color": "#4e4d4d"});
						$('.comp-btn').css({"background": "rgba(159, 160, 161, 1)"});
						$('.comp-btn').unbind();
						return;
					} else {
						$('.comp-btn-label').html('领取奖励');
						$('.comp-btn-label').css({"color": "#80431B"});
						$('.comp-btn').css({"background": "rgba(248, 204, 74, 1)"});
						$('.comp-btn').unbind();
						
						embedExport(embedData.button_task_result_hall_exposure);
						
					}
				}
				else{
					
					embedExport(embedData.button_task_result_exposure);
				}

				$('.comp-btn').click(()=>{

					if(fromHall){
						embedClick(embedData.button_task_result_hall_click);
					}
					else{
						embedClick(embedData.button_task_result_click);
					}
					
					// 点击领取需要通知服务器
					var pid = CK.getQueryValue('pageId');
					var param = {
						gameId: wsData.gid,
						usk: CK.data.selfId,
						type: (CK.data.tenter? 2: 1)
					}
					if(!!pid){
						param.pageId = pid;
					}

					$.get('/common/chickenTaskReward', param, (rsp)=>{
						if(rsp.success) {
							if(data.type === 1){// 1是大厅
								$('.comp-btn-label').html('已领取');
								$('.comp-btn-label').css({"color": "#4e4d4d"});
								$('.comp-btn').css({"background": "rgba(159, 160, 161, 1)"});
								$('.comp-btn').unbind();
								$('.receive-mask').css({display: "flex"});
								$('.receive-tip').html(rsp.data + '金币');
								setTimeout(()=>{
									$('.receive-mask').hide();
								}, 2000);
							} else if(data.type === 2) {// 2是单投
								window.location = data.rcvUrl;
							}
						} else {
							window.showToast('领取失败', true);
						}
						
					});
				});
			} else {// 任务进行中
				$('.go-prog-text').html(data.taskDes + ' ' + data.val + '/' + data.totalVal);
				$('.go-thumb').css({
					width: Math.floor(data.val / data.totalVal * 98) + '%'
				});
				$('.go-tips').html('任务奖励：' + data.compDes);
				$('.task-ongoing').css(style);

				if(type === 'match') {
					gameMatching();
				}
			}
			
		});
	}
	CK.showTask = showTask;

	var hideTask = function () {
		$('.task-complete').hide();
		$('.task-ongoing').hide();
	}
	CK.hideTask = hideTask;
})();