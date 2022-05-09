(function(jQuery,bill_core){
	
	
	//設定屬於bill_checkboxs_group專屬的元件函式或元件設定預設值
	jQuery.bill_checkboxs_group={
		'defaults':{
			'input_name':'',
			'counts_width':5,
			//value_1;;;text_1,,,value_2;;;text_2,,,value_3;;;text_3
			//value1,,,value2,,,value3
			'environment_data':'',
			//value1,,,value2,,,value3
			'default_value':''
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_checkboxs_group = function(param1,param2){
		
		var get_jqobject=this.filter('div[id]');
		
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			bill_core.debug_console('bill_checkboxs_group一次只能轉換一個,轉換的元素為賦予id的div','error');
			return;
		}else if(get_jqobject.length==0){
			return;
		}
		
		
		
		//物件方法
		var jqobject_scope_methods={
			
		};
		
		//若是呼叫物件方法
		if( typeof(param1)=='string' ){

			//若要執行物件方法 必須先檢查該元素是否已轉化為物件
			if( get_jqobject.attr('is_transformed_to_bill_checkboxs_group')!=='1' ){
				bill_core.debug_console('請先轉換元素為bill_checkboxs_group','error');
				return;
			}
		
			if(
				jqobject_scope_methods[param1]===undefined || 
				typeof(jqobject_scope_methods[param1])!=='function'
			){
				bill_core.debug_console('元件無此操作','error');
				return;
			}
			
			var temp_params=[];
			for(var kindex in arguments){
				if(kindex!=='0'){
					temp_params.push(arguments[kindex]);
				}
			}
			return jqobject_scope_methods[param1].apply(get_jqobject,temp_params);
		}
		
		var want_set_opts={};
		if(bill_core.global_typeof(param1)==='undefined'){
		}
		else{
			want_set_opts=param1;
		}
		
		var opts = jQuery.extend( true,{}, jQuery.bill_checkboxs_group.defaults, want_set_opts );
		get_jqobject.data(opts);
		opts=get_jqobject.data();
		
		var component_id=get_jqobject.attr('id');
		
		if(bill_core.global_typeof(opts.default_value)==='string'){
		
		}else{
			bill_core.debug_console('bill_checkboxs_group元件啟動失敗,default_value參數資料型態錯誤','error');
			return;
		}
		
		if(bill_core.global_typeof(opts.environment_data)==='string'){
		
		}else{
			bill_core.debug_console('bill_checkboxs_group元件啟動失敗,environment_data參數資料型態錯誤','error');
			return;
		}
		
		if(get_jqobject.attr('is_transformed_to_bill_checkboxs_group')==='1'){
			get_jqobject.empty();
		}
			
		var temp_html='';
		var the_options=opts.environment_data.split(',,,');
		var the_selected=opts.default_value.split(',,,');
		
		//draw checkboxs
		the_options=the_options.filter(
			function(element){
				if(element!=''){
					return true;
				}
			}
		);
		the_selected=the_selected.filter(
			function(element){
				if(element!=''){
					return true;
				}
			}
		);
		
		for(var kindex in the_options){
			var the_nth=parseInt(kindex,10)+1;
			var the_option=the_options[kindex].split(';;;');
			var the_option_value='';
			var the_option_text='';
			if(the_option.length===1){
				the_option_value=the_option[0];
				the_option_text=bill_core.escape_get_from_option_data(the_option[0]);
			}else if(the_option.length===2){
				the_option_value=the_option[0];
				the_option_text=bill_core.escape_get_from_option_data(the_option[1]);
			}
			
			if( the_nth%opts.counts_width===1 ){
				temp_html+='<div>';
			}
			
			temp_html+=
			'<input type="checkbox" '+
			(( jQuery.inArray(the_option_value,the_selected)!==-1 )?'checked="checked" ':'')+
			'value="'+the_option_value+'" />'+the_option_text+'&nbsp;';
			
			if( the_nth%opts.counts_width===0 ){
				temp_html+='</div>';
			}
		}
		get_jqobject.append(temp_html);
		
		//draw savedata element
		temp_html=
		'<input type="hidden" value="'+opts.default_value+'" name="'+
		opts.input_name
		+'" id="'+component_id+'_value" />';
		
		
		get_jqobject.append(temp_html);
		
		//bind element event_handler
		get_jqobject.find(':checkbox').click(
			function(){	
				var temp_array=[];
				var component_id=get_jqobject.attr('id');
				get_jqobject.find(':checkbox:checked').each(
					function(){
						temp_array.push(jQuery(this).val());
					}
				);
				
				jQuery('#'+component_id+'_value').val(temp_array.join(',,,'));
			}
		);
			
			
		get_jqobject.filter(':not([is_transformed_to_bill_checkboxs_group])').attr('is_transformed_to_bill_checkboxs_group','1');
		
		
		return get_jqobject;
	};
}(jQuery,bill_core));

