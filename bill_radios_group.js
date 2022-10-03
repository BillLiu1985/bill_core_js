(function(jQuery,bill_core){
	{
		let never_used_is_found='0';
		if(jQuery===undefined){
			console.error('jquery never used');
		}
		if(bill_core===undefined){
			console.error('bill_core never used');
		}
		if(never_used_is_found==='1'){
			return;
		}
	}
	
	//設定屬於bill_radios_group專屬的元件函式或元件設定預設值
	jQuery.bill_radios_group={
		'defaults':{
			'input_name':'',
			'counts_width':5,
			//value_1;text_1,value_2;text_2,value_3;text_3
			//value1,value2,value3
			'environment_data':'',
			//value3
			'default_value':'',
			'radio_extra_attrs':''
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_radios_group = function(param1,...other_params){
		var return_result=this;
		if( 
			arguments.length>=1
		){
			
		}else if( 
			arguments.length===0
		){
			param1={};
		}
		
		var args_illegal_is_found='0';
		if( 
			bill_core.global_typeof(param1)!=='pure_object' &&
			bill_core.global_typeof(param1)!=='string'
		){	
			args_illegal_is_found='1';
			bill_core.debug_console('bill_core.'+arguments.callee.name+' param1 error!','error');
		}
		if(args_illegal_is_found==='1'){
			return return_result;
		}
		//限制轉換元素的個數為1
		if(this.length>1){
			bill_core.debug_console('bill_radios_group一次只能轉換一個元素');
			return return_result;
		}else if(this.length==1){
			if(this.is('div[id]')){
			}else{
				bill_core.debug_console('bill_radios_group轉換的元素必須為賦予id的div');
				return return_result;
			}
		}else if(this.length==0){
			return return_result;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_bill_radios_group')!=='1'){
				bill_core.debug_console('請先轉換元素為bill_radios_group','error');
				return return_result;
			}
			
		}
		
		var get_jqobject=this;
		var component_id=get_jqobject.attr('id');
		if( bill_core.global_typeof(param1)=='pure_object' ){
			var want_set_opts=param1;
			
			if(bill_core.global_typeof( want_set_opts.default_value)==='string'){
		
			}else{
				bill_core.debug_console('bill_radios_group元件啟動失敗,default_value參數資料型態錯誤','error');
				return get_jqobject;
			}
			
			if(bill_core.global_typeof( want_set_opts.environment_data)==='string'){
			
			}else{
				bill_core.debug_console('bill_radios_group元件啟動失敗,environment_data參數資料型態錯誤','error');
				return get_jqobject;
			}
		
			get_jqobject.data(
				jQuery.extend( true,{}, jQuery.bill_radios_group.defaults, want_set_opts )
			);	
		}
		var opts=get_jqobject.data();
				
		//物件方法
		var jqobject_private_methods={
			'initial':function(){
				get_jqobject.empty();
				get_jqobject.attr('is_transformed_to_bill_radios_group','1');
				
				var temp_html='';
				var the_options=bill_core.string_string_to_options_data(
					opts.environment_data
				);
				
				//draw radios
				
				for(var kindex in the_options){
					var the_nth=parseInt(kindex,10)+1;
					var the_option_value=the_options[kindex]['value'];
					var the_option_text=the_options[kindex]['text'];
					
					
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
				
			},
		};
		var jqobject_public_methods={
			
		};
		//若是呼叫物件方法
		if(typeof(param1)=='string'){
			if(
				jqobject_public_methods[param1]===undefined
			){
				bill_core.debug_console('元件無此操作','error');
				return get_jqobject;
			}
			
			return jqobject_public_methods[param1].apply(get_jqobject,other_params);
		}
		
		jqobject_private_methods.initial();
		return get_jqobject;
	};
})(jQuery,bill_core);

