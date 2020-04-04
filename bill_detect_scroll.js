(function($){
	//先看jquery有沒有引入
	if($===undefined){
		alert('jquery元件未啟動');
		return;
	}
	//task_data格式
	/*
	{
		'scroll_start_top':0,
		'scroll_end_top':0,
		'content':function(){
			
		},
		'is_enter_then_run_once':false,
		'is_have_run_once':false
	}
	*/
	$.easy_detect_scroll={
		'tasks':[],
		'register':function(task_data){
			if(
				global_typeof(task_data)==='object' && 
				global_typeof(task_data['scroll_start_top'])==='number' && 
				global_typeof(task_data['scroll_end_top'])==='number' &&
				task_data['scroll_end_top']>=task_data['scroll_start_top'] &&
				global_typeof(task_data['content'])==='function' && 
				global_typeof(task_data['is_enter_then_run_once'])==='boolean' &&
				global_typeof(task_data['is_have_run_once'])==='boolean'
			){
				this.tasks.push(task_data);
			}			
		}
	};
	$(window).scroll(
		function(){
			var temp_array=$.easy_detect_scroll.tasks;
			var temp_top=$(this).scrollTop();
	
			//var temp_height=$(this).height();
			for(var kindex in temp_array){
				if(
					temp_top>=temp_array[kindex]['scroll_start_top'] &&
					temp_top<=temp_array[kindex]['scroll_end_top'] 				
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

