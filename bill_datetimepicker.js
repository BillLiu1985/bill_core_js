(function(jQuery,bill_core){
	if(bill_core===undefined){
		console.error('bill_core元件未啟動');
		return;
	}
	
	//設定屬於bill_datetimepicker專屬的元件函式或元件設定預設值
	//default_value格式為datetimebigint(舉例：20141115205030)
	//input_name 為該物件資料儲存項之屬性
	jQuery.bill_datetimepicker={
		'defaults':{	
			'default_value':'',
			'input_name':'',
			'years_before_now':'2',
			'years_after_now':'10',
			'is_show_year':'1',
			'is_show_month':'1',
			'is_show_day':'1',
			'is_show_hour':'1',
			'is_show_minute':'1',
			'is_show_second':'1',
			'is_required':'0'
		}
	};
	
	//轉換元素成物件 或 執行物件方法
	jQuery.fn.bill_datetimepicker = function(param1,param2){
		var get_jqobject=this.filter('div[id]');
		
		//限制轉換元素的個數為1
		if(get_jqobject.length>1){
			bill_core.debug_console('bill_datetimepicker一次只能轉換一個,轉換的元素為賦予id的div','error');
			return;
		}else if(get_jqobject.length==0){
			return;
		}
		
		//若要執行物件方法 必須先檢查該元素是否已轉化為物件
		if(typeof(param1)=='string'){
			if(get_jqobject.attr('is_transformed_to_bill_datetimepicker')!=='1'){
				bill_core.debug_console('請先轉換元素為bill_datetimepicker','error');
				return;
			}
			
		}
		
		//物件方法
		var jqobject_scope_methods={
			'reload':function(opts){
				if(bill_core.global_typeof(opts)!=='object'){
					bill_core.debug_console('opts資料型態錯誤','error');
					return;
				}

				function refresh_input_value(){
					
					var selected_year=jQuery('#'+component_id+'_year').val();
					var selected_month=jQuery('#'+component_id+'_month').val();
					var selected_day=jQuery('#'+component_id+'_day').val();
					var selected_hour=jQuery('#'+component_id+'_hour').val();
					var selected_minute=jQuery('#'+component_id+'_minute').val();
					var selected_second=jQuery('#'+component_id+'_second').val();
					
					if( bill_core.string_is_solid(selected_year)==='1' ){
						
					}
					else{
						selected_year='0000';
					}
					
					if( bill_core.string_is_solid(selected_month)==='1' ){
						
					}
					else{
						selected_month='00';
					}
					
					if( bill_core.string_is_solid(selected_day)==='1' ){
						
					}
					else{
						selected_day='00';
					}
					
					if( bill_core.string_is_solid(selected_hour)==='1' ){
						
					}
					else{
						selected_hour='00';
					}
					
					if( bill_core.string_is_solid(selected_minute)==='1' ){
						
					}
					else{
						selected_minute='00';
					}
					
					if( bill_core.string_is_solid(selected_second)==='1' ){
						
					}
					else{
						selected_second='00';
					}
					
					jQuery('#'+component_id+'_value').val(
						selected_year+selected_month+selected_day+selected_hour+selected_minute+selected_second
					);
				}
				
		
				var input_default_value=opts.default_value
				var input_default_value_year;
				var input_default_value_month;
				var input_default_value_day;
				var input_default_value_hour;
				var input_default_value_minute;
				var input_default_value_second;
			
				if( bill_core.string_is_solid(input_default_value)==='1' ){
					
					var the_match_result=input_default_value.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
					if(the_match_result===null){
						input_default_value_year='';
						input_default_value_month='';
						input_default_value_day='';
						input_default_value_hour='';
						input_default_value_minute='';
						input_default_value_second='';
					}
					else{	
						input_default_value_year=the_match_result[1];
						input_default_value_month=the_match_result[2];
						input_default_value_day=the_match_result[3];
						input_default_value_hour=the_match_result[4];
						input_default_value_minute=the_match_result[5];
						input_default_value_second=the_match_result[6];
					}
				}
				
				
				var temp_html='';
				if( opts.is_show_year==='1' ){
					temp_html+=
					'<select reg_1="(^\\d{4}$)'+(opts.is_required==='1'?'':'|(^$)')+'" id="'+component_id+'_year" name="'+opts.input_name+'_year"></select>年';
				}
				else{
					temp_html+=
					'<select style="display:none;" reg_1="(^\\d{4}$)'+(opts.is_required==='1'?'':'|(^$)')+'" id="'+component_id+'_year"></select>';
				}
				
				if( opts.is_show_month==='1' ){
					temp_html+=
					'<select reg_1="(^\\d{2}$)'+(opts.is_required==='1'?'':'|(^$)')+'" id="'+component_id+'_month" name="'+opts.input_name+'_month"></select>月';
				}
				else{
					temp_html+=
					'<select style="display:none;"  reg_1="(^\\d{2}$)'+(opts.is_required==='1'?'':'|(^$)')+'" id="'+component_id+'_month"></select>';
				}
				
				if( opts.is_show_day==='1' ){
					temp_html+=
					'<select reg_1="(^\\d{2}$)'+(opts.is_required==='1'?'':'|(^$)')+'" id="'+component_id+'_day" name="'+opts.input_name+'_day"></select>日 ';
				}
				else{
					temp_html+=
					'<select style="display:none;"  reg_1="(^\\d{2}$)'+(opts.is_required==='1'?'':'|(^$)')+'" id="'+component_id+'_day"></select> ';
				}
				
				if(opts.is_show_hour==='1'){
					temp_html+=
					'<input type="text" maxlength="2" reg_1="(^[0-1][0-9]$)|(^[2][0-3]$)'+(opts.is_required==='1'?'':'|(^$)')+'" size="2" id="'+component_id+'_hour" name="'+opts.input_name+'_hour" value="" />時';
				}
				else{
					temp_html+=
					'<input style="display:none;" type="text" maxlength="2" reg_1="(^[0-1][0-9]$)|(^[2][0-3]$)'+(opts.is_required==='1'?'':'|(^$)')+'" size="2" id="'+component_id+'_hour" value="" />';
				}
				
				if(opts.is_show_minute==='1'){
					temp_html+=
					'<input type="text" maxlength="2" reg_1="(^[0-5][0-9]$)'+(opts.is_required==='1'?'':'|(^$)')+'" size="2" id="'+component_id+'_minute" name="'+opts.input_name+'_minute" value="" />分';
				}
				else{
					temp_html+=
					'<input style="display:none;"  type="text" maxlength="2" reg_1="(^[0-5][0-9]$)'+(opts.is_required==='1'?'':'|(^$)')+'" size="2" id="'+component_id+'_minute" value="" />';
				}
				
				if( opts.is_show_second==='1' ){
					temp_html+=
					'<input type="text" maxlength="2" reg_1="(^[0-5][0-9]$)'+(opts.is_required==='1'?'':'|(^$)')+'" size="2" id="'+component_id+'_second" name="'+opts.input_name+'_second" value="" />秒';
				}
				else{
					temp_html+=
					'<input style="display:none;" type="text" maxlength="2" reg_1="(^[0-5][0-9]$)'+(opts.is_required==='1'?'':'|(^$)')+'" size="2" id="'+component_id+'_second" value="" />';
				}
				
				
					
				temp_html+=	'<input type="hidden" id="'+component_id+'_value" name="'+opts.input_name+'" value="'+input_default_value+'" />';
					
				
				this.html(temp_html);
				
				var now_date = new Date();
				//getMonth() returns a 0-based number.
				var now_date_month = now_date.getMonth()+1;
				var now_date_day = now_date.getDate();
				var now_date_year = now_date.getFullYear();
				
				var year_range_start;
				var year_range_end;

				year_range_start=now_date_year-parseInt(opts.years_before_now,10);
				year_range_end=now_date_year+parseInt(opts.years_after_now,10);
				
				
				jQuery('#'+component_id+'_hour,'+'#'+component_id+'_minute,'+'#'+component_id+'_second').change(
					function(){
						refresh_input_value();
					}
				);
				jQuery('#'+component_id+'_hour').val(input_default_value_hour);
				jQuery('#'+component_id+'_minute').val(input_default_value_minute);
				jQuery('#'+component_id+'_second').val(input_default_value_second);
				
			
				jQuery('#'+component_id+'_year').change(
					function(){
						var selected_year=jQuery(this).val();
						var month_options_html='<option value="">請選擇</option>';
						if( bill_core.string_is_solid(jQuery(this).val()) ){
							selected_year=parseInt( selected_year,10 );
							var total_months=12;
							if(selected_year===year_range_start){
								
								for(var month_cursor=now_date_month;month_cursor<=total_months;month_cursor++){
									month_options_html+='<option value="'+(month_cursor<10?('0'+month_cursor):month_cursor)+'">'+(month_cursor<10?('0'+month_cursor):month_cursor)+'</option>';
								}	
							}
							else if(selected_year===year_range_end){
								if(total_months>=now_date_month){
									total_months=now_date_month;
								}
								for(var month_cursor=1;month_cursor<=total_months;month_cursor++){
									month_options_html+='<option value="'+(month_cursor<10?('0'+month_cursor):month_cursor)+'">'+(month_cursor<10?('0'+month_cursor):month_cursor)+'</option>';
								}	
							}
							else{
								for(var month_cursor=1;month_cursor<=total_months;month_cursor++){
									month_options_html+='<option value="'+(month_cursor<10?('0'+month_cursor):month_cursor)+'">'+(month_cursor<10?('0'+month_cursor):month_cursor)+'</option>';
								}	
							}
						}
						jQuery('#'+component_id+'_month').html(month_options_html);
						jQuery('#'+component_id+'_month').change();
					}
				);
				jQuery('#'+component_id+'_month').change(
					function(){
						var selected_year=parseInt(jQuery('#'+component_id+'_year').val(),10);
						var selected_month=jQuery(this).val();
						var day_options_html='<option value="">請選擇</option>';
						if( bill_core.string_is_solid(selected_month)==='1' ){
							selected_month=parseInt(selected_month,10);
							var total_days=bill_core.Date_daysInMonth(selected_year,selected_month);
							if((selected_year==year_range_start && selected_month==now_date_month)){
								for(var day_cursor=now_date_day;day_cursor<=total_days;day_cursor++){
									day_options_html+='<option value="'+(day_cursor<10?('0'+day_cursor):day_cursor)+'">'+(day_cursor<10?('0'+day_cursor):day_cursor)+'</option>';
								}
							}
							else if(selected_year==year_range_end && selected_month==now_date_month){
								
								if(total_days>=now_date_day){
									total_days=now_date_day;
								}
								for(var day_cursor=1;day_cursor<=total_days;day_cursor++){
									day_options_html+='<option value="'+(day_cursor<10?('0'+day_cursor):day_cursor)+'">'+(day_cursor<10?('0'+day_cursor):day_cursor)+'</option>';
								}	
							}
							else{
								for(var day_cursor=1;day_cursor<=total_days;day_cursor++){
									day_options_html+='<option value="'+(day_cursor<10?('0'+day_cursor):day_cursor)+'">'+(day_cursor<10?('0'+day_cursor):day_cursor)+'</option>';
								}	
							}
							
						}
						
						jQuery('#'+component_id+'_day').html(day_options_html);
						jQuery('#'+component_id+'_day').change();
					}
				);
				jQuery('#'+component_id+'_day').change(
					function(){
						refresh_input_value();
					}
				);
				
				var year_options_html='<option value="">請選擇</option>';
				for(var year_cursor=year_range_start;year_cursor<=year_range_end;year_cursor++){
					year_options_html+='<option value="'+year_cursor+'">'+year_cursor+'</option>';
				}
				
				jQuery('#'+component_id+'_year').html(year_options_html);
				if(input_default_value==''){
					jQuery('#'+component_id+'_year').change();
				}else{
					jQuery('#'+component_id+'_year').val(input_default_value_year);
					jQuery('#'+component_id+'_year').change();
					
					jQuery('#'+component_id+'_month').val(input_default_value_month);
					jQuery('#'+component_id+'_month').change();
					
					jQuery('#'+component_id+'_day').val(input_default_value_day);
					jQuery('#'+component_id+'_day').change();
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
		
		var opts = jQuery.extend( true,{}, jQuery.bill_datetimepicker.defaults, want_set_opts );
		get_jqobject.data(opts);
		opts=get_jqobject.data();
		
		var component_id=get_jqobject.attr('id');
		if(bill_core.global_typeof(opts.default_value)==='string'){
		
		}else{
			bill_core.debug_console('bill_datetimepicker元件啟動失敗,default_value參數資料型態錯誤','error');
			return;
		}
		
		if(get_jqobject.attr('is_transformed_to_bill_datetimepicker')!=='1'){
			jqobject_scope_methods.reload.call(get_jqobject,opts);
			get_jqobject.css('display','inline-block');				
			get_jqobject.attr('is_transformed_to_bill_datetimepicker','1');	
		}
		return get_jqobject;
	};
})(jQuery,bill_core);

