(function(jQuery,bill_core){
	
	//設定屬於bill_file_upload專屬的元件函式或元件設定預設值

	jQuery.bill_file_upload={
		'defaults':{
			'preview_base_url':'',
			'preview_url':'',
			'preview_url_prefix':'',
			'preview_url_suffix':'',
			'input_name':'',
			//normal,pic,html5video,flash
			'file_type':'pic',
			'layout_type':'basic',
			'value_alt':'',
			'process_download_url':'',
			//'reg_1':'orequired',
			'is_required':'0',
			'white_extensions':[],
			'error_msg_1':'',
			'human_read_name':'',	
			'file_tip':'',
			'preview_width':0,
			'preview_height':0,
			'default_value':''
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_file_upload = function(param1,param2){
		
		var get_jqobject=this.filter('div[id]');
		
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			bill_core.debug_console('bill_file_upload一次只能轉換一個,轉換的元素為賦予id的div','error');
			return;
		}else if(get_jqobject.length==0){
			return;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_bill_file_upload')!=='1'){
				bill_core.debug_console('請先轉換元素為bill_file_upload','error');
				return;
			}
			
		}
		
		//物件方法
		var jqobject_scope_methods={
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
		
		var opts = jQuery.extend( true,{}, jQuery.bill_file_upload.defaults, want_set_opts );
		get_jqobject.data(opts);
		opts=get_jqobject.data();
		
		var component_id=get_jqobject.attr('id');
		
		
		
		if( bill_core.string_is_solid(opts.input_name)==='1' ){
		
		}else{
			bill_core.debug_console('bill_file_upload元件啟動失敗,input_name參數錯誤','error');
			return;
		}
		if( jQuery.inArray(opts.file_type,['normal','pic','html5video','flash'])===-1 ){
			bill_core.debug_console('bill_file_upload元件啟動失敗,file_type參數錯誤','error');
			return;
		}
		if( bill_core.global_typeof(opts.white_extensions)==='object' ){
		
		}else{
			bill_core.debug_console('bill_file_upload元件啟動失敗,white_extensions參數錯誤','error');
			return;
		}
		
		if(get_jqobject.attr('is_transformed_to_bill_file_upload')!=='1'){
			

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
						if( bill_core.string_is_solid(opts.default_value)==='1'){
							
							final_component_html+=
							'<img border="0" '+temp_style_string+' src="'+
							opts.preview_base_url+opts.default_value+'" />';
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
							'<source src="'+opts.preview_base_url+opts.default_value+'" type="'+temp_mime+'" />'+
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
					if( bill_core.string_is_solid(opts.default_value)==='1'){
						
						
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
						'<embed src="'+opts.preview_base_url+opts.default_value+'" '+temp_attrs_string+'  ></embed>';
					
					}
					else{
						final_component_html+=
						'暫無檔案';
					}						
				}
			}else if(opts.layout_type==='haiduau'){
				if(opts.file_type=='pic'){
						
					if( bill_core.string_is_solid(opts.default_value)==='1'){
						final_component_html+=
						'<a href="'+opts.preview_base_url+opts.default_value+'" target="_blank"><i class="fa fa-file-photo-o" aria-hidden="true"></i>'+opts.value_alt+'</a>';
					}
				}
			}else if(opts.layout_type==='hdsystem'){
				if(opts.file_type=='normal'){
					
					if( 
						bill_core.string_is_solid(opts.process_download_url)==='1' &&
						bill_core.string_is_solid(opts.default_value)==='1'
					){
						final_component_html+=
						'<a href="'+opts.process_download_url+'?obj_id='+encodeURIComponent(opts.default_value)+'">下載檔案</a>';
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
						if( bill_core.string_is_solid(opts.default_value)==='1'){
							
							final_component_html+=
							'<img border="0" '+temp_style_string+' src="'+
							opts.preview_base_url+'?obj_id='+encodeURIComponent(opts.default_value)+opts.preview_url_suffix+'" />';
						}
						else{
							final_component_html+=
							'<img border="0" '+temp_style_string+'  alt="無圖檔"  />';
						}
				}
				
			}
			final_component_html+=
				'</div>';
			
			
			
			
			
			//draw input
			var temp_attrs_string='';
			temp_attrs_string+=' id="'+component_id+'_value" ';
			temp_attrs_string+=' name="'+opts.input_name+'" ';
			
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
					'<span id="'+component_id+'_file_tip">'+opts.file_tip+'</span>';
				}
				final_component_html+=
				'<input type="file" '+temp_attrs_string+' value="" />';
				
				if( bill_core.string_is_solid(opts.default_value)==='1' ){
					final_component_html+=
					'<input type="radio"  name="'+opts.input_name+'_op" value="DO_NO"  />不變'+
					'<input type="radio"  name="'+opts.input_name+'_op" value="DO_MODIFY" />變更';
					if(opts.is_required==='1'){
						
					}else{
						final_component_html+='<input type="radio"  name="'+opts.input_name+'_op" value="DO_DELETE" />刪除';	
					}
				}
				else{
					final_component_html+='<input type="hidden" id="'+component_id+'_op"  name="'+opts.input_name+'_op" value="DO_NO" />';	
				}
			}else if(opts.layout_type==='haiduau'){
				if( bill_core.string_is_solid(opts.file_tip)==='1' ){
					final_component_html+=
					'<span id="'+component_id+'_file_tip">'+opts.file_tip+'</span>';
				}
				final_component_html+=
				'<input type="file" '+temp_attrs_string+' value="" /><br />';
				
				if( bill_core.string_is_solid(opts.default_value)==='1' ){
					final_component_html+=
					'<input type="radio"  name="'+opts.input_name+'_op" value="DO_NO" />不變'+
					'<input type="radio"  name="'+opts.input_name+'_op" value="DO_MODIFY" />變更';
					if(opts.is_required==='1'){
						
					}else{
						final_component_html+='<input type="radio"  name="'+opts.input_name+'_op" value="DO_DELETE" />刪除';	
					}
				}
				else{
					final_component_html+='<input type="hidden" id="'+component_id+'_op"  name="'+opts.input_name+'_op" value="DO_NO" />';	
				}
			}
			else if(opts.layout_type==='hdsystem'){
				if( bill_core.string_is_solid(opts.file_tip)==='1' ){
					final_component_html+=
					'<span id="'+component_id+'_file_tip">'+opts.file_tip+'</span>';
				}
				final_component_html+=
				'<input type="file" '+temp_attrs_string+' value="" />';
				
				if( bill_core.string_is_solid(opts.default_value)==='1' ){
					final_component_html+=
					'<input type="radio"  name="'+opts.input_name+'_op" value="DO_NO"  />不變'+
					'<input type="radio"  name="'+opts.input_name+'_op" value="DO_MODIFY" />變更';
					if(opts.is_required==='1'){
						
					}else{
						final_component_html+='<input type="radio"  name="'+opts.input_name+'_op" value="DO_DELETE" />刪除';	
					}
				}
				else{
					final_component_html+='<input type="hidden" id="'+component_id+'_op"  name="'+opts.input_name+'_op" value="DO_NO" />';	
				}
			}
			get_jqobject.html(final_component_html);
			
			
			//bind element event_handler

			jQuery('input:radio[name="'+opts.input_name+'_op"]').change(
				function(){
					var value_jqobject=jQuery('#'+component_id+'_value');
					var value_jqobject_reg_1=value_jqobject.attr('reg_1');

					if( jQuery(this).val()=='DO_NO' ){
						if( bill_core.string_is_start_with(value_jqobject_reg_1,'r')==='1' ){
							value_jqobject.attr(
								'reg_1',value_jqobject_reg_1.replace(/^r/g,'o')
							);
						}
						else if( bill_core.string_is_end_with(value_jqobject_reg_1,'|(^$)')==='0' ){
							value_jqobject.attr(
								'reg_1',value_jqobject_reg_1.replace(/$/g,'|(^$)')
							);
						}
						value_jqobject.val('');
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
					}
					else if( jQuery(this).val()=='DO_DELETE' ){
						
						if( bill_core.string_is_start_with('r',value_jqobject_reg_1)==='1' ){
							
							value_jqobject.attr(
								'reg_1',value_jqobject_reg_1.replace(/^r/g,'o')
							);
						}
						else if( bill_core.string_is_end_with(value_jqobject_reg_1,'|(^$)')==='0' ){
							
							value_jqobject.attr(
								'reg_1',value_jqobject_reg_1.replace(/$/g,'|(^$)')
							);
						}
						value_jqobject.val('');
					}
					
				}
			);
			jQuery('#'+component_id+'_value').change(
				function(){
					if(bill_core.string_is_solid(opts.default_value)==='1'){
						if($(this).val()!==''){
							jQuery("input:radio[name='"+opts.input_name+"_op'][value='DO_MODIFY']").click();
						}
					}else{
						
						if($(this).val()===''){
							jQuery("#"+component_id+'_op').val('DO_NO');
						}else{
							jQuery("#"+component_id+'_op').val('DO_ADD');
						}
					}
				}
			)
			
			jQuery('input:radio[name="'+opts.input_name+'_op"][value="DO_NO"]').click();
			get_jqobject.attr('is_transformed_to_bill_file_upload','1');	
		}
		
		return get_jqobject;
	};
}(jQuery,bill_core));

