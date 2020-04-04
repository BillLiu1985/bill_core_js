(function(jQuery,bill_core){
	
	//設定屬於bill_video_url專屬的元件函式或元件設定預設值

	jQuery.bill_video_url={
		'defaults':{
			'input_name':'',
			//youtube,vimeo
			'platform':'youtube',
			'is_required':'0',
			'error_msg_1':'',
			'human_read_name':'',	
			'preview_width':'',
			'preview_height':'',
			'default_value':''
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_video_url = function(param1,param2){
		
		
		var get_jqobject=this.filter('div[id]');
		
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			bill_core.debug_console('bill_video_url一次只能轉換一個,轉換的元素為賦予id的div','error');
			return;
		}else if(get_jqobject.length==0){
			return;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_bill_video_url')!=='1'){
				bill_core.debug_console('請先轉換元素為bill_video_url','error');
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
		
		var opts = jQuery.extend( true,{}, jQuery.bill_video_url.defaults, want_set_opts );
		get_jqobject.data(opts);
		opts=get_jqobject.data();
		
		var component_id=get_jqobject.attr('id');
		
		if( bill_core.string_is_solid(opts.input_name)==='1' ){
		
		}else{
			bill_core.debug_console('bill_file_upload元件啟動失敗,input_name參數錯誤','error');
			return;
		}
		if( jQuery.inArray(opts.platform,['youtube','vimeo'])===-1 ){
			bill_core.debug_console('bill_video_url元件啟動失敗,platform參數錯誤','error');
			return;
		}
		
		if(get_jqobject.attr('is_transformed_to_bill_video_url')!=='1'){
			

			var final_component_html='';
			if(opts.platform=='youtube'){
				final_component_html+=
				'<div id="'+component_id+'_preview">';
				if( bill_core.string_is_solid(opts.default_value)==='1'){
					
					var temp_attrs_string='  ';
					if( bill_core.string_is_solid(opts.preview_width)==='1' ){
						temp_attrs_string+=' width="'+opts.preview_width+'" ';
					}
					else{
						temp_attrs_string+=' width="600" ';
					}
					if( bill_core.string_is_solid(opts.preview_height)==='1' ){
						temp_attrs_string+=' height="'+opts.preview_height+'" ';
					}
					else{
						temp_attrs_string+=' height="400" ';
					}
					
					final_component_html+=
					'<iframe style="margin-top:10px;margin-bottom:10px;" '+
					temp_attrs_string+
					'src="//www.youtube.com/embed/'+opts.default_value+'?rel=0&wmode=opaque" '+
					'frameborder="0" allowfullscreen></iframe>';
				
				}
				else{
					final_component_html+=
					'暫無資料';
				}						
				final_component_html+=
				'</div>';
			}
			else if(opts.platform=='vimeo'){
				final_component_html+=
				'<div id="'+component_id+'_preview">';
				if( bill_core.string_is_solid(opts.default_value)==='1'){
					
					var temp_attrs_string='  ';
					if( bill_core.string_is_solid(opts.preview_width)==='1' ){
						temp_attrs_string+=' width="'+opts.preview_width+'" ';
					}
					else{
						temp_attrs_string+=' width="600" ';
					}
					if( bill_core.string_is_solid(opts.preview_height)==='1' ){
						temp_attrs_string+=' height="'+opts.preview_height+'" ';
					}
					else{
						temp_attrs_string+=' height="400" ';
					}
					
					final_component_html+=
					'<iframe src="//player.vimeo.com/video/'+opts.default_value+'" '+
					temp_attrs_string+'frameborder="0" '+
					'webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
				
				}
				else{
					final_component_html+=
					'暫無資料';
				}						
				final_component_html+=
				'</div>';
			}
		
			
			//draw input
			var temp_attrs_string='';
			temp_attrs_string+=' id="'+component_id+'_value" ';
			temp_attrs_string+=' name="'+opts.input_name+'" ';
			
			
			if(opts.is_required=='1'){
				temp_attrs_string+=' reg_1="rwebsite" ';
			}else{
				temp_attrs_string+=' reg_1="owebsite" ';
			}
			
			if( bill_core.string_is_solid(opts.error_msg_1)==='1' ){
				temp_attrs_string+=' error_msg_1="'+opts.error_msg_1+'" ';
			}
			if( bill_core.string_is_solid(opts.human_read_name)==='1' ){
				temp_attrs_string+=' human_read_name="'+opts.human_read_name+'" ';
			}
			temp_attrs_string+=' maxlength="255" size="50" ';
			
			if( bill_core.string_is_solid(opts.default_value)==='1' ){
				if(opts.platform=='youtube'){
					final_component_html+=
					'<input type="text" '+temp_attrs_string+' value="https://www.youtube.com/watch?v='+opts.default_value+'" />';
				}
				else if(opts.platform=='vimeo'){
					final_component_html+=
					'<input type="text" '+temp_attrs_string+' value="https://vimeo.com/'+opts.default_value+'" />';
				}
			}
			else{
				final_component_html+=
					'<input type="text" '+temp_attrs_string+' value="" />';
			}
			
			if( bill_core.string_is_solid(opts.default_value)==='1' ){
				final_component_html+=
				'<input type="radio"  name="'+opts.input_name+'_op" value="DO_NO" checked />不變'+
				'<input type="radio"  name="'+opts.input_name+'_op" value="DO_MODIFY" />變更';
				if(opts.is_required==='1'){
					
				}else{
					final_component_html+='<input type="radio"  name="'+opts.input_name+'_op" value="DO_DELETE" />刪除';	
				}
			}
			else{
				final_component_html+='<input type="hidden"  name="'+opts.input_name+'_op" value="DO_ADD" />';	
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
					}
					else if( jQuery(this).val()=='DO_MODIFY' ){
						
						if( bill_core.string_is_start_with(value_jqobject_reg_1,'o')==='1' ){
							value_jqobject.attr(
								'reg_1',value_jqobject_reg_1.replace(/^o/g,'r')
							);
						}
					}
					else if( jQuery(this).val()=='DO_DELETE' ){
						
						if( bill_core.string_is_start_with(value_jqobject_reg_1,'r')==='1' ){
							
							value_jqobject.attr(
								'reg_1',value_jqobject_reg_1.replace(/^r/g,'o')
							);
						}
					}
					
				}
			);
			
			
			jQuery('input:radio[name="'+opts.input_name+'_op"]:checked').change();
			get_jqobject.attr('is_transformed_to_bill_video_url','1');	
		}
		
		return get_jqobject;
	};
}(jQuery,bill_core));

