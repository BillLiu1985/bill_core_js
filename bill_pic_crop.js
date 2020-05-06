(function(jQuery,bill_core){
	//一般狀態 _preview,_file_tip,_input,_file_delete_button,
	//上傳檔案中 _preview,_file_tip,_ingicon
	//移除中 _preview,_file_tip,_input,_ingicon
	//截圖狀態
	//確定截圖中 _select_ingicon
	//取消截圖中 _select_ingicon
	//一般狀態->移除中
	//移除中->一般狀態
	//一般狀態->上傳檔案中
	//上傳檔案中->一般狀態
	//上傳檔案中->截圖狀態
	//截圖狀態->確定截圖中
	//確定截圖中->截圖狀態
	//確定截圖中->一般狀態
	//截圖狀態->取消截圖中
	//取消截圖中->截圖狀態
	//取消截圖中->一般狀態
	
	
	//設定屬於bill_pic_crop專屬的元件函式或元件設定預設值

	jQuery.bill_pic_crop={
		'defaults':{
			'input_name':'',
			'process_upload_url':'',
			'uploading_icon_url':'',
			'selecting_icon_url':'',
			'file_tip':'選擇檔案：',
			'select_tip':'請拖曳圖片以確認擷取範圍',
			'preview_width':400,
			'canvas_width':400,
			'output_width':400,
			'output_height':400,
			'default_value':'',
			'is_required':'0',
			'csrf_token':''
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_pic_crop = function(param1,param2){
		
		var get_jqobject=this.filter('div[id]');
		
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			bill_core.debug_console('bill_pic_crop一次只能轉換一個,轉換的元素為賦予id的div','error');
			return;
		}else if(get_jqobject.length==0){
			return;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_bill_pic_crop')!=='1'){
				bill_core.debug_console('請先轉換元素為bill_pic_crop','error');
				return;
			}
		}
		
		//物件方法
		var jqobject_scope_methods={
			'check_is_uploading':function(){
				
				if(
					jQuery('#'+this.attr('id')+'_ingicon').css('display')=='none' && 
					jQuery('#'+this.attr('id')+'_select_ingicon').css('display')=='none'
				){
					return '0'
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
		
		var opts = jQuery.extend( true,{}, jQuery.bill_pic_crop.defaults, want_set_opts );
		get_jqobject.data(opts);
		opts=get_jqobject.data();
	

		var component_id=get_jqobject.attr('id');
		if( bill_core.string_is_solid(opts.input_name)==='1' ){
		
		}else{
			bill_core.debug_console('bill_pic_crop元件啟動失敗,input_name參數錯誤','error');
			return;
		}
		
		if( 
			bill_core.number_is_solid(opts.preview_width)==='1' &&
			opts.preview_width>0
		){
		}else{
			bill_core.debug_console('bill_pic_crop元件啟動失敗,preview_width參數錯誤','error');
			return;
		}
		
		
		if(get_jqobject.attr('is_transformed_to_bill_pic_crop')!=='1'){
			
			var final_component_html='';
			final_component_html+=
				'<div id="'+component_id+'_preview">';
					var temp_style_string='';
					
					temp_style_string+='width:'+opts.preview_width+'px;';
					
					
					if( 
						bill_core.string_is_solid(opts.default_value)==='0'
					){
						opts.preview_height=opts.preview_width*(opts.output_height/opts.output_width);
						temp_style_string+='height:'+opts.preview_height+'px;';
					}
					if(temp_style_string!=''){
						temp_style_string='style="'+temp_style_string+'"';
					}
					if( bill_core.string_is_solid(opts.default_value)==='1'){
						
						final_component_html+=
						'<img border="0" '+temp_style_string+' src="'+
						bill_core.url_get_full(opts.default_value)+'" />';
					}
					else{
						final_component_html+=
						'<img border="0" '+temp_style_string+'  alt="無圖檔"  />';
					}
			final_component_html+=
				'</div>';
			
			var reg_1_string='';
			
			if(opts.is_required=='1'){
				reg_1_string='rpicfile';
			}else{
				reg_1_string='opicfile';
			}
		
			
			//draw file_tip
			if( bill_core.string_is_solid(opts.file_tip)==='1' ){
				final_component_html+=
				'<span id="'+component_id+'_file_tip">'+opts.file_tip+'</span>';
			}
			
			//draw input
			final_component_html+=
			'<input type="file" maxlength="255" size="50" id="'+component_id+'_input" name=""  reg_1="'+reg_1_string+'"  />';  

			
			//draw go_to_edit
			/*
				final_component_html+=
				'<input type="button" value="編輯"   '+
				'id="'+component_id+'_go_to_edit_button" />';
			*/
			
			//draw file_delete_button
		
			final_component_html+=
			'<input type="button" value="移除" style="margin-right:10px;" '+
			'id="'+component_id+'_file_delete_button" />';
	
			//draw uploading icon
			final_component_html+=
			'<img border="0" src="'+opts.uploading_icon_url+'"' +
			'style="display:none;vertical-align:middle;float:right"'+ 
			'id="'+component_id+'_ingicon">';
			
			//draw selecting icon
			final_component_html+=
			'<img border="0" src="'+opts.selecting_icon_url+'"' +
			'style="display:none;vertical-align:middle;float:right"'+ 
			'id="'+component_id+'_select_ingicon">';

			
			//draw select_cancel
			final_component_html+=
			'<input type="button" value="取消"  style="display:none;margin:0px 5px;vertical-align:middle"  '+
			'id="'+component_id+'_select_cancel_button" />';

			//draw select_ok
			final_component_html+=
			'<input type="button" value="確認" style="display:none;margin:0px 5px;vertical-align:middle" '+
			'id="'+component_id+'_select_ok_button" />';

			//draw select_tip
			final_component_html+=
			'<span id="'+component_id+'_select_tip" style="float:right;display:none;margin:5px 5px 0px 5px;">'+opts.select_tip+'</span>';


			//draw crop info	
			final_component_html+=
			'<input type="hidden" value="0" id="'+component_id+'_crop_x" />'+
			'<input type="hidden" value="0" id="'+component_id+'_crop_y" />'+
			'<input type="hidden" value="'+(opts.canvas_width/2.5)+'" id="'+component_id+'_crop_width" />'+
			'<input type="hidden" value="'+(opts.canvas_width/2.5*(opts.output_height/opts.output_width))+'" id="'+component_id+'_crop_height" />';
			
			//draw savedata element
			final_component_html+=
			'<input type="hidden" value="" id="'+component_id+'_workingfile_uploadfile_id" />'+
			'<input type="hidden" value="" id="'+component_id+'_tmpfile_uploadfile_id" />'+
			'<input type="hidden" value="DO_NO" id="'+component_id+'_op" name="'+opts.input_name+'_op" />'+
			'<input type="hidden" value="" id="'+component_id+'_data" name="'+opts.input_name+'" reg_1="'+reg_1_string+'" />';
				
			get_jqobject.html(final_component_html);
			
			//draw form_for_upload
			var temp_html=
			'<form id="'+component_id+'_form" style="display:none" target="'+component_id+'_iframe" '+
			'action="'+opts.process_upload_url+'?page_func=upload_material" method="post" enctype="multipart/form-data"'+
			'>'+
				'<input type="hidden" name="updated_column_name" value="'+(
					opts.input_name
				)+'" >'+
				'<input type="hidden" name="component_id" value="'+component_id+'" >'+
				'<input type="hidden" name="_token" value="'+opts.csrf_token+'" />'+
			'</form>'+
			'<iframe name="'+component_id+'_iframe" width="0" height="0" style="display:none" ></iframe>'
			;
			jQuery('body').append(temp_html);
			//bind element event_handler
			jQuery('#'+component_id+'_input').change(
				function(){
					
					if(bill_core.validate_string(jQuery(this).attr('reg_1'),jQuery(this).val())==='0'){
						jQuery(this).val('');
						alert('檔案格式錯誤');
						return;
					}
					jQuery(this).attr('name','input_file');
					
					jQuery("#"+component_id+"_file_tip").hide();	
					jQuery("#"+component_id+"_file_delete_button").hide();
					jQuery("#"+component_id+"_ingicon").show();
					
					jQuery(this).appendTo(jQuery("#"+component_id+"_form"));
					jQuery("#"+component_id+"_form").submit();
				}
			);
			/*
			jQuery('#'+component_id+'_go_to_edit_button').click(
				function(){
					if(jQuery('#'+component_id+'_input').val()==''){
						alert('請選擇檔案');
						return false;
					}
					
					jQuery("#"+component_id+"_file_tip").hide();	
					jQuery("#"+component_id+"_go_to_edit_button").hide();		
					jQuery("#"+component_id+"_file_delete_button").hide();
					jQuery("#"+component_id+"_ingicon").show();
					jQuery('#'+component_id+'_input').appendTo(jQuery('#'+component_id+"_form"));
					jQuery("#"+component_id+"_form").submit();
				}
			);
			*/
					
			jQuery('#'+component_id+'_file_delete_button').click(
				function(){
					if(jQuery('#'+component_id+'_preview'+'>img').length==0){
						alert('無檔案可移除');
						return;
					}
					jQuery(this).hide();
					jQuery("#"+component_id+"_ingicon").show();
					
					var about_info={
						'updated_column_name':opts.input_name,
						'tmpfile_uploadfile_id':jQuery("#"+component_id+"_tmpfile_uploadfile_id").val(),
						'_token':opts.csrf_token,
						'component_id':component_id
					};
					bill_core.ajax_post(
						opts.process_upload_url+'?ajax_func=delete_crop',
						about_info,
						function(about_info,textStatus,jqXHR){
							if(about_info['code']=='1'){
					
								if(bill_core.string_is_solid(opts.default_value)==='1'){
									jQuery("#"+component_id+'_op').val('DO_DELETE');
								}else{
									jQuery("#"+component_id+'_op').val('DO_NO');
								}
								jQuery("#"+component_id+'_tmpfile_uploadfile_id').val('');
								jQuery("#"+component_id+'_data').val('');
								
								var preview_html='';
								preview_html=
								"<img  alt=\"無圖檔\"  style=\"width:"
								+opts.preview_width+"px;height:"+(opts.preview_width*(opts.output_height/opts.output_width))+"px;\"  border=\"0\"   />";
								
								jQuery("#"+component_id+'_preview').html(preview_html);
					
							}else{
								alert(about_info['message']);
							}
							jQuery(this).show();
							jQuery("#"+component_id+"_ingicon").hide();
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
							jQuery(this).show();
							jQuery("#"+component_id+"_ingicon").hide();
						},
						'1',
						this
					);
					
				}
			);
			
			jQuery('#'+component_id+'_select_ok_button').click(
				function(){
					jQuery(this).hide();
					jQuery("#"+component_id+"_select_cancel_button").hide();
					jQuery("#"+component_id+"_select_tip").hide();
					jQuery("#"+component_id+"_select_ingicon").show();
					
				
					var about_info={
						'updated_column_name':opts.input_name,
						'tmpfile_uploadfile_id':jQuery("#"+component_id+"_tmpfile_uploadfile_id").val(),
						'workingfile_uploadfile_id':jQuery("#"+component_id+"_workingfile_uploadfile_id").val(),
						'crop_x':jQuery("#"+component_id+"_crop_x").val(),
						'crop_y':jQuery("#"+component_id+"_crop_y").val(),
						'crop_width':jQuery("#"+component_id+"_crop_width").val(),
						'crop_height':jQuery("#"+component_id+"_crop_height").val(),
						'canvas_width':opts.canvas_width,
						'output_width':opts.output_width,
						'output_height':opts.output_height,
						'_token':opts.csrf_token,
						'component_id':component_id
					};
					bill_core.ajax_post(
						opts.process_upload_url+'?ajax_func=ok_crop',
						about_info,
						function(about_info,textStatus,jqXHR){
							if(about_info['code']=='1'){
								jQuery('#'+component_id+'_input').insertAfter(jQuery('#'+component_id+"_file_tip"));
								jQuery('#'+component_id+'_input').removeAttr('name');
								jQuery("#"+component_id+"_preview"+'>img').imgAreaSelect({remove:true});
								
								var preview_html='';
								var temp_style_string='';
								
								temp_style_string+='width:'+opts.preview_width+'px;';

								if(temp_style_string!=''){
									temp_style_string='style="'+temp_style_string+'"';
								}
								
								preview_html=
								'<img border="0" '+temp_style_string+' src="'+
								bill_core.url_get_full(about_info['tmpfile_uploadfile_id'])+'" />';
							
								jQuery("#"+component_id+'_tmpfile_uploadfile_id').val(about_info['tmpfile_uploadfile_id']);
								jQuery("#"+component_id+'_data').val(about_info['tmpfile_uploadfile_id']);
								jQuery("#"+component_id+'_workingfile_uploadfile_id').val('');

								
								if(bill_core.string_is_solid(opts.default_value)==='1'){
									jQuery("#"+component_id+'_op').val('DO_MODIFY');
								}else{
									jQuery("#"+component_id+'_op').val('DO_ADD');
								}
								
								jQuery("#"+component_id+"_preview").html(preview_html);
								
								jQuery("#"+component_id+"_select_ingicon").hide();
								
								jQuery("#"+component_id+"_file_tip").show();	
								jQuery("#"+component_id+"_file_delete_button").show();
								
								
							}else{
								jQuery(this).show();
								jQuery("#"+component_id+"_select_cancel_button").show();
								jQuery("#"+component_id+"_select_tip").show();
								jQuery("#"+component_id+"_select_ingicon").hide();
								alert(about_info['message']);
							}
							
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
							jQuery(this).show();
							jQuery("#"+component_id+"_select_cancel_button").show();
							jQuery("#"+component_id+"_select_tip").show();
							jQuery("#"+component_id+"_select_ingicon").hide();
						},
						'1',
						this
					);
					
				}
			)
			
			jQuery('#'+component_id+'_select_cancel_button').click(
				function(){
					jQuery(this).hide();
					jQuery("#"+component_id+"_select_ok_button").hide();
					jQuery("#"+component_id+"_select_tip").hide();
					
					jQuery("#"+component_id+"_select_ingicon").show();
					
					var about_info={
						'updated_column_name':opts.input_name,
						'workingfile_uploadfile_id':jQuery("#"+component_id+"_workingfile_uploadfile_id").val(),
						'_token':opts.csrf_token,
						'component_id':component_id,
					};
					bill_core.ajax_post(
						opts.process_upload_url+'?ajax_func=cancel_crop',
						about_info,
						function(about_info,textStatus,jqXHR){
							if(about_info['code']=='1'){
								jQuery('#'+component_id+'_input').insertAfter(jQuery('#'+component_id+"_file_tip"));
								jQuery('#'+component_id+'_input').removeAttr('name');
								jQuery("#"+component_id+"_preview"+'>img').imgAreaSelect({remove:true});
								
								var preview_html='';
								var temp_style_string='';
								var temp_uploadfile_id='';
								if( bill_core.string_is_solid(jQuery("#"+component_id+"_tmpfile_uploadfile_id").val())==='1' ){
									temp_uploadfile_id=jQuery("#"+component_id+"_tmpfile_uploadfile_id").val();
								}else if( bill_core.string_is_solid(opts.default_value)==='1' ){
									temp_uploadfile_id=opts.default_value;
								}
								
								
								
								var temp_style_string='';
								temp_style_string+='width:'+opts.preview_width+'px;';
								if( 
									bill_core.string_is_solid(temp_uploadfile_id)==='0'
								){
									opts.preview_height=opts.preview_width*(opts.output_height/opts.output_width);
									temp_style_string+='height:'+opts.preview_height+'px;';
								}
								if(temp_style_string!=''){
									temp_style_string='style="'+temp_style_string+'"';
								}
								if( bill_core.string_is_solid(temp_uploadfile_id)==='1'){
									
									preview_html=
									'<img border="0" '+temp_style_string+' src="'+
									bill_core.url_get_full(temp_uploadfile_id)+'" />';
								}
								else{
									preview_html+=
									'<img border="0" '+temp_style_string+'  alt="無圖檔"  />';
								}

								jQuery("#"+component_id+"_preview").html(preview_html);
								
								
								jQuery("#"+component_id+'_workingfile_uploadfile_id').val('');
								
								jQuery("#"+component_id+"_select_ingicon").hide();

								jQuery("#"+component_id+"_file_tip").show();	
								
								jQuery("#"+component_id+"_file_delete_button").show();
						
							}else{
								jQuery(this).show();
								jQuery("#"+component_id+"_select_ok_button").show();
								jQuery("#"+component_id+"_select_tip").show();
								jQuery("#"+component_id+"_select_ingicon").hide();
								alert(about_info['message']);
							}
							
						
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
							jQuery(this).show();
							jQuery("#"+component_id+"_select_ok_button").show();
							jQuery("#"+component_id+"_select_tip").show();
							jQuery("#"+component_id+"_select_ingicon").hide();
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
				if(about_info['code']=='1'){
					var new_preview_html='';
					var temp_style_string='';
					temp_style_string+='width:'+opts.canvas_width+'px;';
					if(temp_style_string!=''){
						temp_style_string='style="'+temp_style_string+'"';
					}
					new_preview_html=
					'<img border="0" '+temp_style_string+' src="'+
					bill_core.url_get_full(about_info['workingfile_uploadfile_id']+'?rnd='+new Date().getTime())+'" />';
					jQuery("#"+component_id+"_preview").html(new_preview_html);

					jQuery("#"+component_id+"_workingfile_uploadfile_id").val(about_info['workingfile_uploadfile_id']);
					
					
					jQuery("#"+component_id+"_preview>img").imgAreaSelect({
						'aspectRatio': opts.output_width+':'+opts.output_height,
						'x1': 0, 
						'y1': 0, 
						'x2': (opts.canvas_width/2.5), 
						'y2': (opts.canvas_width/2.5*(opts.output_height/opts.output_width)),
						'onSelectChange': function(img, selection) {
							jQuery("#"+component_id+"_crop_x").val(selection.x1);
							jQuery("#"+component_id+"_crop_y").val(selection.y1);
							jQuery("#"+component_id+"_crop_width").val(selection.width);
							jQuery("#"+component_id+"_crop_height").val(selection.height);
						}
					});
					jQuery("#"+component_id+"_select_ok_button").show();
					jQuery("#"+component_id+"_select_cancel_button").show();
					jQuery("#"+component_id+"_select_tip").show();
				}else{
					jQuery("#"+component_id+"_file_tip").show();	
					jQuery('#'+component_id+'_input').insertAfter(jQuery('#'+component_id+"_file_tip"));
					jQuery("#"+component_id+'_file_delete_button').show();
					alert(about_info['message']);	
				}
				jQuery('#'+component_id+'_ingicon').hide();
				jQuery('#'+component_id+'_input').val('');
			}
			
			get_jqobject.attr('is_transformed_to_bill_pic_crop','1');	
		}
		
		return get_jqobject;
	};
}(jQuery,bill_core));

