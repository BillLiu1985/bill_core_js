(function(jQuery,bill_core){
	//先看有沒有引入bill_core
	if(bill_core===undefined){
		console.error('bill_core元件未啟動');
		return;
	}
	jQuery.bill_components_initial={
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_components_initial = function(default_value_source,environment_data_source){
		
		var get_jqobject=this;
		//先處理一般元件
		get_jqobject.find(
			'input[type="text"][component_type="input_text"],'+
			'input[type="radio"][component_type="input_radio"],'+
			'input[type="checkbox"][component_type="input_checkbox"],'+
			'input[type="hidden"][component_type="input_hidden"],'+
			'textarea[component_type="textarea"],'+
			'select[component_type="select"]'
		).each(
			function(){
				var temp_default_value=default_value_source[jQuery(this).attr('name')];
				var temp_environment_data=environment_data_source[jQuery(this).attr('name')];
				
				if( jQuery(this).is('input[type="text"]') ){
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						temp_default_value=jQuery('<div></div>').html(temp_default_value).text();
						jQuery(this).attr('value',temp_default_value);
					}
				}
				else if( jQuery(this).is('input[type="hidden"]') ){
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						temp_default_value=jQuery('<div></div>').html(temp_default_value).text();
						jQuery(this).attr('value',temp_default_value);
					}
				}
				else if( jQuery(this).is(':radio') ){
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						temp_default_value=jQuery('<div></div>').html(temp_default_value).text();
						if(jQuery(this).attr('value')==temp_default_value){
							jQuery(this).attr('checked',true);
						}else{
							jQuery(this).attr('checked',false);
						}
					}
				}
				else if(jQuery(this).is(':checkbox')){
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						temp_default_value=jQuery('<div></div>').html(temp_default_value).text();
						if( jQuery(this).attr('value')==temp_default_value ){
							jQuery(this).attr('checked',true);
						}else{
							jQuery(this).attr('checked',false);
						}
					}
				}
				else if( jQuery(this).is('textarea') ){
					if( bill_core.global_typeof(temp_default_value)==='string' ){
						jQuery(this).html( temp_default_value.replace(/<br \/>/g,"\n") );
					}
				}
				else if( jQuery(this).is('select') ){
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
		get_jqobject.find(
			'[component_type="ckeditor"],'+
			'[component_type="dyndatetime"],'+
			'[component_type="easy_datetimepicker"],'+
			'[component_type="easy_multirow"],'+
			'[component_type="easy_pic_crop"],'+
			'[component_type="easy_checkbox_group"],'+
			'[component_type="easy_radio_group"],'+
			'[component_type="easy_taiwan_address"],'+
			'[component_type="easy_select_relateds"],'+
			'[component_type="display_info"]'
		).each(
			function(){
				var the_original_name=jQuery(this).attr('name');
				the_element_id=jQuery(this).attr('id');

				var temp_default_value=default_value_source[jQuery(this).attr('name')];
				var temp_environment_data=environment_data_source[jQuery(this).attr('name')];
				var the_component_type=jQuery(this).attr('component_type');
				if(the_component_type=='ckeditor'){
					if(temp_default_value!==undefined){
						jQuery(this).html(CKEDITOR.tools.htmlEncode(temp_default_value));
					}
					var ckeditorconfig={
						'customConfig':jQuery(this).attr('customConfig'),
						'contentsCss':'',
						'width':jQuery(this).attr('editor_width'),
						'height':jQuery(this).attr('editor_height'),
						'baseHref':global_ProjectRootUrl
					};
					nevergiveup.setkcfinder(ckeditorconfig,global_ProjectRootUrl+'third_party/');
					page_inputs[the_element_id+'_editor'] = 
					CKEDITOR.replace(the_element_id,ckeditorconfig);
					page_inputs[the_element_id+'_editor'].on("instanceReady", 
						function(event)
						{
							return false;
						},null,null
					);
					if(jQuery(this).attr('initial_insert_from')!='' && (temp_default_value=='' || temp_default_value==undefined )){
						
						page_inputs[the_element_id+'_editor'].on("instanceReady", 
							function(event)
							{
								event.editor.insertHtml(jQuery('#'+event.listenerData).html(),'unfiltered_html');
							},null,jQuery(this).attr('initial_insert_from')
						);
						
					}
				}
				else if(the_component_type=='dyndatetime'){
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
				else if(the_component_type=='easy_datetimepicker'){
					if(temp_default_value===undefined || temp_default_value===null || temp_default_value==0){
						//temp_default_value=global_datebigint_toFormattedString('Ymd')+'000000';
						temp_default_value='';
					}
					
					jQuery(this).easy_datetimepicker(
						{
							'default_value':temp_default_value,
							'name':jQuery(this).attr('name'),
							'years_before_now':jQuery(this).attr('years_before_now'),
							'years_after_now':jQuery(this).attr('years_after_now'),
							'is_show_year':jQuery(this).attr('is_show_year'),
							'is_show_month':jQuery(this).attr('is_show_month'),
							'is_show_day':jQuery(this).attr('is_show_day'),
							'is_show_hour':jQuery(this).attr('is_show_hour'),
							'is_show_minute':jQuery(this).attr('is_show_minute'),
							'is_show_second':jQuery(this).attr('is_show_second'),
							'is_required':jQuery(this).attr('is_required')
						}
					);
				}
				else if(the_component_type=='easy_multirow'){
					if(temp_default_value===undefined || temp_default_value===null){
						temp_default_value=[];
					}
					jQuery(this).easy_multirow(
						{
							'obj_column_name':the_original_name,
							'default_value_source':temp_default_value,
							'environment_data_source':temp_environment_data,
							'row_template_container':jQuery(this).attr('row_template_container'),
							'counts_max':parseInt(jQuery(this).attr('counts_max'),10),
							'is_default_one_row':jQuery(this).attr('is_default_one_row')
						}
					);
				}
				else if(the_component_type=='easy_file_upload'){
					if(temp_default_value===undefined || temp_default_value===null){
						temp_default_value='';
					}
							
					jQuery(this).easy_file_upload(
						{
							'input_name':the_original_name,
							'default_value':temp_default_value,
							'file_type':jQuery(this).attr('file_type'),
							'process_upload_url':jQuery(this).attr('process_upload_url'),
							'process_download_url':jQuery(this).attr('process_download_url'),
							'uploading_icon_url':jQuery(this).attr('uploading_icon_url'),
							'file_tip':jQuery(this).attr('file_tip'),
							'preview_width':jQuery(this).attr('preview_width'),
							'max_width':jQuery(this).attr('max_width'),
							'preview_height':jQuery(this).attr('preview_height'),
							'output_width':jQuery(this).attr('output_width'),
							'output_height':jQuery(this).attr('output_height'),
							'is_required':jQuery(this).attr('is_required'),
							'csrf_token':jQuery(this).attr('csrf_token')
						}
					);
				}
				else if(the_component_type=='easy_pic_crop'){
					if(temp_default_value===undefined || temp_default_value===null){
						temp_default_value='';
					}
					var temp_default_newfile=default_value_source[jQuery(this).attr('name')+'_newfile'];						
					jQuery(this).easy_pic_crop(
						{
							'input_name':the_original_name,
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
				else if(the_component_type=='easy_checkbox_group'){
					if(temp_default_value===undefined || temp_default_value===null){
						temp_default_value='';
					}							
					jQuery(this).easy_checkbox_group(
						{
							'input_name':the_original_name,
							'environment_data_source':temp_environment_data,
							'default_value_source':temp_default_value,
							'count_width':parseInt(jQuery(this).attr('count_width'),10)
						}
					);
				}
				else if(the_component_type=='easy_radio_group'){
					if(temp_default_value===undefined || temp_default_value===null){
						temp_default_value='';
					}							
					jQuery(this).easy_radio_group(
						{
							'input_name':the_original_name,
							'environment_data_source':temp_environment_data,
							'default_value':temp_default_value,
							'count_width':parseInt(jQuery(this).attr('count_width'),10)
						}
					);
				}
				else if(the_component_type=='easy_taiwan_address'){
					if(temp_default_value===undefined || temp_default_value===null){
						temp_default_value={};
					}							
					jQuery(this).easy_taiwan_address(
						{
							'input_name':the_original_name,
							'type':jQuery(this).attr('type'),
							'default_value':{
								'city':temp_default_value.city,
								'area':temp_default_value.area,
								'road':temp_default_value.road,
								'lane':temp_default_value.lane,
								'alley':temp_default_value.alley,
								'number':temp_default_value.number,
								'floor':temp_default_value.floor,
								'others':temp_default_value.others
							},
							'is_required':jQuery(this).attr('is_required'),
							'limit_citys':jQuery(this).attr('limit_citys').split(',,,')
						}
					);
				}
				else if(the_component_type=='easy_select_relateds'){
					if(temp_default_value===undefined || temp_default_value===null){
						temp_default_value='';
					}							
					jQuery(this).easy_select_relateds(
						{
							'input_name':the_original_name,
							'count_limited':parseInt(jQuery(this).attr('count_limited'),10),
							'dialog_url':jQuery(this).attr('dialog_url'),
							'dialog_type':jQuery(this).attr('dialog_type'),
							'default_value':temp_default_value,
							'environment_data_source':temp_environment_data
						}
					);
				}
				else if(the_component_type=='display_info'){
					if(temp_default_value===undefined || temp_default_value===null){
						temp_default_value='';
					}							
					jQuery(this).text(temp_default_value);
				}
			}
		)
		
		return get_jqobject;
	};
}(jQuery,bill_core));

