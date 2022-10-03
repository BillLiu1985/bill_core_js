(function($){
	//先看jquery有沒有引入
	if($===undefined){
		alert('jquery元件未啟動');
		return;
	}
	//task_data格式
	/*
	{
		'distance_from_element':0,
		'element_id':'',
		'content':function(){
			
		}
	}
	*/
	$.easy_detect_element={
		'tasks':[],
		'register':function(task_data){
			if(
				global_typeof(task_data)==='pure_object' && 
				global_typeof(task_data['element_id'])==='string' && 
				global_string_is_solid(task_data['element_id']) &&
				global_typeof(task_data['content'])==='function' 
			){
				if(
					global_typeof(task_data['distance_from_element'])!=='number'
				){
					task_data['distance_from_element']=$(window).height()/4;
				}
				this.tasks.push(task_data);
			}			
		}
	};
	var last_y_coordinate_window=0;
	var window_move_direction='down';
	$(window).scroll(
		function(){
			var temp_array=$.easy_detect_element.tasks;
			var y_coordinate_window=$(this).scrollTop();
			
			if(y_coordinate_window-last_y_coordinate_window>0){
				window_move_direction='down';
			}else{
				window_move_direction='up';
			}
			last_y_coordinate_window=y_coordinate_window;
			//var temp_height=$(this).height();
			for(var kindex in temp_array){
				var temp_distance_from_element=temp_array[kindex]['distance_from_element'];
				var temp_element_id=temp_array[kindex]['element_id'];
			
				if($('#'+temp_element_id).length==0){
					continue;
				}
				var temp_element_height=$('#'+temp_element_id).height();
				
				var y_coordinate_element=$('#'+temp_element_id).offset().top;
				if(
					y_coordinate_window>=y_coordinate_element-temp_distance_from_element &&
					y_coordinate_window<=y_coordinate_element+temp_element_height
				){
					temp_array[kindex]['content'](window_move_direction);
				}
			}
			
		}
	)
}(jQuery));

