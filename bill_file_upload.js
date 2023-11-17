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
	//設定屬於bill_file_upload專屬的元件函式或元件設定預設值
	jQuery.bill_file_upload={
		'defaults':{
			'preview_base_url':'',
			'input_name':'',
			//normal,pic,html5video,flash
			'file_type':'pic',
			'layout_type':'basic',
			'is_required':'0',
			'white_extensions':[],
			'error_msg_1':'',
			'human_read_name':'',	
			'file_tip':'',
			'preview_width':0,
			'preview_height':0,
			'default_value':'',
			'button_text_no_choose':'檔案上傳',
			'button_text_after_choose':'重新選擇',
			'_value':'',
			'_value_alt':'',
			'_obj_id':'',
			'_column':'',
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_file_upload = function(param1,...other_params){
		
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
			bill_core.debug_console('bill_file_upload一次只能轉換一個元素');
			return return_result;
		}else if(this.length==1){
			if(this.is('div[id]')){
			}else{
				bill_core.debug_console('bill_file_upload轉換的元素必須為賦予id的div');
				return return_result;
			}
		}else if(this.length==0){
			return return_result;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_bill_file_upload')!=='1'){
				bill_core.debug_console('請先轉換元素為bill_file_upload','error');
				return return_result;
			}
			
		}
		
		var get_jqobject=this;
		var component_id=get_jqobject.attr('id');
		if( bill_core.global_typeof(param1)=='pure_object' ){
			
			var want_set_opts=param1;
			
			if( bill_core.string_is_solid(want_set_opts.input_name)==='1' ){
		
			}else{
				bill_core.debug_console('bill_file_upload元件啟動失敗,input_name參數錯誤','error');
				return get_jqobject;
			}
			if( jQuery.inArray(want_set_opts.file_type,['normal','pic','html5video','flash'])===-1 ){
				bill_core.debug_console('bill_file_upload元件啟動失敗,file_type參數錯誤','error');
				return get_jqobject;
			}
			if( bill_core.global_typeof(want_set_opts.white_extensions)==='array_object' ){
			
			}else{
				bill_core.debug_console('bill_file_upload元件啟動失敗,white_extensions參數錯誤','error');
				return get_jqobject;
			}
			
			if( 
				bill_core.global_typeof(want_set_opts.default_value)==='string' ||
				bill_core.global_typeof(want_set_opts.default_value)==='undefined'
			){
				if(bill_core.global_typeof(want_set_opts.default_value)==='undefined'){
					want_set_opts.default_value='';
				}
			}else{
				bill_core.debug_console('bill_file_upload元件啟動失敗,default_value參數錯誤','error');
				return get_jqobject;
			}
			
			{
				let temp_parts=bill_core.string_multivalue_to_array(
					want_set_opts.default_value
				);
			
				if(temp_parts.length===4){
					jQuery.extend( true,want_set_opts,{
						'_value':temp_parts[0],
						'_value_alt':temp_parts[1],
						'_obj_id':temp_parts[2],
						'_column':temp_parts[3],
					})
				}else if(temp_parts.length===2){
					jQuery.extend( true,want_set_opts,{
						'_value':temp_parts[0],
						'_value_alt':temp_parts[1],
					})
				}else if(temp_parts.length===1){
					jQuery.extend( true,want_set_opts,{
						'_value':temp_parts[0],
					})
				}else{
					jQuery.extend( true,want_set_opts,{
						'_value':'',
					})
				}
			}
			
			get_jqobject.data(
				jQuery.extend( true,{}, jQuery.bill_file_upload.defaults, want_set_opts )
			);
			
		}
		var opts=get_jqobject.data();
		
		//物件方法
		var jqobject_private_methods={
			'initial':function(){
				get_jqobject.empty();
				get_jqobject.attr('is_transformed_to_bill_file_upload','1');
				var final_component_html='';
			
				if(opts.layout_type==='basic'){
					final_component_html+=
					'<div id="'+component_id+'_preview">';
					if(opts.file_type=='normal'){
						
						if( 
							bill_core.string_is_solid(opts._value)==='1'
						){
							final_component_html+=
							'<a href="'+opts.preview_base_url+'?obj_id='+encodeURIComponent(opts._value)+'">下載檔案</a>';
						}else{
							final_component_html+=
							'暫無檔案';
						}
						
						
					}
					else if(opts.file_type=='pic'){
							var temp_style_string='';
							if( 
								bill_core.number_is_solid(opts.preview_width)==='1' &&
								opts.preview_width>0
							){
								temp_style_string+='width:'+opts.preview_width+'px;';
							}
							
							
							if( 
								bill_core.number_is_solid(opts.preview_height)==='1' &&
								opts.preview_height>0
							){
								temp_style_string+='height:'+opts.preview_height+'px;';
							}
							
							
							if(temp_style_string!=''){
								temp_style_string='style="'+temp_style_string+'"';
							}
							
							
							if( bill_core.string_is_solid(opts._value)==='1'){
								
								final_component_html+=
								'<img border="0" '+temp_style_string+' src="'+
								opts.preview_base_url+opts._value+'" />';
							}
							else{
								final_component_html+=
								'<img border="0" '+temp_style_string+'  alt="無圖檔"  />';
							}
					}
					else if(opts.file_type=='html5video'){
						var temp_style_string='';
						if( 
							bill_core.number_is_solid(opts.preview_width)==='1' &&
							opts.preview_width>0
						){
							temp_style_string+='width:'+opts.preview_width+'px;';
						}
						
						
						if( 
							bill_core.number_is_solid(opts.preview_height)==='1' &&
							opts.preview_height>0
						){
							temp_style_string+='height:'+opts.preview_height+'px;';
						}
						
						if(temp_style_string!=''){
							temp_style_string='style="'+temp_style_string+'"';
						}
						if( bill_core.string_is_solid(opts._value)==='1'){
							var temp_mime='';
							var temp_extension=bill_core.file_fetch_extension(opts._value);
							if(temp_extension=='ogv'){
								temp_mime='video/ogg';
							}else{
								temp_mime='video/'+temp_extension;
							}
							final_component_html+=
							'<video '+temp_style_string+'  controls="controls">'+
								'<source src="'+opts.preview_base_url+opts._value+'" type="'+temp_mime+'" />'+
								'Your browser does not support the video tag.'+
							'</video>';
						}
						else{
							final_component_html+=
							'<video '+temp_style_string+' controls="controls">'+
								'<source src="" type="video/mp4"  />'+
							'</video>';
						}
					}
					else if(opts.file_type=='flash'){
						if( bill_core.string_is_solid(opts._value)==='1'){
							
							
							var temp_attrs_string=' wmode="opaque" ';
							if( 
								bill_core.number_is_solid(opts.preview_width)==='1' &&
								opts.preview_width>0
							){
								temp_attrs_string+=' width="'+opts.preview_width+'" ';
							}
							
							if( 
								bill_core.number_is_solid(opts.preview_height)==='1' &&
								opts.preview_height>0
							){
								temp_attrs_string+=' height="'+opts.preview_height+'" ';
							}
							
							
							final_component_html+=
							'<embed src="'+opts.preview_base_url+opts._value+'" '+temp_attrs_string+'  ></embed>';
						
						}
						else{
							final_component_html+=
							'暫無檔案';
						}
					}
					final_component_html+=
					'</div>';
				}else if(opts.layout_type==='basic_1'){
					final_component_html+=
					'<div id="'+component_id+'_preview">';
					if(opts.file_type=='normal'){
						
						if( 
						
							bill_core.string_is_solid(opts._value)==='1'
						){
							final_component_html+=
							'<a href="'+opts.preview_base_url+'?obj_id='+encodeURIComponent(opts.obj_id)+'&column='+encodeURIComponent(opts.column)+'">下載檔案</a>';
						}else{
							final_component_html+=
							'暫無檔案';
						}
						
						
					}else if(opts.file_type=='pic'){
							var temp_style_string='';
							if( 
								bill_core.number_is_solid(opts.preview_width)==='1' &&
								opts.preview_width>0
							){
								temp_style_string+='width:'+opts.preview_width+'px;';
							}
							
							
							if( 
								bill_core.number_is_solid(opts.preview_height)==='1' &&
								opts.preview_height>0
							){
								temp_style_string+='height:'+opts.preview_height+'px;';
							}
							
							
							if(temp_style_string!=''){
								temp_style_string='style="'+temp_style_string+'"';
							}
							if( bill_core.string_is_solid(opts._value)==='1'){
								
								final_component_html+=
								'<img border="0" '+temp_style_string+' src="'+
								opts.preview_base_url+'?obj_id='+encodeURIComponent(opts.obj_id)+'&column='+encodeURIComponent(opts.column)+'" />';
							}
							else{
								final_component_html+=
								'<img border="0" '+temp_style_string+'  alt="無圖檔"  />';
							}
					}
					
					final_component_html+=
					'</div>';
				}
				
				//draw input
				var temp_attrs_string='';
				temp_attrs_string+=' id="'+component_id+'_value" ';
				temp_attrs_string+=' name="'+opts.input_name+'" ';
				
				if( 
					opts.white_extensions.length>0 
				){
					var temp_reg_parts=[];
					for(var the_white_extension of opts.white_extensions){
					
						var temp_reg_string='(?:\\.';
						var temp_chars=the_white_extension.split('');
						for(var temp_char of temp_chars){
							temp_reg_string+='['+temp_char.toLowerCase()+temp_char.toUpperCase()+']';
						}
						temp_reg_string+='$)';
						temp_reg_parts.push(temp_reg_string);
					}
					if(opts.is_required=='1'){
						
					}else{
						temp_reg_parts.push('(?:^$)');
					}
					temp_attrs_string+=' reg_1="'+temp_reg_parts.join('|')+'" ';
				}
				else{
					if(opts.is_required=='1'){
						temp_attrs_string+=' reg_1="rrequired" ';
					}else{
						temp_attrs_string+=' reg_1="orequired" ';
					}
				}
				if( bill_core.string_is_solid(opts.error_msg_1)==='1' ){
					temp_attrs_string+=' error_msg_1="'+opts.error_msg_1+'" ';
				}
				if( bill_core.string_is_solid(opts.human_read_name)==='1' ){
					temp_attrs_string+=' human_read_name="'+opts.human_read_name+'" ';
				}
				temp_attrs_string+=' maxlength="255" size="50" ';
				
				if(opts.layout_type==='basic'){
					
					if( bill_core.string_is_solid(opts.file_tip)==='1' ){
						final_component_html+=
						'<span id="'+component_id+'_file_tip">'+opts.file_tip+'</span><br />';
					}
					final_component_html+=
					'<input type="file" '+temp_attrs_string+' value="" />';
					
					if( bill_core.string_is_solid(opts._value)==='1' ){
						final_component_html+=
						'<input type="radio"  name="'+opts.input_name+'_op" value="DO_NO"  />不變'+
						'<input type="radio"  name="'+opts.input_name+'_op" value="DO_MODIFY" />變更';
						if(opts.is_required==='1'){
							
						}else{
							final_component_html+='<input type="radio"  name="'+opts.input_name+'_op" value="DO_DELETE" />刪除';	
						}
					}
					else{
						if(opts.is_required==='1'){
							final_component_html+='<input type="hidden" id="'+component_id+'_op"  name="'+opts.input_name+'_op" value="DO_ADD" />';
						}else{
							final_component_html+='<input type="hidden" id="'+component_id+'_op"  name="'+opts.input_name+'_op" value="DO_NO" />';	
						}
					}
				}else if(opts.layout_type==='basic_1'){
					if( bill_core.string_is_solid(opts.file_tip)==='1' ){
						final_component_html+=
						'<span id="'+component_id+'_file_tip">'+opts.file_tip+'</span>';
					}
					final_component_html+=
					'<input type="file" '+temp_attrs_string+' value="" />';
					
					if( bill_core.string_is_solid(opts._value)==='1' ){
						final_component_html+=
						'<input type="radio"  name="'+opts.input_name+'_op" value="DO_NO"  />不變'+
						'<input type="radio"  name="'+opts.input_name+'_op" value="DO_MODIFY" />變更';
						if(opts.is_required==='1'){
							
						}else{
							final_component_html+='<input type="radio"  name="'+opts.input_name+'_op" value="DO_DELETE" />刪除';	
						}
					}
					else{
						if(opts.is_required==='1'){
							final_component_html+='<input type="hidden" id="'+component_id+'_op"  name="'+opts.input_name+'_op" value="DO_ADD" />';
						}else{
							final_component_html+='<input type="hidden" id="'+component_id+'_op"  name="'+opts.input_name+'_op" value="DO_NO" />';	
						}
					}
				}
				get_jqobject.html(final_component_html);
				
				//bind element event_handler
				get_jqobject.find('input:radio[name="'+opts.input_name+'_op"]').change(
					function(){
						var value_jqobject=jQuery('#'+component_id+'_value');
						var button_text_jqobject=jQuery('#'+component_id+'_button_text');
						
						var value_jqobject_reg_1=value_jqobject.attr('reg_1');

						if( jQuery(this).val()=='DO_NO' ){
							if( bill_core.string_is_start_with(value_jqobject_reg_1,'r')==='1' ){
								value_jqobject.attr(
									'reg_1',value_jqobject_reg_1.replace(/^r/g,'o')
								);
							}
							else if( bill_core.string_is_end_with(value_jqobject_reg_1,'|(?:^$)')==='0' ){
								value_jqobject.attr(
									'reg_1',value_jqobject_reg_1.replace(/$/g,'|(?:^$)')
								);
							}
							value_jqobject.val('');
							button_text_jqobject.html(opts.button_text_no_choose);
						}
						else if( jQuery(this).val()=='DO_MODIFY' ){
							
							if( bill_core.string_is_start_with(value_jqobject_reg_1,'o')==='1' ){
								value_jqobject.attr(
									'reg_1',value_jqobject_reg_1.replace(/^o/g,'r')
								);
							}
							else if( bill_core.string_is_end_with(value_jqobject_reg_1,'|(^$)')==='1' ){
								value_jqobject.attr(
									'reg_1',value_jqobject_reg_1.replace(/\|\(\^\$\)$/g,'')
								);
							}
							button_text_jqobject.html(opts.button_text_after_choose);
						}
						else if( jQuery(this).val()=='DO_DELETE' ){
							
							if( bill_core.string_is_start_with('r',value_jqobject_reg_1)==='1' ){
								
								value_jqobject.attr(
									'reg_1',value_jqobject_reg_1.replace(/^r/g,'o')
								);
							}
							else if( bill_core.string_is_end_with(value_jqobject_reg_1,'|(?:^$)')==='0' ){
								
								value_jqobject.attr(
									'reg_1',value_jqobject_reg_1.replace(/$/g,'|(?:^$)')
								);
							}
							value_jqobject.val('');
							button_text_jqobject.html(opts.button_text_no_choose);
						}
						
					}
				);
				jQuery('#'+component_id+'_value').change(
					function(){
						var button_text_jqobject=jQuery('#'+component_id+'_button_text');	
						if(bill_core.string_is_solid(opts._value)==='1'){
							//有舊檔的情況下
							if($(this).val()===''){
								
							}else{
								jQuery("input:radio[name='"+opts.input_name+"_op'][value='DO_MODIFY']").click();
							}
						}else{
							//無舊檔的情況下
							if(opts.is_required=='1'){
						
							}else{
								if($(this).val()===''){
									button_text_jqobject.html(opts.button_text_no_choose);
									jQuery("#"+component_id+'_op').val('DO_NO');
								}else{
									button_text_jqobject.html(opts.button_text_after_choose);
									jQuery("#"+component_id+'_op').val('DO_ADD');
								}
							}
							
						}
					}
				);
				
				get_jqobject.find('input:radio[name="'+opts.input_name+'_op"][value="DO_NO"]').click();
					
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

