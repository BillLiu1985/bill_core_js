(function(jQuery,bill_core){
	if(bill_core===undefined){
		console.error('bill_core元件未啟動');
		return;
	}
	if(jQuery.bill_taiwan_address_data===undefined){
		console.error('bill_taiwan_address_data元件未啟動');
		return;
	}
	//type可能的值有city,city_area
	jQuery.bill_taiwan_address={
		'defaults':{
			'default_value':{
				'city':'',
				'area':'',
				//'road':temp_default_value.road,
				//'lane':temp_default_value.lane,
				//'alley':temp_default_value.alley,
				//'number':temp_default_value.number,
				//'floor':temp_default_value.floor,
				//'others':temp_default_value.others
			},
			'input_name':'',
			'container_class_attr_value':'',
			'container_style_attr_value':'display: inline-block;',
			'city_input_class_attr_value':'',
			'city_input_style_attr_value':'',
			'city_input_error_msg_1_attr_value':'',
			'city_input_human_read_name_attr_value':'',
			'area_input_class_attr_value':'',
			'area_input_style_attr_value':'',
			'area_input_error_msg_1_attr_value':'',
			'area_input_human_read_name_attr_value':'',
			'type':'city_area',
			//'is_print_preview_button':'0',
			//'preview_type':'googlemap',
			//'map_width':500,
			//'map_height':500,
			//'map_zoom':15,
			'is_required':'0',
			//'xajax_func':'',
			'limit_citys':[]
		}
	};
	
	
	jQuery.fn.bill_taiwan_address = function(param1,param2){
		var get_jqobject=this.filter('div[id]');
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			bill_core.debug_console('bill_taiwan_address一次只能轉換一個,轉換的元素為賦予id的div','error');
			return;
		}
		else if(get_jqobject.length==0){
			return;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_bill_taiwan_address')!=='1'){
				bill_core.debug_console('請先轉換元素為bill_taiwan_adddress','error');
				return;
			}
			
		}
		
		//物件方法
		var jqobject_scope_methods={
			'set_value':function(value_object){
				if(bill_core.global_typeof(value_object)!=='object'){
					return;
				}
				var input_id_prefix=this.attr('id')+'_';
				if(
					'city' in value_object &&
					bill_core.global_typeof(value_object['city'])==='string'
				){
					jQuery('#'+input_id_prefix+'city').val(value_object['city']);

					if(
						'area' in value_object &&
						bill_core.global_typeof(value_object['area'])==='string'
					){
						jQuery('#'+input_id_prefix+'city').change();
						jQuery('#'+input_id_prefix+'area').val(value_object['area']);
					}
				}
				
			}	
		};
		//若是呼叫物件方法
		if(typeof(param1)=='string'){
			
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
		
		var opts = jQuery.extend( true,{}, jQuery.bill_taiwan_address.defaults, want_set_opts );
		get_jqobject.data(opts);
		opts=get_jqobject.data();
		
		var component_id=get_jqobject.attr('id');
		
		if(bill_core.global_typeof(opts.default_value)==='object'){
		
		}else{
			bill_core.debug_console('bill_taiwan_address元件啟動失敗,default_value參數資料型態錯誤','error');
			return;
		}
		if(get_jqobject.attr('is_transformed_to_bill_taiwan_address')!=='1'){
			get_jqobject.attr('style',opts.container_style_attr_value);
			get_jqobject.attr('class',opts.container_class_attr_value);
			var container_id=get_jqobject.attr('id');
			var default_address_city=(opts.default_value.city===undefined?'':opts.default_value.city);
			var default_address_area=(opts.default_value.area===undefined?'':opts.default_value.area);
			if(opts.type=='city'){
				var temp_html=
				'<select id="'+container_id+'_city" name="'+opts.input_name+'_city" reg_1="(^[\\s\\S]+$)'+(opts.is_required==='1'?'':'|(^$)')+'" '+
				'class="'+opts.city_input_class_attr_value+'" '+
				'style="'+opts.city_input_style_attr_value+'" '+
				'error_msg_1="'+opts.city_input_error_msg_1_attr_value+'" '+
				'human_read_name="'+opts.city_input_human_read_name_attr_value+'" '+
				'></select>';
				get_jqobject.html(temp_html);
				
				var city_options_html='';
				for(var temp_key in jQuery.bill_taiwan_address_data){
					if(
						opts.limit_citys.length>0 && 
						jQuery.bill_taiwan_address_data[temp_key]['value']!='' && 
						jQuery.inArray(jQuery.bill_taiwan_address_data[temp_key]['value'],opts.limit_citys)===-1
					){
						continue;
					}
					city_options_html+=
						'<option value="'+jQuery.bill_taiwan_address_data[temp_key]['value']+'">'+
						jQuery.bill_taiwan_address_data[temp_key]['text']+'</option>';
				}
				jQuery('#'+container_id+'_city').html(city_options_html);				
				jQuery('#'+container_id+'_city').val(default_address_city);
			}
			else if(opts.type=='city_area'){
				var temp_html=
				'<select id="'+container_id+'_city" name="'+opts.input_name+'_city" reg_1="(^[\\s\\S]+$)'+(opts.is_required==='1'?'':'|(^$)')+'" '+
				'class="'+opts.city_input_class_attr_value+'" '+
				'style="'+opts.city_input_style_attr_value+'" '+
				'error_msg_1="'+opts.city_input_error_msg_1_attr_value+'" '+
				'human_read_name="'+opts.city_input_human_read_name_attr_value+'" '+
				'></select>'+
				'<select id="'+container_id+'_area" name="'+opts.input_name+'_area" reg_1="(^[\\s\\S]+$)'+(opts.is_required==='1'?'':'|(^$)')+'" '+
				'class="'+opts.area_input_class_attr_value+'" '+
				'style="'+opts.area_input_style_attr_value+'" '+
				'error_msg_1="'+opts.area_input_error_msg_1_attr_value+'" '+
				'human_read_name="'+opts.area_input_human_read_name_attr_value+'" '+
				'></select>';
				
				jQuery(this).html(temp_html);
				var city_options_html='';
				for(var temp_key in jQuery.bill_taiwan_address_data){
					if(
						opts.limit_citys.length>0 && 
						jQuery.bill_taiwan_address_data[temp_key]['value']!='' && 
						jQuery.inArray(jQuery.bill_taiwan_address_data[temp_key]['value'],opts.limit_citys)===-1
					){
						continue;
					}
					city_options_html+=
						'<option value="'+jQuery.bill_taiwan_address_data[temp_key]['value']+'">'+
						jQuery.bill_taiwan_address_data[temp_key]['text']+'</option>';
				}
				jQuery('#'+container_id+'_city').html(city_options_html);
				jQuery('#'+container_id+'_city').change(
					function(){
						var area_options_html='';
						var temp_areas=jQuery.bill_taiwan_address_data[jQuery(this).val()]['areas'];
						for(var temp_key in temp_areas){
							area_options_html+='<option value="'+
							temp_areas[temp_key]['value']+'">'+
							temp_areas[temp_key]['text']+'</option>';
						}
						jQuery('#'+container_id+'_area').html(area_options_html);
					}
				)
		
				jQuery('#'+container_id+'_city').val(default_address_city);
				jQuery('#'+container_id+'_city').change();
				jQuery('#'+container_id+'_area').val(default_address_area);
		
			}
			get_jqobject.attr('is_transformed_to_bill_taiwan_address','1');
		}
		return get_jqobject;
	};
}(jQuery,bill_core));

