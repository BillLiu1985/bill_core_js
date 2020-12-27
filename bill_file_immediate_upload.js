(function(jQuery,bill_core){
	//一般狀態 _preview,_file_tip,_input,_file_delete_button,
	//上傳檔案中 _preview,_file_tip,_ingicon
	//移除中 _preview,_file_tip,_input,_ingicon
	//一般狀態->移除中
	//移除中->一般狀態
	//一般狀態->上傳檔案中
	//上傳檔案中->一般狀態
	
	//設定屬於bill_file_immediate_upload專屬的元件函式或元件設定預設值
	//op:upload_material,delete_upload
	//有元素負責input 有元素負責save data
	jQuery.bill_file_immediate_upload={
		'defaults':{
			'input_name':'',
			//normal,pic,html5video,flash
			'file_type':'pic',
			'layout_type':'basic',
			'process_upload_url':'',
			'process_download_url':'',
			'uploading_icon_url':'',
			'value_base_url':'',
			'file_tip':'選擇檔案：',
			'preview_width':400,
			'output_width':0,
			'output_height':0,
			'default_value':'',
			'is_required':'0',
			'white_extensions':[],
			'csrf_token':''
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_file_immediate_upload = function(param1,param2){
		
		var get_jqobject=this.filter('div[id]');
		
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			bill_core.debug_console('bill_file_immediate_upload一次只能轉換一個,轉換的元素為賦予id的div','error');
			return;
		}else if(get_jqobject.length==0){
			return;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_bill_file_immediate_upload')!=='1'){
				bill_core.debug_console('請先轉換元素為bill_file_immediate_upload','error');
				return;
			}
		}
		
		//物件方法
		var jqobject_scope_methods={
			'check_is_uploading':function(){
				
				if(
					jQuery('#'+this.attr('id')+'_ingicon').css('display')=='none'
				){
					return '0';
				}else{
					
					return '1';
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
		
		var opts = jQuery.extend( true,{}, jQuery.bill_file_immediate_upload.defaults, want_set_opts );
		get_jqobject.data(opts);
		opts=get_jqobject.data();
		
		var component_id=get_jqobject.attr('id');
		
		if( bill_core.string_is_solid(opts.input_name)==='1' ){
		
		}else{
			bill_core.debug_console('bill_file_immediate_upload元件啟動失敗,input_name參數錯誤','error');
			return;
		}
		
		if( 
			bill_core.number_is_solid(opts.preview_width)==='1' &&
			opts.preview_width>0
		){
		}else{
			bill_core.debug_console('bill_file_immediate_upload元件啟動失敗,preview_width參數錯誤','error');
			return;
		}
		
		
		if( jQuery.inArray(opts.file_type,['normal','pic','html5video','flash'])===-1 ){
			bill_core.debug_console('bill_file_immediate_upload元件啟動失敗,file_type參數錯誤','error');
			return;
		}
		if( bill_core.global_typeof(opts.white_extensions)==='object' ){
		
		}else{
			bill_core.debug_console('bill_file_upload元件啟動失敗,white_extensions參數錯誤','error');
			return;
		}
		
		
		if(get_jqobject.attr('is_transformed_to_bill_file_immediate_upload')!=='1'){
			

			var final_component_html='';
			final_component_html+=
			'<div id="'+component_id+'_preview">';
			if(opts.layout_type==='basic'){
				if(opts.file_type=='normal'){
				
					if( 
						bill_core.string_is_solid(opts.process_download_url)==='1' &&
						bill_core.string_is_solid(opts.default_value)==='1'
					){
						final_component_html+=
						'<a href="'+opts.process_download_url+'?obj_id='+encodeURIComponent(opts.default_value)+'">下載檔案</a>';
					}else{
						final_component_html+=
						'<a>下載檔案</a>';
					}
					
				}else if(opts.file_type=='pic'){
					var temp_style_string='';
					if( 
						bill_core.number_is_solid(opts.preview_width)==='1' &&
						opts.preview_width>0
					){
						temp_style_string+='width:'+opts.preview_width+'px;';
					}
					
					
					if(temp_style_string!=''){
						temp_style_string='style="'+temp_style_string+'"';
					}
					if( bill_core.string_is_solid(opts.default_value)==='1'){
						
						final_component_html+=
						'<img border="0" '+temp_style_string+' src="'+
						opts.value_base_url+opts.default_value+'" />';
					}
					else{
						final_component_html+=
						'<img border="0" '+temp_style_string+'  />';
					}
					
				}else if(opts.file_type=='html5video'){
					
					var temp_style_string='';
					if( 
						bill_core.number_is_solid(opts.preview_width)==='1' &&
						opts.preview_width>0
					){
						temp_style_string+='width:'+opts.preview_width+'px;';
					}
					
					if(temp_style_string!=''){
						temp_style_string='style="'+temp_style_string+'"';
					}
					if( bill_core.string_is_solid(opts.default_value)==='1'){
						var temp_mime='';
						var temp_extension=bill_core.file_fetch_extension(opts.default_value);
						if(temp_extension=='ogv'){
							temp_mime='video/ogg';
						}else{
							temp_mime='video/'+temp_extension;
						}
						final_component_html+=
						'<video '+temp_style_string+'  controls="controls">'+
							'<source src="'+opts.value_base_url+opts.default_value+'" type="'+temp_mime+'" />'+
							'Your browser does not support the video tag.'+
						'</video>';
					}
					else{
						final_component_html+=
						'<video '+temp_style_string+' controls="controls">'+
							'<source type="video/mp4"  />'+
						'</video>';
					}
				}
				else if(opts.file_type=='flash'){

					if( bill_core.string_is_solid(opts.default_value)==='1'){
						
						
						var temp_attrs_string=' wmode="opaque" ';
						if( 
							bill_core.number_is_solid(opts.preview_width)==='1' &&
							opts.preview_width>0
						){
							temp_attrs_string+=' width="'+opts.preview_width+'" ';
						}
						else{
							temp_attrs_string+=' width="600" ';
						}
						
						
						final_component_html+=
						'<embed src="'+opts.value_base_url+opts.default_value+'" '+temp_attrs_string+'  ></embed>';
					
					}
					else{
						final_component_html+=
						'<embed  '+temp_attrs_string+' wmode="opaque" ></embed>';
					}						

				}
			}else if(opts.layout_type==='haiduau'){
				if(opts.file_type=='pic'){
					if( bill_core.string_is_solid(opts.default_value)==='1'){
						final_component_html+=
						'<img class="img-account-profile  mb-2" src="'+opts.value_base_url+opts.default_value+'" alt="" />';
					}
					else{
						final_component_html+=
						'<img class="img-account-profile  mb-2" alt="" />';
					}
				}
			}
			final_component_html+=
			'</div>';
			var reg_1_string='';
			if(
				bill_core.global_typeof(opts.white_extensions.length)==='number' && 
				opts.white_extensions.length>0 
			){
				var temp_reg_parts=[];
				for(var kindex in opts.white_extensions){
					var the_white_extension=opts.white_extensions[kindex];
					var temp_reg_string='(\\.';
					var temp_chars=the_white_extension.split('');
					for(var kkindex in temp_chars){
						var temp_char=temp_chars[kkindex];
						temp_reg_string+='['+temp_char.toLowerCase()+temp_char.toUpperCase()+']';
					}
					temp_reg_string+='$)';
					temp_reg_parts.push(temp_reg_string);
				}
				if(opts.is_required=='1'){
					
				}else{
					temp_reg_parts.push('(^$)');
				}
				reg_1_string=temp_reg_parts.join('|');
			}
			else{
				if(opts.is_required=='1'){
					reg_1_string='rrequired';
				}else{
					reg_1_string='orequired';
				}
			}
			
			//draw csrf_token
			if(opts.layout_type==='basic'){
				//draw file_tip
				if( bill_core.global_typeof(opts.file_tip)==='string' ){
					final_component_html+=
					'<span id="'+component_id+'_file_tip">'+opts.file_tip+'</span>';
				}
				//draw input
				final_component_html+=
				'<input type="file" maxlength="255" size="50" id="'+component_id+'_input" name="input_file" reg_1="'+reg_1_string+'" />';  
		
				
				//draw file_delete_button
				
				final_component_html+=
				'<input type="button" value="移除" style="margin-right:10px;" '+
				'id="'+component_id+'_file_delete_button" />';
			}else if(opts.layout_type==='haiduau'){
				if( bill_core.global_typeof(opts.file_tip)==='string' ){
					final_component_html+=
					'<div class="small  text-muted mb-4" id="'+component_id+'_file_tip">'+opts.file_tip+'</div>';
				}
				final_component_html+=
				'<a id="'+component_id+'_input_wrapper" href="javascript:void(0);" class="btn btn-primary file">Upload new image'+
					'<input type="file" id="'+component_id+'_input" name="input_file" reg_1="'+reg_1_string+'" />'+
				'</a>';
				
				final_component_html+=
				'<a href="javascript:void(0);" id="'+component_id+'_file_delete_button" >移除</a>';
			}
		
			//draw uploading icon
			final_component_html+=
			'<img border="0" src="'+opts.uploading_icon_url+'"' +
			'style="display:none;vertical-align:middle;float:right"'+ 
			'id="'+component_id+'_ingicon">';
			
			//draw savedata element
			
			final_component_html+=
			'<input type="hidden" value=""  id="'+component_id+'_tmpfile_uploadfile_id" />'+
			'<input type="hidden" value="DO_NO" id="'+component_id+'_op" name="'+opts.input_name+'_op" />'+
			'<input type="hidden" value="" id="'+component_id+'_data" name="'+opts.input_name+'" reg_1="'+reg_1_string+'" />';
				
			get_jqobject.html(final_component_html);
			
			//draw form_for_upload
			var temp_string=
			'<form style="display:none" target="'+component_id+'_iframe" '+
				'action="'+opts.process_upload_url+'?page_func=upload_material" method="post" enctype="multipart/form-data"'+
				'id="'+component_id+'_form">'+
					'<input type="hidden" name="updated_column_name" value="'+
					opts.input_name
					+'" >'+
					'<input type="hidden" name="component_id" value="'+component_id+'" >'+
					'<input type="hidden" name="tmpfile_uploadfile_id" value="" />'+
					'<input type="hidden" name="output_width" value="'+opts.output_width+'" />'+
					'<input type="hidden" name="output_height" value="'+opts.output_height+'" />'+
					'<input type="hidden" name="file_type" value="'+opts.file_type+'" />'+
					'<input type="hidden" name="_token" value="'+opts.csrf_token+'" />'+
			'</form>'+
			'<iframe name="'+component_id+'_iframe" width="0" height="0" style="display:none" ></iframe>'
			;
			jQuery('body').append(temp_string);
			//bind element event_handler
			jQuery('#'+component_id+'_input').change(
				{
					'component_id':component_id,
					'opts':opts
				},
				function(the_event){
					
					if(bill_core.validate_string(jQuery(this).attr('reg_1'),jQuery(this).val())==='0'){
						jQuery(this).val('');
						alert('檔案格式錯誤');
						return;
					}
					if(this.files[0]===undefined){
						//jQuery("#"+the_event.data.component_id+"_file_delete_button").click();
						return;
					}
					
					jQuery("#"+the_event.data.component_id+"_file_delete_button").hide();
					jQuery("#"+the_event.data.component_id+"_ingicon").show();
					if(opts.layout_type==='basic'){
						jQuery(this).appendTo(jQuery("#"+the_event.data.component_id+"_form"));
					}else if(opts.layout_type==='haiduau'){
						jQuery(this).parent().hide();
						jQuery(this).appendTo(jQuery("#"+the_event.data.component_id+"_form"));
					}
					
					jQuery("#"+the_event.data.component_id+"_form").submit();
				}
			)
			jQuery('#'+component_id+'_file_delete_button').click(
				{
					'component_id':component_id,
					'opts':opts
				},
				function(the_event){
					if(the_event.data.opts.file_type=='normal'){
						if(
							bill_core.string_is_solid(
								jQuery('#'+the_event.data.component_id+'_preview'+'>a').attr('href')
							)==='0'
						
						){
							alert('無檔案可移除');
							return;
						}
					}else if(the_event.data.opts.file_type=='pic'){
						if(
							bill_core.string_is_solid(
								jQuery('#'+the_event.data.component_id+'_preview'+'>img').attr('src')
							)==='0'
						){
							alert('無檔案可移除');
							return;
						}
					}else if(the_event.data.opts.file_type=='html5video'){
						if(
							bill_core.string_is_solid(
								jQuery('#'+the_event.data.component_id+'_preview'+'>video>source').attr('src')
							)==='0'
						){
							alert('無檔案可移除');
							return;
						}
					}else if(the_event.data.opts.file_type=='flash'){
						if(
							bill_core.string_is_solid(
								jQuery('#'+the_event.data.component_id+'_preview'+'>embed').attr('src')
							)==='0'
						){
							alert('無檔案可移除');
							return;
						}
					}

					
					jQuery(this).hide();
					jQuery("#"+the_event.data.component_id+"_ingicon").show();
					
					var about_info={
						'updated_column_name':the_event.data.opts.input_name,
						'tmpfile_uploadfile_id':jQuery("#"+the_event.data.component_id+"_tmpfile_uploadfile_id").val(),
						'_token':the_event.data.opts.csrf_token,
						'component_id':the_event.data.component_id
					};
					//destination_url、post_data、request_success_handler、request_fail_handler
							//destination_url、post_data、request_success_handler、request_fail_handler、is_sync
							//destination_url、post_data、request_success_handler、request_fail_handler、is_sync、context
					bill_core.ajax_post(
						the_event.data.opts.process_upload_url+'?ajax_func=delete_upload',
						about_info,
						function(data,textStatus,jqXHR){
							if(data.code=='1'){
								jQuery("#"+component_id+'_input').val('');
								
								if(bill_core.string_is_solid(opts.default_value)==='1'){
									jQuery("#"+component_id+'_op').val('DO_DELETE');
								}else{
									jQuery("#"+component_id+'_op').val('DO_NO');
								}
								jQuery("#"+component_id+'_tmpfile_uploadfile_id').val('');
								jQuery("#"+component_id+'_data').val('');
								
								var preview_html='';
								if(opts.file_type=='normal'){
									jQuery("#"+component_id+'_preview>a').removeAttr('src');
								}else if(opts.file_type=='pic'){
									jQuery("#"+component_id+'_preview>img').removeAttr('src');										
								}else if(opts.file_type=='video'){
									jQuery("#"+component_id+'_preview>video>source').removeAttr('src');	
									jQuery("#"+component_id+'_preview>video')[0].load();			
								}else if(opts.file_type=='flash'){
									jQuery("#"+component_id+'_preview>embed').removeAttr('src');
								
								}
								
							}else{
								alert(data.message);
							}
							jQuery("#"+component_id+'_ingicon').hide();
							jQuery(this).show();
						},
						function(jqXHR,textStatus,errorThrown ){
							
							alert(
								'Ajax request 錯誤'
							);
							
							/*
							alert(
								'textStatus：'+textStatus+'\n'+
								'errorThrown：'+errorThrown+'\n'+
								'responseText：'+jqXHR.responseText
							);
							*/
							jQuery("#"+component_id+'_ingicon').hide();
							jQuery(this).show();
						},
						'1',
						this
					);
				}
			)
			
			window[component_id+'_upload_material_callback']=function(about_info){
				if(bill_core.global_typeof(about_info)!=='object'){
					bill_core.debug_console('about_info參數錯誤','error');
					return;
				}
				if(about_info['code']==='1'){
					
					if(opts.file_type=='normal'){
						
						if( bill_core.string_is_solid(opts.process_download_url)==='1'){
							jQuery("#"+component_id+"_preview>a").attr(
								'href',
								opts.process_download_url+'?obj_id='+
								encodeURIComponent(about_info['tmpfile_uploadfile_id'])
							);
						}else{
							jQuery("#"+component_id+"_preview>a").removeAttr('href');
						}
					}else if(opts.file_type=='pic'){
						
						
						if( bill_core.string_is_solid(about_info['tmpfile_uploadfile_id'])==='1'){
							jQuery("#"+component_id+"_preview>img").attr(
								'src',
								opts.value_base_url+about_info['tmpfile_uploadfile_id']+'?rnd='+new Date().getTime()
							);
						}
						else{
							jQuery("#"+component_id+"_preview>img").removeAttr('src');
						}
						
						
					}else if(opts.file_type=='html5video'){
					
						if( bill_core.string_is_solid(about_info['tmpfile_uploadfile_id'])==='1'){
							var temp_mime='';
							var temp_extension=bill_core.file_fetch_extension(about_info['tmpfile_uploadfile_id']);
							if(temp_extension=='ogv'){
								temp_mime='video/ogg';
							}else{
								temp_mime='video/'+temp_extension;
							}
							jQuery("#"+component_id+"_preview>video>source").attr(
								'src',
								opts.value_base_url+about_info['tmpfile_uploadfile_id']+'?rnd='+new Date().getTime()
							);
							jQuery("#"+component_id+"_preview>video>source").attr(
								'type',
								temp_mime
							);
						}
						else{
							jQuery("#"+component_id+"_preview>video>source").removeAttr('src');	
						}
						jQuery("#"+component_id+'_preview>video')[0].load();
					}
					else if(opts.file_type=='flash'){
						
						if( bill_core.string_is_solid(about_info['tmpfile_uploadfile_id'])==='1'){
							
							
							jQuery("#"+component_id+"_preview>embed").attr(
								'src',
								opts.value_base_url+about_info['tmpfile_uploadfile_id']+'?rnd='+new Date().getTime()
							);
						}
						else{
							jQuery("#"+component_id+"_preview>embed").removeAttr('src');	
						}
							
					}
					
					if(bill_core.string_is_solid(opts.default_value)==='1'){
						jQuery("#"+component_id+'_op').val('DO_MODIFY');
					}else{
						jQuery("#"+component_id+'_op').val('DO_ADD');
					}
			
					jQuery("#"+component_id+"_form>[name='tmpfile_uploadfile_id']").val(about_info['tmpfile_uploadfile_id']);
					jQuery("#"+component_id+"_tmpfile_uploadfile_id").val(about_info['tmpfile_uploadfile_id']);
					jQuery("#"+component_id+"_data").val(about_info['tmpfile_uploadfile_id']);

					jQuery('#'+component_id+'_input').val('');
				}else{
					alert(about_info['message']);	
				}
				if(opts.layout_type==='basic'){
					jQuery('#'+component_id+'_input').insertAfter(jQuery('#'+component_id+"_file_tip"));	
				}else if(opts.layout_type==='haiduau'){
					jQuery('#'+component_id+'_input').appendTo(jQuery('#'+component_id+"_input_wrapper"));
					jQuery('#'+component_id+'_input_wrapper').show();
				}
				
				jQuery('#'+component_id+'_ingicon').hide();
				jQuery("#"+component_id+'_file_delete_button').show();
			}
			get_jqobject.attr('is_transformed_to_bill_file_immediate_upload','1');	
		}
		
		return get_jqobject;
	};
}(jQuery,bill_core));

