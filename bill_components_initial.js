(function(jQuery,bill_core){
	
	jQuery.bill_components_initial={
		'defaults':{
			'default_value_source':{},
			'environment_data':{},
			'container_id':'',
		}	
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_components_initial = function(param1,param2,param3){
		var return_result=this;
		if( 
			arguments.length===3
		){
			var default_value_source=param1;
			var environment_data_source=param2;
			var container_id=param3;
		}
		else if( 
			arguments.length===2
		){
			var default_value_source=param1;
			var environment_data_source=param2;
			var container_id='';
		}else if( 
			arguments.length===1
		){
			if(bill_core.global_typeof(param1)==='string'){
				var default_value_source={};
				var environment_data_source={};
				var container_id=param1;
			}
			else if(bill_core.global_typeof(param1)==='pure_object'){
				var default_value_source=param1;
				var environment_data_source={};
				var container_id='';
			}
		}else if( 
			arguments.length===0
		){
			var default_value_source={};
			var environment_data_source={};
			var container_id='';
		}
		
		var args_illegal_is_found='0';
		if( 
			bill_core.global_typeof(default_value_source)!=='pure_object'
		){	
			args_illegal_is_found='1';
			bill_core.debug_console('bill_core.'+arguments.callee.name+' default_value_source error!','error');
		}
		if( 
			bill_core.global_typeof(environment_data_source)!=='pure_object'
		){	
			args_illegal_is_found='1';
			bill_core.debug_console('bill_core.'+arguments.callee.name+' environment_data_source error!','error');
		}
		if( 
			bill_core.global_typeof(container_id)!=='string'
		){	
			args_illegal_is_found='1';
			bill_core.debug_console('bill_core.'+arguments.callee.name+' container_id error!','error');
		}
		if(args_illegal_is_found==='1'){
			return return_result;
		}
		
		var get_jqobject=this;
		//先處理一般元件
		get_jqobject.find(
			'input[type="text"][name][name!=""][component_type="input_text"],'+
			'input[type="text"][name][name!=""][component_type="input_text_number"],'+
			'input[type="date"][name][name!=""][component_type="input_date"],'+
			'input[type="hidden"][name][name!=""][component_type="input_hidden"],'+
			'textarea[name][name!=""][component_type="textarea"],'+
			'select[name][name!=""][component_type="select"]'
		).each(
			function(){
				var the_input_name=jQuery(this).attr('name');
				var temp_default_value=default_value_source[the_input_name];
				var temp_environment_data=environment_data_source[the_input_name];
				var the_component_type=jQuery(this).attr('component_type');
				
				var the_input_id=jQuery(this).attr('id');
				if( bill_core.string_is_solid(the_input_id)==='1' ){
					
				}else{
					if( bill_core.string_is_solid(container_id)==='1' ){
						jQuery(this).attr('id',container_id+'_'+the_input_name);
					}
				}
				the_input_id=jQuery(this).attr('id');
				
				if( the_component_type==='input_text' ){
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						
						jQuery(this).attr('value',temp_default_value);
					}
					if( bill_core.global_typeof(jQuery(this).attr('illegal_reg'))==='string' ){
						jQuery(this).keyup(
							function(event){
								jQuery(this).val(
									bill_core.validate_remove_illegal(jQuery(this).attr('illegal_reg'),jQuery(this).val())
								);
							}
						)
					}
				}
				else if( the_component_type==='input_text_number' ){
					
					/*
					if( jQuery(this).attr('style')===undefined){
						jQuery(this).attr('style','ime-mode:disabled')
					}else{
						jQuery(this).attr('style',jQuery(this).attr('style')+';ime-mode:disabled')
					}
					*/
					
					if( bill_core.global_typeof(temp_default_value)==='string' ){
					
						jQuery(this).attr('value',temp_default_value);
					}
					
					jQuery(this).keyup(
							function(event){
								jQuery(this).val(
									bill_core.validate_remove_illegal('inumber',jQuery(this).val())
								);
							}
						)
					
				}
				else if( the_component_type==='input_hidden' ){
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						
						jQuery(this).attr('value',temp_default_value);
					}
				}
				
				else if(the_component_type=='input_date'){
					
					
					var now_datetimebigint=bill_core.datetimebigint_now('0','0','0');
					var min_datebigint='';
					var temp_string=jQuery(this).attr('years_before_now');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						min_datebigint=bill_core.datetimebigint_add(now_datetimebigint, -1*parseInt(temp_string,10), 'year'); 	
						jQuery(this).attr(
							'min',
							bill_core.datetimebigint_toFormattedString(min_datebigint,'Y-m-d')
						);
					}
					
					var max_datebigint='';
					temp_string=jQuery(this).attr('years_after_now');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						max_datebigint=bill_core.datetimebigint_add(now_datetimebigint, 1*parseInt(temp_string,10), 'year');
						jQuery(this).attr(
							'max',
							bill_core.datetimebigint_toFormattedString(max_datebigint,'Y-m-d')
						);
					}
					
					
					if(bill_core.string_is_solid(temp_default_value)==='1'){
						if(temp_default_value==='now'){
							temp_default_value=bill_core.datetimebigint_toFormattedString(now_datetimebigint,'Y-m-d');
						}else{
							temp_default_value=bill_core.datetimebigint_toFormattedString(temp_default_value,'Y-m-d');
						}
					}
					jQuery(this).attr('value',temp_default_value);
				}
				else if( the_component_type==='textarea' ){
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						jQuery(this).val( temp_default_value );
					}
				}
				else if( the_component_type==='select' ){
					
					var the_options=temp_environment_data;
					//the_options Ex:
					//[{'value':'value_1','text':'text_1'},{'value':'value_2','text':'text_2'},{'value':'value_3','text':'text_3'}...]
					if( 
						bill_core.global_typeof(the_options)==='array_object'
					){
						
						/*
						var temp_html='';
						for(var kindex in the_options){
							var the_option=the_options[kindex];
							temp_html+=
								'<option value="'+bill_core.escape_html_specialchars(the_option['value'])+'" >'+bill_core.escape_html_specialchars(the_option['text'])+'</option>';
						}
						jQuery(this).append(temp_html);
						*/
						for(let the_option of the_options){
							
							this.appendChild(
								new Option(the_option['text'], the_option['value'])
							);
							
						}
					}
					
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						//this.value=temp_default_value;
						let temp_array=bill_core.string_multivalue_to_array(temp_default_value);
						
						for(let the_value of temp_array){
							jQuery(this).children('option[value="'+
								jQuery.escapeSelector(the_value)+
							'"]').attr('selected','selected');
						}
						
					}else if( bill_core.global_typeof(temp_default_value)==='array_object' ){
						for(let the_value of temp_default_value){
							jQuery(this).children('option[value="'+
								jQuery.escapeSelector(the_value)+
							'"]').attr('selected','selected');
						}
					}
				}
			}
		);
		get_jqobject.find(
			'input[type="radio"][name][name!=""][component_type="input_radio"],'+
			'input[type="checkbox"][name][name!=""][component_type="input_checkbox"]'
		).each(
			function(){
				var the_input_name=jQuery(this).attr('name');
				var temp_default_value=default_value_source[the_input_name];
				var temp_environment_data=environment_data_source[the_input_name];
				var the_component_type=jQuery(this).attr('component_type');
				
				
				
				if( the_component_type==='input_radio' ){
					if( bill_core.global_typeof(temp_default_value)==='string' ){
				
						if(jQuery(this).attr('value')==temp_default_value){
							jQuery(this).attr('checked','checked');
						}else{
							jQuery(this).removeAttr('checked');
						}
					}
				}
				else if( the_component_type==='input_checkbox' ){
					if( bill_core.global_typeof(temp_default_value)==='string' ){
				
						let temp_array=bill_core.string_multivalue_to_array(temp_default_value);
						
						if(jQuery.inArray(  jQuery(this).attr('value'), temp_array )!==-1){
							jQuery(this).attr('checked','checked');
						}else{
							jQuery(this).removeAttr('checked');
						}
						
					}else if(bill_core.global_typeof(temp_default_value)==='array_object'){
						if(jQuery.inArray(  jQuery(this).attr('value'), temp_default_value )!==-1){
							jQuery(this).attr('checked','checked');
						}else{
							jQuery(this).removeAttr('checked');
						}
					}
				}
				
			}
		);
		
		//再處理特殊元件
		get_jqobject.find(
			'[name][name!=""][component_type="display_info"],'+
			'div[name][name!=""][component_type="bill_checkboxs_group"],'+
			'div[name][name!=""][component_type="bill_radios_group"],'+
			'input[type="text"][name][name!=""][component_type="dynDateTime"],'+
			'div[name][name!=""][component_type="bill_datetimepicker"],'+
			'div[name][name!=""][component_type="bill_taiwan_address"],'+
			'div[name][name!=""][component_type="bill_file_upload"],'+
			'div[name][name!=""][component_type="bill_file_immediate_upload"],'+
			'div[name][name!=""][component_type="bill_video_url"],'+
			'div[name][name!=""][component_type="bill_multirow_column"],'+
			'textarea[name][name!=""][component_type="ckeditor"],'+
			'[name][name!=""][component_type="bill_select_relateds"],'+
			'[name][name!=""][component_type="bill_pic_crop"]'
		).each(
			function(){
				var the_input_name=jQuery(this).attr('name');
				
				var the_input_id=jQuery(this).attr('id');
				if( bill_core.string_is_solid(the_input_id)==='1' ){
				}else{
					if( bill_core.string_is_solid(container_id)==='1' ){
						jQuery(this).attr('id',container_id+'_'+the_input_name);
					}else{
						the_input_id='components_container_'+bill_core.string_random_word(7,'');
						jQuery(this).attr('id',the_input_id);
					}
				}
				the_input_id=jQuery(this).attr('id');
				
				var temp_default_value=default_value_source[the_input_name];
				var temp_environment_data=environment_data_source[the_input_name];
				var the_component_type=jQuery(this).attr('component_type');
				
				if(the_component_type=='display_info'){
					if(bill_core.global_typeof(temp_default_value)==='string'){
						jQuery(this).html(temp_default_value);
					}
				}
				else if(the_component_type=='bill_checkboxs_group'){
					
					var temp_opts={
						'input_name':the_input_name
					};
					if( 
						bill_core.global_typeof(temp_environment_data)==='string' ||
						bill_core.global_typeof(temp_environment_data)==='array_object'
					){
						temp_opts['environment_data']=temp_environment_data;
					}
					if( 
						bill_core.global_typeof(temp_default_value)==='string' ||
						bill_core.global_typeof(temp_default_value)==='array_object'
					){
						temp_opts['default_value']=temp_default_value;
					}
					
					var temp_string=jQuery(this).attr('counts_width');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['counts_width']=parseInt(temp_string,10);
					}
					
					var temp_string=jQuery(this).attr('layout_type');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['layout_type']=temp_string;
					}
					
					jQuery(this).bill_checkboxs_group(
						temp_opts
					);
				}
				else if(the_component_type=='bill_radios_group'){
					var temp_opts={
						'input_name':the_input_name
					};
					if( 
						bill_core.global_typeof(temp_environment_data)==='string' ||
						bill_core.global_typeof(temp_environment_data)==='array_object'
					){
						temp_opts['environment_data']=temp_environment_data;
					}
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						temp_opts['default_value']=temp_default_value;
					}
					
					var temp_string=jQuery(this).attr('counts_width');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['counts_width']=parseInt(temp_string,10);
					}
					
					jQuery(this).bill_radios_group(
						temp_opts
					);
				}
				else if(the_component_type=='dynDateTime'){
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						temp_default_value=bill_core.datetimebigint_toFormattedString(temp_default_value,'Y-m-d');
					}else{
						temp_default_value=bill_core.datetimebigint_toFormattedString(
							bill_core.datetimebigint_now('0','0','0'),
							'Y-m-d'
						);
					}
					var now_year=new Date().getFullYear();
					var range=[];
					var range_start_year;
					var temp_string=jQuery(this).attr('years_before_now');
					if( bill_core.global_typeof(temp_string)==='string' ){
						range_start_year=now_year-parseInt(temp_string,10);
					}
					
					var range_end_year;
					temp_string=jQuery(this).attr('years_after_now');
					if( bill_core.global_typeof(temp_string)==='string' ){
						range_end_year=now_year+parseInt(temp_string,10);
					}
					
					if( bill_core.number_is_solid(range_start_year)==='1' ){
						range.push(range_start_year);
					}else{
						range.push(now_year)
					}
					
					if( bill_core.number_is_solid(range_end_year)==='1' ){
						range.push(range_end_year);
					}else{
						range.push(now_year)
					}
					
					
					var ifFormat='%Y-%m-%d';
					
					var final_opts={
						'firstDay':0,
						'align':null,
						'date':temp_default_value,
						'ifFormat': ifFormat
					}
					if( range_start_year===undefined && range_end_year===undefined ){
						
					}else{
						final_opts['range']=range;
					}
					jQuery(this).dynDateTime(
						final_opts
					);
					
					jQuery(this).attr('value',temp_default_value);
				}
				else if(the_component_type=='bill_datetimepicker'){
					var temp_opts={
						'input_name':the_input_name
					};
					
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						temp_opts['default_value']=temp_default_value;
					}
					
					var temp_string=jQuery(this).attr('years_before_now');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['years_before_now']=temp_string;
					}
					
					temp_string=jQuery(this).attr('years_after_now');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['years_after_now']=temp_string;
					}
					
					temp_string=jQuery(this).attr('is_show_year');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['is_show_year']=temp_string;
					}
					
					temp_string=jQuery(this).attr('is_show_month');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['is_show_month']=temp_string;
					}
					
					temp_string=jQuery(this).attr('is_show_day');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['is_show_day']=temp_string;
					}
					
					temp_string=jQuery(this).attr('is_show_hour');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['is_show_hour']=temp_string;
					}
					
					temp_string=jQuery(this).attr('is_show_minute');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['is_show_minute']=temp_string;
					}
					
					temp_string=jQuery(this).attr('is_show_second');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['is_show_second']=temp_string;
					}
					
					temp_string=jQuery(this).attr('is_required');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['is_required']=temp_string;
					}
					
					jQuery(this).bill_datetimepicker(
						temp_opts
					);
				}
				else if(the_component_type=='bill_taiwan_address'){
							
					var temp_opts={
						'input_name':the_input_name
					};
					if( bill_core.global_typeof(temp_default_value)==='pure_object' ){
						temp_opts['default_value']=temp_default_value;
					}
					
					var temp_string=jQuery(this).attr('type');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['type']=temp_string;
					}
					
					temp_string=jQuery(this).attr('is_required');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['is_required']=temp_string;
					}
					
					temp_string=jQuery(this).attr('limit_citys');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['limit_citys']=temp_string.split(',');
					}
					
					temp_string=jQuery(this).attr('container_style_attr_value');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['container_style_attr_value']=temp_string;
					}
					
					temp_string=jQuery(this).attr('city_input_class_attr_value');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['city_input_class_attr_value']=temp_string;
					}
					
					temp_string=jQuery(this).attr('city_input_style_attr_value');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['city_input_style_attr_value']=temp_string;
					}
					
					temp_string=jQuery(this).attr('city_input_error_msg_1_attr_value');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['city_input_error_msg_1_attr_value']=temp_string;
					}
					
					temp_string=jQuery(this).attr('city_input_human_read_name_attr_value');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['city_input_human_read_name_attr_value']=temp_string;
					}
					
					temp_string=jQuery(this).attr('area_input_class_attr_value');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['area_input_class_attr_value']=temp_string;
					}
					
					temp_string=jQuery(this).attr('area_input_style_attr_value');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['area_input_style_attr_value']=temp_string;
					}
					
					temp_string=jQuery(this).attr('area_input_error_msg_1_attr_value');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['area_input_error_msg_1_attr_value']=temp_string;
					}
					
					temp_string=jQuery(this).attr('area_input_human_read_name_attr_value');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['area_input_human_read_name_attr_value']=temp_string;
					}
					
					jQuery(this).bill_taiwan_address(
						temp_opts
					);
				}
				else if(the_component_type=='bill_file_upload'){
					var temp_opts={
						'input_name':the_input_name
					};
					
					if( 
						bill_core.string_is_solid(temp_default_value)==='1' || 
						bill_core.global_typeof(temp_default_value)==='array_object'
					){
						
						temp_opts['default_value']=temp_default_value;
					}					
					
					var temp_string='';
					
					temp_string=jQuery(this).attr('file_type');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['file_type']=temp_string;
					}
					
					temp_string=jQuery(this).attr('layout_type');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['layout_type']=temp_string;
					}
					
					
					temp_string=jQuery(this).attr('preview_base_url');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['preview_base_url']=temp_string;
					}
					
					
					temp_string=jQuery(this).attr('is_required');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['is_required']=temp_string;
					}
					
					temp_string=jQuery(this).attr('white_extensions');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						
						var temp_extensions=temp_string.split(',');
						bill_core.array_keep_solid_string_value( temp_extensions );
						temp_opts['white_extensions']=temp_extensions;
						
					}
					
					temp_string=jQuery(this).attr('error_msg_1');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['error_msg_1']=temp_string;
					}
					
					temp_string=jQuery(this).attr('human_read_name');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['human_read_name']=temp_string;
					}
					
					temp_string=jQuery(this).attr('file_tip');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['file_tip']=temp_string;
					}
					
					
					temp_string=jQuery(this).attr('preview_width');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['preview_width']=parseInt(temp_string,10);
					}
					
					temp_string=jQuery(this).attr('preview_height');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['preview_height']=parseInt(temp_string,10);
					}
					
					temp_string=jQuery(this).attr('button_text_no_choose');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['button_text_no_choose']=temp_string;
					}
					
					temp_string=jQuery(this).attr('button_text_after_choose');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['button_text_after_choose']=temp_string;
					}
					
					jQuery(this).bill_file_upload(
						temp_opts
					);
					
				}
				else if(the_component_type=='bill_file_immediate_upload'){
					var temp_opts={
						'input_name':the_input_name
					};
					var temp_string='';
					
					temp_string=temp_default_value;
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['default_value']=temp_string;
					}
					
					temp_string=jQuery(this).attr('preview_base_url');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['preview_base_url']=temp_string;
					}
					
					temp_string=jQuery(this).attr('file_type');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['file_type']=temp_string;
					}
					
					temp_string=jQuery(this).attr('layout_type');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['layout_type']=temp_string;
					}
					
					temp_string=jQuery(this).attr('process_upload_url');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['process_upload_url']=temp_string;
					}
					
					temp_string=jQuery(this).attr('process_download_url');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['process_download_url']=temp_string;
					}
					
					temp_string=jQuery(this).attr('uploading_icon_url');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['uploading_icon_url']=temp_string;
					}
					
					temp_string=jQuery(this).attr('error_msg_1');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['error_msg_1']=temp_string;
					}
					
					temp_string=jQuery(this).attr('human_read_name');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['human_read_name']=temp_string;
					}
					
					temp_string=jQuery(this).attr('file_tip');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['file_tip']=temp_string;
					}
					
					temp_string=jQuery(this).attr('preview_width');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['preview_width']=parseInt(temp_string,10);
					}
					
					temp_string=jQuery(this).attr('preview_height');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['preview_height']=parseInt(temp_string,10);
					}
					
					temp_string=jQuery(this).attr('output_width');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['output_width']=parseInt(temp_string,10);
					}
					
					temp_string=jQuery(this).attr('output_height');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['output_height']=parseInt(temp_string,10);
					}
					
					temp_string=jQuery(this).attr('is_required');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['is_required']=temp_string;
					}
					
					temp_string=jQuery(this).attr('white_extensions');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						
						var temp_extensions=temp_string.split(',');
						bill_core.array_keep_solid_string_value( temp_extensions );
						temp_opts['white_extensions']=temp_extensions;
						
					}
					
					temp_string=jQuery(this).attr('csrf_token');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['csrf_token']=temp_string;
					}
	
					jQuery(this).bill_file_immediate_upload(
						temp_opts
					);
					
				}
				else if(the_component_type=='bill_video_url'){
					var temp_opts={
						'input_name':the_input_name
					};
					
					
					temp_opts['default_value']=temp_default_value;
					
					
					var temp_string=jQuery(this).attr('platform');
					temp_opts['platform']=temp_string;
					
					
					
					temp_string=jQuery(this).attr('is_required');
					temp_opts['is_required']=temp_string;
					
					temp_string=jQuery(this).attr('error_msg_1');
					temp_opts['error_msg_1']=temp_string;
					
					
					temp_string=jQuery(this).attr('human_read_name');
					temp_opts['human_read_name']=temp_string;
					
					temp_string=jQuery(this).attr('preview_width');
					temp_opts['preview_width']=parseInt(temp_string,10);
					
					
					temp_string=jQuery(this).attr('preview_height');
					temp_opts['preview_height']=parseInt(temp_string,10);
					
					
					jQuery(this).bill_video_url(
						temp_opts
					);
					
				}
				else if(the_component_type=='ckeditor'){
					
					var want_set_ckeditor_config={};
					var final_ckeditor_config={};
					
					var temp_string='';
					temp_string=jQuery(this).attr('editor_custom_config');
					if(bill_core.string_is_solid( temp_string )==='1'){
						want_set_ckeditor_config['customConfig']=temp_string;
					}
					
					temp_string=jQuery(this).attr('editor_contents_css');
					if(bill_core.string_is_solid( temp_string )==='1'){
						want_set_ckeditor_config['contentsCss']=temp_string;
					}
					
					temp_string=jQuery(this).attr('editor_width');
					if(bill_core.string_is_solid( temp_string )==='1'){
						want_set_ckeditor_config['width']=temp_string;
					}
					
					temp_string=jQuery(this).attr('editor_height');
					if(bill_core.string_is_solid( temp_string )==='1'){
						want_set_ckeditor_config['height']=temp_string;
					}
					
					temp_string=jQuery(this).attr('editor_base_href');
					if(bill_core.string_is_solid( temp_string )==='1'){
						want_set_ckeditor_config['baseHref']=temp_string;
					}
					
					jQuery.extend(final_ckeditor_config, jQuery.bill_bridge_ckeditor.defaults,want_set_ckeditor_config  );
					jQuery.bill_bridge_ckeditor.setkcfinder(
						final_ckeditor_config,final_ckeditor_config['baseHref']+'third_party/'
					);
					
					jQuery.bill_bridge_ckeditor.real_objs[the_input_id] = 
					CKEDITOR.replace(the_input_id,final_ckeditor_config);
					jQuery.bill_bridge_ckeditor.real_objs[the_input_id].on("instanceReady", 
						function(event)
						{
							event.editor.setData(temp_default_value);	
							return false;
						},null,null
					);
					
					
					if( 
						bill_core.string_is_solid(jQuery(this).attr('initial_insert_from'))==='1' && 
						(temp_default_value=='' || temp_default_value==undefined )
					){
						
						jQuery.bill_bridge_ckeditor.real_objs[the_input_id].on("instanceReady", 
							function(event)
							{
								if(jQuery('#'+event.listenerData).length>0){
									event.editor.insertHtml(
										jQuery('#'+event.listenerData).html(),'unfiltered_html'
									);
								}
							},null,jQuery(this).attr('initial_insert_from')
						);
						
					}
				}
				else if(the_component_type=='bill_pic_crop'){
					var temp_opts={
						'input_name':the_input_name
					};
					
				
					temp_opts['default_value']=temp_default_value;
					
					
					temp_string=jQuery(this).attr('process_op_url');
					temp_opts['process_op_url']=temp_string;
					
					temp_string=jQuery(this).attr('ingicon_url');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['ingicon_url']=temp_string;
					}
					
					temp_string=jQuery(this).attr('error_msg_1');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['error_msg_1']=temp_string;
					}
					
					temp_string=jQuery(this).attr('human_read_name');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['human_read_name']=temp_string;
					}
					
					temp_string=jQuery(this).attr('pick_file_tip');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['pick_file_tip']=temp_string;
					}
					
					temp_string=jQuery(this).attr('crop_tip');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['crop_tip']=temp_string;
					}
					
					temp_string=jQuery(this).attr('preview_width');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['preview_width']=parseInt(temp_string,10);
					}
					
					
					temp_string=jQuery(this).attr('canvas_width');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['canvas_width']=parseInt(temp_string,10);
					}
					
					temp_string=jQuery(this).attr('output_width');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['output_width']=parseInt(temp_string,10);
					}
					
					temp_string=jQuery(this).attr('output_height');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['output_height']=parseInt(temp_string,10);
					}
					
					temp_string=jQuery(this).attr('is_required');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['is_required']=temp_string;
					}
					
					temp_string=jQuery(this).attr('csrf_token');
					if( bill_core.string_is_solid(temp_string)==='1' ){
						temp_opts['csrf_token']=temp_string;
					}
						
					jQuery(this).bill_pic_crop(
						temp_opts
					);
				}
				else if(the_component_type=='bill_select_relateds'){
					if(temp_default_value===undefined || temp_default_value===null){
						temp_default_value='';
					}							
					jQuery(this).easy_select_relateds(
						{
							'input_name':the_input_name,
							'count_limited':parseInt(jQuery(this).attr('count_limited'),10),
							'dialog_url':jQuery(this).attr('dialog_url'),
							'dialog_type':jQuery(this).attr('dialog_type'),
							'default_value':temp_default_value,
							'environment_data_source':temp_environment_data
						}
					);
				}
				else if(the_component_type=='bill_multirow_column'){
					var temp_opts={
						'column_name':the_input_name
					};
					if( bill_core.global_typeof(temp_environment_data)==='pure_object' ){
						temp_opts['environment_data_source']=temp_environment_data;
					}
					if( bill_core.global_typeof(temp_default_value)==='array_object' ){
						temp_opts['default_value_source']=temp_default_value;
					}else if( bill_core.global_typeof(temp_default_value)==='pure_object' ){
						temp_opts['default_value_source']=Object.values(temp_default_value);
						
					}
					
					var temp_string=jQuery(this).attr('row_template_id');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['row_template_id']=temp_string;
					}
					
					var temp_string=jQuery(this).attr('counts_max');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['counts_max']=parseInt(temp_string,10);
					}
					
					var temp_string=jQuery(this).attr('is_default_one_row');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['is_default_one_row']=temp_string;
					}
					
					var temp_string=jQuery(this).attr('new_row_is_append');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['new_row_is_append']=temp_string;
					}
					
					var temp_string=jQuery(this).attr('is_required');
					if( bill_core.global_typeof(temp_string)==='string' ){
						temp_opts['is_required']=temp_string;
					}
					
					jQuery(this).bill_multirow_column(
						temp_opts
					);
				}
				
			}
		)
		
		return get_jqobject;
	};
})(jQuery,bill_core);