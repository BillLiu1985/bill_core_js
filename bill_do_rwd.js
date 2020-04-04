(function($){
	//先看jquery有沒有引入
	if($===undefined){
		alert('jquery元件未啟動');
		return;
	}
	//task_data格式
	/*
	{
		'window_start_width':0,
		'window_end_width':0,
		'content':function(){
			
		},
		'is_enter_then_run_once':false,
		'is_have_run_once':false
	}
	*/
	$.easy_do_rwd={
		'tasks':[],
		'register':function(task_data){
			if(
				global_typeof(task_data)==='object' && 
				global_typeof(task_data['window_start_width'])==='number' && 
				global_typeof(task_data['window_end_width'])==='number' &&
				task_data['window_end_width']>=task_data['window_start_width'] &&
				global_typeof(task_data['content'])==='function' && 
				global_typeof(task_data['is_enter_then_run_once'])==='boolean' &&
				global_typeof(task_data['is_have_run_once'])==='boolean'
				
			){
				this.tasks.push(task_data);
			}			
		}
	};
	$(window).resize(
		function(){
			var temp_array=$.easy_do_rwd.tasks;
			var temp_width=$(this).width();
			//var temp_height=$(this).height();
			for(var kindex in temp_array){
				if(
					temp_width>=temp_array[kindex]['window_start_width'] &&
					temp_width<=temp_array[kindex]['window_end_width']
				){
					if(temp_array[kindex]['is_enter_then_run_once']){
						if(temp_array[kindex]['is_have_run_once']){
							continue;
						}
					}
					temp_array[kindex]['is_have_run_once']=true;
					temp_array[kindex]['content']();
				}else{
					temp_array[kindex]['is_have_run_once']=false;
				}
			}
		}
	)
}(jQuery));

