(function($){
	//先看jquery有沒有引入
	if($===undefined){
		alert('jquery元件未啟動');
		return;
	}
	
	//設定屬於easy_select_relateds專屬的元件函式或元件設定預設值
	//op:upload_material,delete_upload
	//有元素負責input 有元素負責save data
	$.easy_select_relateds={
		'defaults':{
			'input_name':'',
			'count_limited':5,
			'dialog_url':'',
			'dialog_type':'',
			'default_value':'',
			'environment_data_source':{}
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	$.fn.easy_select_relateds = function(param1,param2){
		
		var get_jqobject=this.filter('div[id]');
		
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			alert('select_relateds一次只能轉換一個,轉換的元素為賦予id的div');
			return;
		}else if(get_jqobject.length==0){
			return;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_select_relateds')===''){
				alert('請先轉換元素為select_relateds');
				return;
			}
			
		}
		
		//物件方法
		var jqobject_scope_methods={
			'the_function':function(){
			}
		};
		
		//若是呼叫物件方法
		if(typeof(param1)=='string'){
			
			if(global_typeof(param2)!=='array'){
				
				param2=[];
			}
			if(jqobject_scope_methods[param1]===undefined || typeof(jqobject_scope_methods[param1])!=='function'){
				alert('元件無此操作');
				return;
			}
			
			return jqobject_scope_methods[param1].call(get_jqobject,param2);
		}
		
		if(typeof(param1)=='undefined'){
			options={};
		}else{
			options=param1;
		}
		var opts = $.extend( true,{}, $.easy_select_relateds.defaults, options );
		
		get_jqobject.data(opts);
		
		var opts=get_jqobject.data();
		
		var component_id=get_jqobject.attr('id');
		if(get_jqobject.attr('is_transformed_to_select_relateds')===undefined){
			
			var temp_html='';
		
			
			
			temp_html=
			'<input type="hidden" value="'+opts.default_value+'" id="'+component_id+'_newvalue" name="'+opts.input_name+'"    />'+
			'<input type="hidden" value="0" id="'+component_id+'_oldvalue_is_deleted" name="'+opts.input_name+'_oldvalue_is_deleted"    />'+
			'<input type="button" value="選取'+(opts.count_limited==0?'':'(最多'+opts.count_limited+'組)')+'" id="'+component_id+'_open_button"   /><br />'+
			'<div id="'+component_id+'_display_info">'+opts.environment_data_source['display_info']+'</div>';
			get_jqobject.html(temp_html);
			
			
			//bind element event_handler
			$('#'+component_id+'_open_button').click(
				function(){
					var the_dialog_width=500;
					var the_dialog_height=600;
					
					var window_width = window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width);
					var window_height = window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height);

					var the_dialog_left=(window_width-the_dialog_width)/2;
					var the_dialog_top=(window_height-the_dialog_height)/2;
					
					var the_open_url=opts.dialog_url;
					the_open_url=global_set_url_params(the_open_url,{'count_limited':opts.count_limited,'dialog_type':opts.dialog_type,'parent_component_id':component_id});
					window.open(
						the_open_url,
						'_blank',
						'location=0,menubar=1,status=0,titlebar=0,left='+the_dialog_left+',top='+the_dialog_top+',width='+the_dialog_width+',height='+the_dialog_height,
						false
					);
				}
			);
			
			
			get_jqobject.attr('is_transformed_to_select_relateds','1');	
		}
		
		return get_jqobject;
	};
}(jQuery));

