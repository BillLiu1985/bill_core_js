(function(jQuery,bill_core){
	
	
	//設定屬於easy_multirow_column專屬的元件函式或元件設定預設值
	jQuery.bill_multirow_column={
		'defaults':{
			'column_name':'',
			'row_template_container_id':'',
			'counts_max':10,
			'is_default_one_row':'1',
			'delete_row_button_text':'刪除',
			'add_row_button_text':'新增一筆',
			'delete_all_rows_button_text':'刪除全部',
			'new_row_is_append':'1',
			'after_row_load_func':function(the_row_data){},
			'before_row_delete_func':function(the_row_data){},
			'next_row_index':0,
			'default_value_source':[],
			'environment_data_source':{}
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_multirow_column = function(param1,param2){
		
		var get_jqobject=this.filter('div[id]');
		
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			bill_core.debug_console('bill_multirow_column一次只能轉換一個,轉換的元素為賦予id的div');
			return;
		}else if(get_jqobject.length==0){
			return;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if( get_jqobject.attr('is_transformed_to_bill_multirow_column')!=='1' ){
				bill_core.debug_console('請先轉換元素為bill_multirow_column','error');
				return;
			}
		}
		
		//物件方法
		/*
			the_row_data={
				//add or modify
				'row_type':'add',
				'row_index':'0',
				'column_name_1':'column_value_1',
				'column_name_2':'column_value_2',
				......
			}
		*/
		var jqobject_scope_methods={
			'draw_row':function(the_row_data,is_for_add_row_button){	
				
				var opts=this.data();
				var environment_data_source=opts.environment_data_source;
				var component_container_id=this.attr('id');
				var the_row_index=the_row_data['row_index'];
				
				var the_row_id=component_container_id+'_row_'+the_row_index;	
				
				var temp_jqobject=jQuery('#'+opts.row_template_container_id).clone();
				temp_jqobject.attr('id',the_row_id);
				temp_jqobject.show();
				temp_jqobject.find(
					'input[type="text"][name],'+
					'input[type="radio"][name],'+
					'input[type="checkbox"][name],'+
					'input[type="hidden"][name],'+
					'textarea[name],'+
					'select[name],'+
					'div[name]'
				).each(
					function(){
						var original_input_name=jQuery(this).attr('name');
						
						jQuery(this).attr(
							'id',
							the_row_id+'_'+original_input_name
						);
						jQuery(this).attr(
							'name',
							opts.column_name+'['+the_row_index+']['+original_input_name+']');
					}
				);
				
				temp_jqobject.append(
					'&nbsp;&nbsp;&nbsp;'+
					'<input type="button" '+
					'id="'+the_row_id+'_delete_row_button" value="'+opts.delete_row_button_text+'" />'+
					'<hr />'
				);
				if(is_for_add_row_button==='1'){
					if(opts.new_row_is_append==='1'){
						this.append(bill_core.jquery_outer_html(temp_jqobject));
					}else{
						jQuery(bill_core.jquery_outer_html(temp_jqobject)).insertAfter('#'+component_container_id+'_rows_datum');
					}
				}else{
					this.append(bill_core.jquery_outer_html(temp_jqobject));
				}
				jQuery('#'+the_row_id+'_delete_row_button').click(
					function(){
						jQuery(this).parent().remove();
					}
				)
				
				//先處理一般元件
				this.find(
					'input[type="text"][component_type="input_text"],'+
					'input[type="text"][component_type="input_text_number"],'+
					'input[type="radio"][component_type="input_radio"],'+
					'input[type="checkbox"][component_type="input_checkbox"],'+
					'input[type="hidden"][component_type="input_hidden"],'+
					'textarea[component_type="textarea"],'+
					'select[component_type="select"]'
				).each(
					function(){
						var the_input_name=jQuery(this).attr('name');
						var original_input_name=
						bill_core.string_fetch_specific(
							the_input_name,opts.column_name+'['+the_row_index+'][',']'
						);
						var temp_default_value=the_row_data[original_input_name];
						var temp_environment_data=environment_data_source[original_input_name];
						
						var the_component_type=jQuery(this).attr('component_type');
						
						if( the_component_type==='input_text' ){
							if( bill_core.global_typeof(temp_default_value)==='string' ){
								temp_default_value=jQuery('<div></div>').html(temp_default_value).text();
								jQuery(this).attr('value',temp_default_value);
							}
							if( bill_core.global_typeof($(this).attr('illegal_reg'))==='string' ){
								jQuery(this).keyup(
									function(event){
										$(this).val(
											bill_core.validate_remove_illegal($(this).attr('illegal_reg'),$(this).val())
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
								temp_default_value=jQuery('<div></div>').html(temp_default_value).text();
								jQuery(this).attr('value',temp_default_value);
							}
							
							jQuery(this).keyup(
									function(event){
										$(this).val(
											bill_core.validate_remove_illegal('inumber',$(this).val())
										);
									}
								)
							
						}
						else if( the_component_type==='input_hidden' ){
							if( bill_core.global_typeof(temp_default_value)==='string' ){
								temp_default_value=jQuery('<div></div>').html(temp_default_value).text();
								jQuery(this).attr('value',temp_default_value);
							}
						}
						else if( the_component_type==='input_radio' ){
							if( bill_core.global_typeof(temp_default_value)==='string' ){
								temp_default_value=jQuery('<div></div>').html(temp_default_value).text();
								if(jQuery(this).attr('value')==temp_default_value){
									jQuery(this).attr('checked',true);
								}else{
									jQuery(this).attr('checked',false);
								}
							}
						}
						else if( the_component_type==='input_checkbox' ){
							if( bill_core.global_typeof(temp_default_value)==='string' ){
								temp_default_value=jQuery('<div></div>').html(temp_default_value).text();
								var temp_array=temp_default_value.split(',,,');
								
								if(jQuery.inArray(  jQuery(this).attr('value'), temp_array )!==-1){
									jQuery(this).attr('checked',true);
								}else{
									jQuery(this).attr('checked',false);
								}
								
							}
						}
						else if( the_component_type==='textarea' ){
							if( bill_core.global_typeof(temp_default_value)==='string' ){
								jQuery(this).html( temp_default_value.replace(/<br \/>/g,"\n") );
							}
						}
						else if( the_component_type==='select' ){
							if( bill_core.global_typeof(temp_default_value)==='string' ){
								temp_default_value=$('<div></div>').html(temp_default_value).text();
							}
							var the_options=temp_environment_data;
							//the_options Ex:
							//[{'value':'value_1','text':'text_1'},{'value':'value_2','text':'text_2'},{'value':'value_3','text':'text_3'}...]
							if( bill_core.global_typeof(the_options)==='object' ){
								var temp_html='';
								for(var kindex in the_options){
									var the_option=the_options[kindex];
									temp_html+=
										'<option '+
										(the_option['value']===temp_default_value?'selected="selected" ':'')+
										'value="'+the_option['value']+'" >'+the_option['text']+'</option>';
								}
								jQuery(this).append(temp_html);
							}
							
							if( bill_core.global_typeof(temp_default_value)==='string' ){
								jQuery(this).val(temp_default_value);
							}
						}
					}
				);
				
				
				//再處理特殊元件
				this.find(
					'span[component_type="display_info"],'+
					'div[component_type="bill_checkboxs_group"],'+
					'div[component_type="bill_radios_group"],'+
					'[component_type="dynDateTime"],'+
					'div[component_type="bill_datetimepicker"],'+
					'div[component_type="bill_taiwan_address"],'+
					'div[component_type="bill_file_upload"],'+
					'div[component_type="bill_video_url"],'+
					'textarea[component_type="ckeditor"],'+
					'[component_type="bill_select_relateds"],'+
					'[component_type="bill_pic_crop"]'
				).each(
					function(){
						var the_input_name=jQuery(this).attr('name');
						var original_input_name=
						bill_core.string_fetch_specific(
							the_input_name,opts.column_name+'['+the_row_index+'][',']'
						);
						var temp_default_value=the_row_data[original_input_name];
						var temp_environment_data=environment_data_source[original_input_name];
						var the_component_type=jQuery(this).attr('component_type');					
						var the_element_id=jQuery(this).attr('id');
						
						if(the_component_type=='display_info'){
							if(bill_core.global_typeof(temp_default_value)==='string'){
								jQuery(this).text(temp_default_value);
							}
						}
						else if(the_component_type=='bill_checkboxs_group'){
							
							var temp_opts={
								'input_name':the_input_name
							};
							if( bill_core.global_typeof(temp_environment_data)==='string' ){
								temp_opts['environment_data']=temp_environment_data;
							}
							if( bill_core.global_typeof(temp_default_value)==='string' ){
								temp_opts['default_value']=temp_default_value;
							}
							
							var temp_string=jQuery(this).attr('counts_width');
							if( bill_core.global_typeof(temp_string)==='string' ){
								temp_opts['counts_width']=parseInt(temp_string,10);
							}
							jQuery(this).bill_checkboxs_group(
								temp_opts
							);
						}
						else if(the_component_type=='bill_radios_group'){
							var temp_opts={
								'input_name':the_input_name
							};
							if( bill_core.global_typeof(temp_environment_data)==='string' ){
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
							if(temp_default_value===undefined || temp_default_value===null){
								temp_default_value=global_datebigint_toFormattedString('Y-m-d');
								
							}
							jQuery(this).dynDateTime(
								{
									'firstDay':0,
									'align':null,
									'date':temp_default_value,
									'ifFormat':jQuery(this).attr('ifFormat'),
									'showsTime':JSON.parse(jQuery(this).attr('showsTime')),
									'flat':jQuery(this).attr('flat')
								}
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
							if( bill_core.global_typeof(temp_default_value)==='object' ){
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
								temp_opts['limit_citys']=temp_string.split(',,,');
							}
							jQuery(this).bill_taiwan_address(
								temp_opts
							);
						}
						else if(the_component_type=='bill_file_upload'){
							var temp_opts={
								'input_name':the_input_name
							};
							
						
							temp_opts['default_value']=temp_default_value;
							
							
							var temp_string=jQuery(this).attr('file_type');
							temp_opts['file_type']=temp_string;
							
							
							temp_string=jQuery(this).attr('process_download_url');
							temp_opts['process_download_url']=temp_string;
							
							
							temp_string=jQuery(this).attr('is_required');
							temp_opts['is_required']=temp_string;
							
							
							temp_string=jQuery(this).attr('white_extensions');
							if( bill_core.string_is_solid(temp_string)==='1' ){
								
								var temp_extensions=temp_string.split(',,,');
								bill_core.array_keep_solid_string_value( temp_extensions );
								temp_opts['white_extensions']=temp_extensions;
								
							}
							
							temp_string=jQuery(this).attr('error_msg_1');
							temp_opts['error_msg_1']=temp_string;
							
							
							temp_string=jQuery(this).attr('human_read_name');
							temp_opts['human_read_name']=temp_string;
							
							
							temp_string=jQuery(this).attr('file_tip');
							temp_opts['file_tip']=temp_string;
							
							
							temp_string=jQuery(this).attr('preview_width');
							temp_opts['preview_width']=temp_string;
							
							
							temp_string=jQuery(this).attr('preview_height');
							temp_opts['preview_height']=temp_string;
							
							
							jQuery(this).bill_file_upload(
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
							if( bill_core.global_typeof(temp_default_value)==='string' ){
								jQuery(this).html(CKEDITOR.tools.htmlEncode(temp_default_value));
							}
							var want_set_ckeditor_config={};
							var final_ckeditor_config={};
							if(bill_core.string_is_solid( jQuery(this).attr('editor_custom_config'))==='1'){
								want_set_ckeditor_config['customConfig']=jQuery(this).attr('editor_custom_config');
							}
							if(bill_core.string_is_solid( jQuery(this).attr('editor_contents_css'))==='1'){
								want_set_ckeditor_config['contentsCss']=jQuery(this).attr('editor_contents_css');
							}
							if(bill_core.string_is_solid( jQuery(this).attr('editor_width'))==='1'){
								want_set_ckeditor_config['width']=jQuery(this).attr('editor_width');
							}
							if(bill_core.string_is_solid( jQuery(this).attr('editor_height'))==='1'){
								want_set_ckeditor_config['height']=jQuery(this).attr('editor_height');
							}
							if(bill_core.string_is_solid( jQuery(this).attr('editor_base_href'))==='1'){
								want_set_ckeditor_config['baseHref']=jQuery(this).attr('editor_base_href');
							}
							
							jQuery.extend( true,final_ckeditor_config, jQuery.bill_bridge_ckeditor.defaults,want_set_ckeditor_config  );
							jQuery.bill_bridge_ckeditor.setkcfinder(
								final_ckeditor_config,final_ckeditor_config['baseHref']+'third_party/'
							);
							
							jQuery.bill_bridge_ckeditor.real_objs[the_element_id] = 
							CKEDITOR.replace(the_element_id,final_ckeditor_config);
							jQuery.bill_bridge_ckeditor.real_objs[the_element_id].on("instanceReady", 
								function(event)
								{
									return false;
								},null,null
							);
							
							
							if( 
								bill_core.string_is_solid(jQuery(this).attr('initial_insert_from'))==='1' && 
								(temp_default_value=='' || temp_default_value==undefined )
							){
								
								jQuery.bill_bridge_ckeditor.real_objs[the_element_id].on("instanceReady", 
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
							if(temp_default_value===undefined || temp_default_value===null){
								temp_default_value='';
							}
							var temp_default_newfile=default_value_source[the_input_name+'_newfile'];						
							jQuery(this).easy_pic_crop(
								{
									'input_name':the_input_name,
									'default_value':temp_default_value,
									'process_upload_url':jQuery(this).attr('process_upload_url'),
									'preview_width':parseInt(jQuery(this).attr('preview_width'),10),
									'canvas_width':parseInt(jQuery(this).attr('canvas_width'),10),
									'output_width':parseInt(jQuery(this).attr('output_width'),10),
									'output_height':parseInt(jQuery(this).attr('output_height'),10),
									'uploading_icon_url':jQuery(this).attr('uploading_icon_url'),
									'selecting_icon_url':jQuery(this).attr('selecting_icon_url'),
									'file_tip':jQuery(this).attr('file_tip'),
									'select_tip':jQuery(this).attr('select_tip'),
									'is_required':jQuery(this).attr('is_required'),
									'csrf_token':jQuery(this).attr('csrf_token')
								}
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
						
						
					}
				)
				
				opts.after_row_load_func.call(this,the_row_data);
			}
		};
		
		//若是呼叫物件方法
		if( typeof(param1)=='string' ){
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
		
		var opts = jQuery.extend( true,{}, jQuery.bill_multirow_column.defaults, want_set_opts );
		get_jqobject.data(opts);
		opts=get_jqobject.data();
		
		var component_id=get_jqobject.attr('id');
	
		if( get_jqobject.attr('is_transformed_to_bill_multirow_column')!=='1' ){
			opts.add_row_button_id=component_id+'_add_row_button';
			opts.delete_all_rows_button_id=component_id+'_delete_all_rows_button';
			get_jqobject.append(
				'<div  id="'+component_id+'_op_buttons_area" >'+
					'<input type="button" id="'+opts.add_row_button_id+'" value="'+opts.add_row_button_text+'" />&nbsp;&nbsp;'+
					'<input type="button" id="'+opts.delete_all_rows_button_id+'" value="'+opts.delete_all_rows_button_text+'" />'+
				'</div>'+
				'<hr  id="'+component_id+'_rows_datum" />'
			);
			
			for(var kindex in opts.default_value_source){
				
				var new_row_data=opts.default_value_source[kindex];
				
				new_row_data['row_index']=opts.next_row_index;
				jqobject_scope_methods.draw_row.call(
					get_jqobject,
					new_row_data
				);
				opts.next_row_index++;
			}
			if(opts.default_value_source.length==0){
				if(opts.is_default_one_row==='1'){
					var new_row_data={
						'row_type':'add'
					};
					new_row_data['row_index']=opts.next_row_index;
					jqobject_scope_methods.draw_row.call(
						get_jqobject,
						new_row_data
					);
					opts.next_row_index++;
				}
			}
			jQuery('#'+opts.add_row_button_id).click(
				function(){
					if(opts.counts_max!=0){
						if((opts.next_row_index-1+1)>=opts.counts_max){
							alert('已超過列數上限:'+opts.counts_max);
							return;
						}
					}
					var new_row_data={
						'row_type':'add'
					};
					
					new_row_data['row_index']=opts.next_row_index;
					
					jqobject_scope_methods.draw_row.call(
						get_jqobject,
						new_row_data,
						'1'
					);
					opts.next_row_index++;
				}
			)
			
		
			
			jQuery('#'+opts.delete_all_rows_button_id).click(
				function(){
					jQuery('#'+component_id).find('[id$="_delete_row_button"]').click();
				}
			);
			get_jqobject.attr('is_transformed_to_bill_multirow_column','1');
			
		}
		return get_jqobject;
	};
}(jQuery,bill_core));

