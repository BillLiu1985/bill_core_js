(function(jQuery,bill_core){
	{
		let never_used_is_found='0';
		if(jQuery===undefined){
			console.error('jquery never used');
		}
		if(jQuery.fn.imgAreaSelect===undefined){
			console.error('jquery plugin imgAreaSelect never used');
		}
		if(bill_core===undefined){
			console.error('bill_core never used');
		}
		if(never_used_is_found==='1'){
			return;
		}
	}
	/* 元件組成要素
		可見可不見
			'_preview',
			_pick_file_tip',_pick_file_button',
			'_crop_cancel_button','_crop_ok_button','_crop_tip','_crop_ingicon',
			'_re_crop_button',
			'_delete_button',
			'_restore_button',
			'_normal_ingicon',
		恆非可見
			,'_input',
			'_tmpfile_before_crop_uploadfile_id','_tmpfile_value_uploadfile_id',
			'_op',
	*/
	/* 元件各種狀態
		一般狀態(normal)
			可見
				'_preview','_pick_file_tip','_pick_file_button',
			可見可不見
				'_re_crop_button',
				'_delete_button',
				'_restore_button'
				
		一般狀態操作中(normal_op_ing)
			可見
				'_preview','_normal_op_ingicon',
	
		截圖狀態(crop)
			可見
				'_preview','_crop_cancel_button','_crop_ok_button','_crop_tip',

		截圖狀態操作中(crop_op_ing)
			可見
				'_preview','_crop_op_ingicon',
		
	*/	
	/* 元件狀態轉換時機
		一般狀態->一般狀態操作中(選擇要上傳的檔案後)->截圖狀態(上傳檔案處理完畢後)
		截圖狀態->截圖狀態操作中(按下確定要截圖後)->一般狀態
		截圖狀態->截圖狀態操作中(按下取消截圖後)->一般狀態		
		一般狀態->一般狀態操作中(按下_re_crop_button後)->截圖狀態(re_crop event handler執行結束後)
		一般狀態->一般狀態操作中(按下_delete_button後)->一般狀態(delete event handler執行結束後)
		一般狀態->一般狀態操作中(按下_restore_button後)->一般狀態(restore event handler執行結束後)
	*/
	
	
	//設定屬於bill_pic_crop專屬的元件函式或元件設定預設值

	jQuery.bill_pic_crop={
		'defaults':{
			'input_name':'',
			'process_op_url':'',
			'ingicon_url':bill_core.js_dir_url+'bill_core_js/bill_pic_crop/image/loadinfo.net.gif',
			'error_msg_1':'',
			'human_read_name':'',
			'pick_file_tip':'',
			'pick_file_button_text':'選擇檔案',
			'crop_tip':'請拖曳圖片以確認擷取範圍',
			'preview_width':400,
			'canvas_width':400,
			'output_width':400,
			'output_height':400,
			'default_value':',',
			'is_required':'0',
			'csrf_token':'',
			'_value':'',
			'_before_crop':'',
			'_preview_height':0,
			'_is_have_uploaded':'0',
			'_workingfile_before_crop_uploadfile_id':'',
			'_workingfile_for_crop_uploadfile_id':'',
			'_crop_x':0,
			'_crop_y':0,
			'_crop_width':0,
			'_crop_height':0,
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_pic_crop = function(param1,...other_params){
		
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
			bill_core.debug_console('bill_pic_crop一次只能轉換一個元素');
			return return_result;
		}else if(this.length==1){
			if(this.is('div[id]')){
			}else{
				bill_core.debug_console('bill_pic_crop轉換的元素必須為賦予id的div');
				return return_result;
			}
		}else if(this.length==0){
			return return_result;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_bill_pic_crop')!=='1'){
				bill_core.debug_console('請先轉換元素為bill_pic_crop','error');
				return return_result;
			}
			
		}
		
		var get_jqobject=this;
		var component_id=get_jqobject.attr('id');
		if( bill_core.global_typeof(param1)=='pure_object' ){
			var want_set_opts=param1;
			
			if( bill_core.string_is_solid( want_set_opts.input_name)==='1' ){
		
			}else{
				bill_core.debug_console('bill_pic_crop元件啟動失敗,input_name參數錯誤','error');
				return get_jqobject;
			}
			
			if(bill_core.string_is_solid( want_set_opts.default_value)==='1' ){
				let temp_parts=bill_core.string_multivalue_to_array(
					want_set_opts.default_value
				);
				
				if(temp_parts.length===2){
					jQuery.extend( true,want_set_opts,{
						'_value':temp_parts[0],
						'_before_crop':temp_parts[1],
					})
				}else{
					bill_core.debug_console('bill_pic_crop元件啟動失敗,defaut_value參數錯誤','error');
					return get_jqobject;
				}
			}
			
			get_jqobject.data(
				jQuery.extend( true,{}, jQuery.bill_pic_crop.defaults, want_set_opts )
			);	
		}
		var opts=get_jqobject.data();
	
		//物件方法
		var jqobject_private_methods={
			'initial':function(){
				opts._preview_height=opts.preview_width*(opts.output_height/opts.output_width);
				opts._crop_width=opts.canvas_width/2.5;
				opts._crop_height=opts._crop_width*(opts.output_height/opts.output_width);
				
				get_jqobject.empty();
				get_jqobject.attr('is_transformed_to_bill_pic_crop','1');
				
				var final_component_html='';
				final_component_html+=
					'<div id="'+component_id+'_preview">';
						var temp_style_string='';
						
						temp_style_string+='width:'+opts.preview_width+'px;';
						
						
						if( 
							bill_core.string_is_solid(opts._value)==='0'
						){
							
							temp_style_string+='height:'+opts._preview_height+'px;';
						}
						if(temp_style_string!=''){
							temp_style_string='style="'+temp_style_string+'"';
						}
						if( bill_core.string_is_solid(opts._value)==='1'){
							
							final_component_html+=
							'<img border="0" '+temp_style_string+' src="'+
							bill_core.url_get_full(opts._value)+'" />';
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
			
				
				//draw pick_file_tip
				if( bill_core.string_is_solid(opts.pick_file_tip)==='1' ){
					final_component_html+=
					'<span id="'+component_id+'_pick_file_tip">'+opts.pick_file_tip+'</span>&nbsp;&nbsp;';
				}
				
				//draw input
				final_component_html+=
				'<label id="'+component_id+'_pick_file_button">'+
					'<span>'+opts.pick_file_button_text+'</span>'+
					'<input type="file" maxlength="255" size="50" id="'+component_id+'_input" name=""  reg_1="'+reg_1_string+'" style="display:none"  />'+
				'</label>&nbsp;&nbsp;';
				
				//draw _crop_cancel_button
				final_component_html+=
				'<input type="button" value="取消"  style="display:none;margin:0px 5px;vertical-align:middle"  '+
				'id="'+component_id+'_crop_cancel_button" />';

				//draw _crop_ok_button
				final_component_html+=
				'<input type="button" value="確認" style="display:none;margin:0px 5px;vertical-align:middle" '+
				'id="'+component_id+'_crop_ok_button" />';

				//draw _crop_tip
				final_component_html+=
				'<span id="'+component_id+'_crop_tip" style="display:none;float:right;margin:5px 5px 0px 5px;">'+opts.crop_tip+'</span>';
				
				//draw _crop_op_ingicon
				final_component_html+=
				'<img border="0" src="'+opts.ingicon_url+'"' +
				'style="display:none;vertical-align:middle;float:right"'+ 
				'id="'+component_id+'_crop_op_ingicon">';
				
				//draw _re_crop_button
				if(opts._before_crop!==''){
					final_component_html+=
					'<input type="button" value="重新截圖" style="margin-right:10px;" '+
					'id="'+component_id+'_re_crop_button" />';
				}else{
					final_component_html+=
					'<input type="button" value="重新截圖" style="display:none;margin-right:10px;" '+
					'id="'+component_id+'_re_crop_button" />';
				}
				
				
				//draw _delete_button
				if(opts._value!==''){
					final_component_html+=
					'<input type="button" value="刪除" style="margin-right:10px;" '+
					'id="'+component_id+'_delete_button" />';
				}else{
					final_component_html+=
					'<input type="button" value="刪除" style="display:none;margin-right:10px;" '+
					'id="'+component_id+'_delete_button" />';
				}
				
				//draw _restore_button
				final_component_html+=
				'<input type="button" value="恢復初始狀態" style="display:none;margin-right:10px;" '+
				'id="'+component_id+'_restore_button" />';
				
				
				//draw _normal_op_ingicon
				final_component_html+=
				'<img border="0" src="'+opts.ingicon_url+'"' +
				'style="display:none;vertical-align:middle;float:right"'+ 
				'id="'+component_id+'_normal_op_ingicon">';
				
				//draw savedata element
				final_component_html+=
				'<input type="hidden" value="" id="'+component_id+'_tmpfile_before_crop_uploadfile_id" name="'+opts.input_name+'_before_crop" human_read_name="'+opts.human_read_name+'_截圖原圖" error_msg_1="'+opts.error_msg_1+'" reg_1="'+reg_1_string+'"  />'+
				'<input type="hidden" value="" id="'+component_id+'_tmpfile_value_uploadfile_id" name="'+opts.input_name+'" human_read_name="'+opts.human_read_name+'" error_msg_1="'+opts.error_msg_1+'" reg_1="'+reg_1_string+'" />'+
				'<input type="hidden" value="DO_NO" id="'+component_id+'_op" name="'+opts.input_name+'_op" />';
				get_jqobject.html(final_component_html);
				
				
				//bind element event_handler
				jQuery('#'+component_id+'_input').change(
					function(){
						if(jQuery(this).val()===''){
							return;
						}
						if(bill_core.validate_single(jQuery(this).attr('reg_1'),jQuery(this).val())==='0'){
							jQuery(this).val('');
							alert('檔案格式錯誤');
							return;
						}
						jqobject_private_methods['toggle_state'].call(
							this,'normal_op_ing'
						);
						
						var about_info={
							'_token':opts.csrf_token,
						};
						about_info['input_file']=jQuery(this).prop('files')[0]
						var formdata = new FormData();
						for(var temp_prop_name in about_info){
							formdata.append(temp_prop_name, about_info[temp_prop_name]);
						}
						
						
						bill_core.ajax_post(
							opts.process_op_url+'?ajax_func=upload',
							formdata,
							function(data,textStatus,jqXHR){

								if(data.code=='1'){
									opts._is_have_uploaded='1';
									var new_preview_html='';
									var temp_style_string='';
									temp_style_string+='width:'+opts.canvas_width+'px;';
									if(temp_style_string!=''){
										temp_style_string='style="'+temp_style_string+'"';
									}
									new_preview_html=
									'<img border="0" '+temp_style_string+' src="'+
									bill_core.url_get_full(data.data['workingfile_for_crop_uploadfile_id']+'?rnd='+new Date().getTime())+'" />';
									jQuery("#"+component_id+"_preview").html(new_preview_html);
									
									opts._workingfile_before_crop_uploadfile_id=data.data['workingfile_before_crop_uploadfile_id'];
									opts._workingfile_for_crop_uploadfile_id=data.data['workingfile_for_crop_uploadfile_id'];
									jQuery('#'+component_id+'_input').val('');
									
									jQuery("#"+component_id+"_preview>img").imgAreaSelect({
										'aspectRatio': opts.output_width+':'+opts.output_height,
										'x1': 0, 
										'y1': 0, 
										'x2': (opts.canvas_width/2.5), 
										'y2': (opts.canvas_width/2.5*(opts.output_height/opts.output_width)),
										'onSelectChange': function(img, selection) {
											opts._crop_x=selection.x1;
											opts._crop_y=selection.y1;
											opts._crop_width=selection.width;
											opts._crop_height=selection.height;
										}
									});
									
									
									jqobject_private_methods['toggle_state'].call(
										this,'crop'
									);
								}else{
									jqobject_private_methods['toggle_state'].call(
										this,'normal'
									);
									alert(data.message);	
								}
							},
							function(jqXHR,textStatus,errorThrown ){
								jqobject_private_methods['toggle_state'].call(
									this,'normal'
								);
								alert(errorThrown);
							},
							'0',
							this
						);
					}
				);
						
				
				
				jQuery('#'+component_id+'_crop_ok_button').click(
					function(){
						jqobject_private_methods['toggle_state'].call(
							this,'crop_op_ing'
						);
						
					
						var about_info={
							'tmpfile_value_uploadfile_id':jQuery("#"+component_id+"_tmpfile_value_uploadfile_id").val(),
							'tmpfile_before_crop_uploadfile_id':jQuery("#"+component_id+"_tmpfile_before_crop_uploadfile_id").val(),
							'workingfile_before_crop_uploadfile_id':opts._workingfile_before_crop_uploadfile_id,
							'workingfile_for_crop_uploadfile_id':opts._workingfile_for_crop_uploadfile_id,
							'crop_x':opts._crop_x,
							'crop_y':opts._crop_y,
							'crop_width':opts._crop_width,
							'crop_height':opts._crop_height,
							'canvas_width':opts.canvas_width,
							'output_width':opts.output_width,
							'output_height':opts.output_height,
							'_token':opts.csrf_token,
						};
						bill_core.ajax_post(
							opts.process_op_url+'?ajax_func=ok_crop',
							about_info,
							function(data,textStatus,jqXHR){
								if(data['code']==='1'){
									
									if(bill_core.string_is_solid(opts._value)==='0'){
										jQuery("#"+component_id+'_op').val('DO_ADD');
										
									}else if(bill_core.string_is_solid(opts._value)==='1'){
										if(opts._is_have_uploaded==='0'){
											jQuery("#"+component_id+'_op').val('DO_RE_CROP');
										}else if(opts._is_have_uploaded==='1'){
											jQuery("#"+component_id+'_op').val('DO_RE_UPLOAD');
										}
									}
									
									jQuery("#"+component_id+"_preview"+'>img').imgAreaSelect({remove:true});
									
									var preview_html='';
									var temp_style_string='';
									
									temp_style_string+='width:'+opts.preview_width+'px;';

									if(temp_style_string!=''){
										temp_style_string='style="'+temp_style_string+'"';
									}
									
									preview_html=
									'<img border="0" '+temp_style_string+' src="'+
									bill_core.url_get_full(data.data['tmpfile_value_uploadfile_id'])+'" />';
								
									jQuery("#"+component_id+'_tmpfile_before_crop_uploadfile_id').val(data.data['tmpfile_before_crop_uploadfile_id']);
									jQuery("#"+component_id+'_tmpfile_value_uploadfile_id').val(data.data['tmpfile_value_uploadfile_id']);
									opts._workingfile_before_crop_uploadfile_id='';
									opts._workingfile_for_crop_uploadfile_id='';
									jQuery('#'+component_id+'_input').val('');
									
									
									
									jQuery("#"+component_id+"_preview").html(preview_html);
									
									jqobject_private_methods['toggle_state'].call(
										this,'normal'
									);
									
									
								}else{
									jqobject_private_methods['toggle_state'].call(
										this,'crop'
									);
									alert(data['message']);
								}
								
							},
							function(jqXHR,textStatus,errorThrown ){
								jqobject_private_methods['toggle_state'].call(
									this,'crop'
								);
								alert(
									'Ajax request 錯誤'
								);
							},
							'0',
							this
						);
						
					}
				);
				
				jQuery('#'+component_id+'_crop_cancel_button').click(
					function(){
						jqobject_private_methods['toggle_state'].call(
							this,'crop_op_ing'
						);
						
						var about_info={
							'workingfile_before_crop_uploadfile_id':opts._workingfile_before_crop_uploadfile_id,
							'workingfile_for_crop_uploadfile_id':opts._workingfile_for_crop_uploadfile_id,
							'_token':opts.csrf_token,
						};
						bill_core.ajax_post(
							opts.process_op_url+'?ajax_func=cancel_crop',
							about_info,
							function(data,textStatus,jqXHR){
								if(data['code']==='1'){
									jQuery("#"+component_id+"_preview"+'>img').imgAreaSelect({remove:true});
									
									var preview_html='';
									var temp_style_string='';
									var temp_uploadfile_id='';
									if( bill_core.string_is_solid(jQuery("#"+component_id+"_tmpfile_value_uploadfile_id").val())==='1' ){
										temp_uploadfile_id=jQuery("#"+component_id+"_tmpfile_value_uploadfile_id").val();
									}else if( bill_core.string_is_solid(opts._value)==='1' ){
										temp_uploadfile_id=opts._value;
									}
									
									
									
									var temp_style_string='';
									temp_style_string+='width:'+opts.preview_width+'px;';
									if( 
										bill_core.string_is_solid(temp_uploadfile_id)==='0'
									){
										temp_style_string+='height:'+opts._preview_height+'px;';
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
									
									
									opts._workingfile_before_crop_uploadfile_id='';
									opts._workingfile_for_crop_uploadfile_id='';
									jQuery('#'+component_id+'_input').val('');
									
									jqobject_private_methods['toggle_state'].call(
										this,'normal'
									);
							
								}else{
									jqobject_private_methods['toggle_state'].call(
										this,'crop'
									);
									alert(data['message']);
								}
								
							
							},
							function(jqXHR,textStatus,errorThrown ){
								jqobject_private_methods['toggle_state'].call(
									this,'crop'
								);
								alert(
									'Ajax request 錯誤'
								);
							},
							'0',
							this
						);
					}
				);
				jQuery('#'+component_id+'_re_crop_button').click(
					function(){
						
						jqobject_private_methods['toggle_state'].call(
							this,'normal_op_ing'
						);
						
						var about_info={
							'_before_crop_uploadfile_id':opts._before_crop,
							'tmpfile_before_crop_uploadfile_id':jQuery("#"+component_id+"_tmpfile_before_crop_uploadfile_id").val(),
							'_token':opts.csrf_token,
						};
						
						
						
						bill_core.ajax_post(
							opts.process_op_url+'?ajax_func=re_crop',
							about_info,
							function(data,textStatus,jqXHR){

								if(data.code=='1'){
									var new_preview_html='';
									var temp_style_string='';
									temp_style_string+='width:'+opts.canvas_width+'px;';
									if(temp_style_string!=''){
										temp_style_string='style="'+temp_style_string+'"';
									}
									new_preview_html=
									'<img border="0" '+temp_style_string+' src="'+
									bill_core.url_get_full(data.data['workingfile_for_crop_uploadfile_id']+'?rnd='+new Date().getTime())+'" />';
									jQuery("#"+component_id+"_preview").html(new_preview_html);
									
									opts._workingfile_before_crop_uploadfile_id=data.data['workingfile_before_crop_uploadfile_id'];
									opts._workingfile_for_crop_uploadfile_id=data.data['workingfile_for_crop_uploadfile_id'];
									jQuery('#'+component_id+'_input').val('');
									
									jQuery("#"+component_id+"_preview>img").imgAreaSelect({
										'aspectRatio': opts.output_width+':'+opts.output_height,
										'x1': 0, 
										'y1': 0, 
										'x2': (opts.canvas_width/2.5), 
										'y2': (opts.canvas_width/2.5*(opts.output_height/opts.output_width)),
										'onSelectChange': function(img, selection) {
											opts._crop_x=selection.x1;
											opts._crop_y=selection.y1;
											opts._crop_width=selection.width;
											opts._crop_height=selection.height;
										}
									});
									
									
									jqobject_private_methods['toggle_state'].call(
										this,'crop'
									);
								}else{
									jqobject_private_methods['toggle_state'].call(
										this,'normal'
									);
									alert(data.message);	
								}
							},
							function(jqXHR,textStatus,errorThrown ){
								jqobject_private_methods['toggle_state'].call(
									this,'normal'
								);
								alert(errorThrown);
							},
							'0',
							this
						);
					}
				);
				jQuery('#'+component_id+'_delete_button').click(
					function(){
						if(jQuery('#'+component_id+'_preview'+'>img').length==0){
							alert('資料已標記刪除');
							return;
						}
						jqobject_private_methods['toggle_state'].call(
							this,'normal_op_ing'
						);
						
						var about_info={
							'tmpfile_before_crop_uploadfile_id':jQuery("#"+component_id+"_tmpfile_before_crop_uploadfile_id").val(),
							'tmpfile_value_uploadfile_id':jQuery("#"+component_id+"_tmpfile_value_uploadfile_id").val(),
							'_token':opts.csrf_token,
						};
						bill_core.ajax_post(
							opts.process_op_url+'?ajax_func=delete',
							about_info,
							function(data,textStatus,jqXHR){
								if(data['code']==='1'){
						
									if(bill_core.string_is_solid(opts._value)==='1'){
										jQuery("#"+component_id+'_op').val('DO_DELETE');
									}else{
										jQuery("#"+component_id+'_op').val('DO_NO');
									}
									jQuery("#"+component_id+'_tmpfile_before_crop_uploadfile_id').val('');
									jQuery("#"+component_id+'_tmpfile_value_uploadfile_id').val('');
									jQuery('#'+component_id+'_input').val('');
									
									var preview_html='';
									preview_html=
									"<img  alt=\"無圖檔\"  style=\"width:"
									+opts.preview_width+"px;height:"+(opts.preview_width*(opts.output_height/opts.output_width))+"px;\"  border=\"0\"   />";
									
									jQuery("#"+component_id+'_preview').html(preview_html);
									
									jqobject_private_methods['toggle_state'].call(
										this,'normal'
									);
								}else{
									jqobject_private_methods['toggle_state'].call(
										this,'normal'
									);
									alert(data['message']);
								}
								
							},
							function(jqXHR,textStatus,errorThrown ){
								jqobject_private_methods['toggle_state'].call(
									this,'normal'
								);
								alert(
									'Ajax request 錯誤'
								);
							},
							'0',
							this
						);
						
					}
				);
				
				jQuery('#'+component_id+'_restore_button').click(
					function(){
						
						jqobject_private_methods['toggle_state'].call(
							this,'normal_op_ing'
						);
						
						var about_info={
							'tmpfile_before_crop_uploadfile_id':jQuery("#"+component_id+"_tmpfile_before_crop_uploadfile_id").val(),
							'tmpfile_value_uploadfile_id':jQuery("#"+component_id+"_tmpfile_value_uploadfile_id").val(),
							'_token':opts.csrf_token,
						};
						bill_core.ajax_post(
							opts.process_op_url+'?ajax_func=restore',
							about_info,
							function(data,textStatus,jqXHR){
								if(data['code']==='1'){
						
									
									jQuery("#"+component_id+'_op').val('DO_NO');
									
									jQuery("#"+component_id+'_tmpfile_before_crop_uploadfile_id').val('');
									jQuery("#"+component_id+'_tmpfile_value_uploadfile_id').val('');
									jQuery('#'+component_id+'_input').val('');
									
									var preview_html='';
									if(bill_core.string_is_solid(opts._value)==='1'){
										preview_html=
										"<img src=\""+bill_core.url_get_full(opts._value)+"\" alt=\"無圖檔\"  style=\"width:"
										+opts.preview_width+"px;height:"+(opts.preview_width*(opts.output_height/opts.output_width))+"px;\"  border=\"0\"   />";
									}else{
										preview_html=
										"<img  alt=\"無圖檔\"  style=\"width:"
										+opts.preview_width+"px;height:"+(opts.preview_width*(opts.output_height/opts.output_width))+"px;\"  border=\"0\"   />";
									}
									jQuery("#"+component_id+'_preview').html(preview_html);
									
									jqobject_private_methods['toggle_state'].call(
										this,'normal'
									);
								}else{
									jqobject_private_methods['toggle_state'].call(
										this,'normal'
									);
									alert(data['message']);
								}
								
							},
							function(jqXHR,textStatus,errorThrown ){
								jqobject_private_methods['toggle_state'].call(
									this,'normal'
								);
								alert(
									'Ajax request 錯誤'
								);
							},
							'0',
							this
						);
						
					}
				);
				
			},
			'toggle_state':function(the_state){
				var all_element_ids=[
					'_preview',
					'_pick_file_tip','_pick_file_button',
					'_crop_cancel_button','_crop_ok_button','_crop_tip','_crop_op_ingicon',
					'_re_crop_button',
					'_delete_button',
					'_restore_button',
					'_normal_op_ingicon',
				];
				switch(the_state){
					case 'normal':
						var show_element_ids=[
							'_preview','_pick_file_tip','_pick_file_button',
						];
						if(
							jQuery("#"+component_id+'_op').val()==='DO_DELETE' || 
							opts._value===''
						){
							
						}else{
							show_element_ids.push('_delete_button');
						}
						
						if(
							jQuery("#"+component_id+'_op').val()!=='DO_DELETE' &&
							(opts._before_crop!=='' || jQuery("#"+component_id+'_tmpfile_before_crop_uploadfile_id').val()!=='')
						){
							show_element_ids.push('_re_crop_button');
						}
						
						if(
							jQuery("#"+component_id+'_op').val()!=='DO_NO' 
						){
							show_element_ids.push('_restore_button');
						}
						
						break;
						
					case 'normal_op_ing':
						var show_element_ids=[
							'_preview','_normal_op_ingicon',
						];
						break;
						
					case 'crop':
						var show_element_ids=[
							'_preview','_crop_cancel_button','_crop_ok_button','_crop_tip',
						];
						break;
						
					case 'crop_op_ing':
						var show_element_ids=[
							'_preview','_crop_op_ingicon',
						];
						break;
						
								
					
					default:
				}
				var hide_element_ids=all_element_ids.filter(function(the_element_id){
					if(show_element_ids.indexOf(the_element_id)===-1){
						return true;
					}else{
						return false;
					}
				});
				show_element_ids=show_element_ids.map(
					function(the_element_id){
						return '#'+component_id+the_element_id;
					}
				);
				hide_element_ids=hide_element_ids.map(
					function(the_element_id){
						return '#'+component_id+the_element_id;
					}
				);
				jQuery(show_element_ids.join(',')).show();
				jQuery(hide_element_ids.join(',')).hide();
			}
		};
		
		var jqobject_public_methods={
			'check_is_in_op':function(){
				
				if(
					jQuery('#'+component_id+'_upload_ingicon').css('display')!=='none' || 
					jQuery('#'+component_id+'_crop_ingicon').css('display')!=='none' ||
					jQuery('#'+component_id+'_crop_ok_button').css('display')!=='none'
				){
					return '1';
				}else{
					return '0';
				}
			}
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

