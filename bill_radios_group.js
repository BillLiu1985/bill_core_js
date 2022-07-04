(function(jQuery,bill_core){
	if(bill_core===undefined){
		console.error('bill_core元件未啟動');
		return;
	}
	
	//設定屬於bill_radios_group專屬的元件函式或元件設定預設值
	jQuery.bill_radios_group={
		'defaults':{
			'input_name':'',
			'counts_width':5,
			//value_1;;;text_1,,,value_2;;;text_2,,,value_3;;;text_3
			//value1,,,value2,,,value3
			'environment_data':'',
			//value3
			'default_value':'',
			'radio_extra_attrs':''
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_radios_group = function(param1,param2){
		
		var get_jqobject=this.filter('div[id]');
		
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			bill_core.debug_console('bill_radios_group一次只能轉換一個,轉換的元素為賦予id的div','error');
			return;
		}else if(get_jqobject.length==0){
			return;
		}
		
		//物件方法
		var jqobject_scope_methods={
			
		};
		
		//若是呼叫物件方法
		if(typeof(param1)=='string'){
			//若要執行物件方法 必須先檢查該元素是否已轉化為物件
			if(get_jqobject.attr('is_transformed_to_bill_radios_group')!=='1'){
				bill_core.debug_console('請先轉換元素為bill_radios_group','error');
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
		
		var opts = jQuery.extend( true,{}, jQuery.bill_radios_group.defaults, want_set_opts );
		get_jqobject.data(opts);
		opts=get_jqobject.data();
		
		var component_id=get_jqobject.attr('id');
		
		if(bill_core.global_typeof(opts.default_value)==='string'){
		
		}else{
			bill_core.debug_console('bill_radios_group元件啟動失敗,default_value參數資料型態錯誤','error');
			return;
		}
		
		if(bill_core.global_typeof(opts.environment_data)==='string'){
		
		}else{
			bill_core.debug_console('bill_radios_group元件啟動失敗,environment_data參數資料型態錯誤','error');
			return;
		}
		
		if(get_jqobject.attr('is_transformed_to_bill_radios_group')==='1'){
			get_jqobject.empty();
		}
		
		var temp_html='';
		var the_options=opts.environment_data.split(',,,');
		
		
		//draw radios
		the_options=the_options.filter(
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
			if( the_option.length===1 ){
				the_option_value=bill_core.escape_get_from_option_data(the_option[0]);
				the_option_text=bill_core.escape_get_from_option_data(the_option[0]);
			}
			else if(the_option.length===2){
				the_option_value=bill_core.escape_get_from_option_data(the_option[0]);
				the_option_text=bill_core.escape_get_from_option_data(the_option[1]);
			}
			
			if( the_nth%opts.counts_width===1 ){
				temp_html+='<div>';
			}
		
			temp_html+=
			'<input type="radio" ';
			
			temp_html+='name="'+opts.input_name+'" ';
			
			temp_html+=
			(the_option_value==opts.default_value?'checked="checked" ':'')+
			'value="'+bill_core.escape_html_specialchars(the_option_value)+'" '+
			opts.radio_extra_attrs+' />'+bill_core.escape_html_specialchars(the_option_text)+'&nbsp;';
			
			if( the_nth%opts.counts_width===0 ){
				temp_html+='</div>';
			}
		}
		get_jqobject.append(temp_html);
					
		get_jqobject.filter(':not([is_transformed_to_bill_radios_group])').attr('is_transformed_to_bill_radios_group','1');	
		
		
		return get_jqobject;
	};
}(jQuery,bill_core));

