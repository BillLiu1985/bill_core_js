
/**
 * 建置網站常會用到的js函式庫
 * 引用該檔案前，需先引用jquery元件
 */
if(window.jQuery===undefined){
	console.error('jquery never used');
}


var bill_core={
	/*
		場景目錄，每個場景目錄都有自己的js資料夾
	*/
	'base_url':'',
	/**
	 * 對原生JS變數資料型態再做更詳細更具體的分類
	 *
	 * 原生JS變數資料型態(根據typeof運算子的可能結果)，如下述	
	 * object、boolean、function、number、string、undefined
	 *
	 * 而新規劃的資料型態，如下述
	 * Number.NaN(錯誤數字，計算失敗),Number.POSITIVE_INFINITY(錯誤數字，超過數字最大值),Number.NEGATIVE_INFINITY(錯誤數字，小於數字最小值),number(數字),
	 * string(字串),boolean(布林),null(null),object,function(函式),undefined(未定義),unknown(未知)
	 * 
	 * @param checked_var mixed 要檢測的變數
	 * @return string 資料型態名稱
	 */
	'global_typeof':function(checked_var){
		if(typeof(checked_var)==='number'){
			if(checked_var===Number.NaN){
				return 'Number.NaN';
			}else if(checked_var===Number.POSITIVE_INFINITY){
				return 'Number.POSITIVE_INFINITY';
			}else if(checked_var===Number.NEGATIVE_INFINITY){
				return 'Number.NEGATIVE_INFINITY'
			}else{
				return 'number';
			}
		}else if(typeof(checked_var)==='string'){
			return 'string';
		}else if(typeof(checked_var)==='boolean'){
			return 'boolean';
		}else if(typeof(checked_var)==='object'){
			if(checked_var===null){
				return 'null';
			}else{
				return 'object';
			}
		}else if(typeof(checked_var)==='function'){
			return 'function';
		}else if(typeof(checked_var)==='undefined'){
			return 'undefined';
		}else{
			return 'unknown';
		}
	},

	/**
	 * 
	 * 檢查輸入的變數是否為空
	 *
	 * @param mixed checked_var
	 * @return string
	 */
	'global_is_empty':function(checked_var){
		if(checked_var===undefined || checked_var===null || checked_var===''){
			return '1';
		}else{
			return '0';
		}
	},
	
	/**
	 * 
	 * 取得object的詳細內容
	 *
	 * @param object obj 要觀察的object
	 * @return string
	 */
	'global_objToString':function(obj) {
		var out = '';
		for (var i in obj)
		{
			
			out += i + ": " + obj[i] + "\n";
			
		}
		return out;
	},
	
	/**
	 * 
	 * 根據參數及樣板字串 轉換成字串
	 *
	 * @param string template_string 
	 * @param object params 物件
	 * @return string
	 *
	 */
	 'global_parse_template_string':function(template_string,params){
		if(this.global_typeof(template_string)!=='string'){
			alert('template_string argument error');
			return;
		}
		if(this.global_typeof(params)!=='object'){
			alert('params argument error');
			return;
		}
		
		return template_string.replace(
			/!!!(.+?)!!!/g, 
			function (match, capture) {
				if(params[capture]===undefined){
					return match;
				}
				return params[capture];
			}
		); // "gold ring|string"
		
	},
	
	/**
	 * 
	 * 偵測網頁瀏覽者之環境
	 *
	 * @return object
	 */
	'global_parse_http_user_agent':function() {
		//若device不為空字串 代表裝置是手機
		var return_data={
			'device':'',//若為有長度的字串 代表裝置是非電腦(可能是平板或手機或...)
			'browser_type':'',//瀏覽器類型
			'browser_version':'' //瀏覽器版本
		};
		
		if(navigator.userAgent.search(/iPod/i)!==-1){
			return_data['device']='iPod';
		}else if(navigator.userAgent.search(/iPhone/i)!==-1){
			return_data['device']='iPhone';
		}else if(navigator.userAgent.search(/iPad/i)!==-1){
			return_data['device']='iPad';
		}else if(navigator.userAgent.search(/iPad/i)!==-1){
			return_data['device']='iPad';
		}else if(navigator.userAgent.search(/Android/i)!==-1){
			if(navigator.userAgent.search(/mobile/i)!==-1){
				return_data['device']='Android Mobile';
			}else{
				return_data['device']='Android Tablet';
			}
		}else if(navigator.userAgent.search(/webOS/i)!==-1){
			return_data['device']='webOS';
		}else if(navigator.userAgent.search(/BlackBerry/i)!==-1){
			return_data['device']='BlackBerry';
		}else if(navigator.userAgent.search(/RIM Tablet/i)!==-1){
			return_data['device']='RIM Tablet';
		}
		
		if(navigator.userAgent.search(/MSIE/i)!==-1){
			
			return_data['browser_type']='MSIE';
			var temp_array=navigator.userAgent.split('; ');
			for(var kindex in temp_array){
				var temp_string=temp_array[kindex];
				if(this.string_is_start_with(temp_string,'MSIE ')==='1'){
					return_data['browser_version']=this.lobal_fetch_specific_string(temp_string,'MSIE ','');	
					break;
				}
			}
		}else if(navigator.userAgent.search(/Firefox/i)!==-1){	
			return_data['browser_type']='Firefox';
			
			var temp_array=navigator.userAgent.split(' ');
			for(var kindex in temp_array){
				var temp_string=temp_array[kindex];
				if(this.string_is_start_with('Firefox/',temp_string)==='1'){
					return_data['browser_version']=this.string_fetch_specific(temp_string,'Firefox/','');	
					break;
				}
			}
		}else if(navigator.userAgent.search(/Chrome/i)!==-1){		
			return_data['browser_type']='Chrome';
			var temp_array=navigator.userAgent.split(' ');
			for(var kindex in temp_array){
				var temp_string=temp_array[kindex];
				if(this.string_is_start_with(temp_string,'Chrome/')==='1'){
					return_data['browser_version']=this.string_fetch_specific(temp_string,'Chrome/','');	
					break;
				}
			}
		}else if(navigator.userAgent.search(/Safari/i)!==-1){	
			return_data['browser_type']='Safari';
			var temp_array=navigator.userAgent.split(' ');
			for(var kindex in temp_array){
				var temp_string=temp_array[kindex];
				if(this.string_is_start_with(temp_string,'Safari/')==='1'){
					return_data['browser_version']=this.string_fetch_specific(temp_string,'Safari/','');	
					break;
				}
			}
		}else if(navigator.userAgent.search(/Opera/i)!==-1){
			//Opera的user_agent比較詭異 版本不好判斷
			return_data['browser_type']='Opera';	
		}
		
		return return_data;
	},
	/**
	 * 取得某個區域下或符合特定條件下的輸入資料
	 * @param jquery_expression 
	 * @param fetch_way meets_the(符合條件)、under_the(某個區域下)
	 * @return object
	 */
	'global_collect_inputs_data':function(jquery_expression,fetch_way) {
		//抓不到資料 返回null
		if(this.global_typeof(jquery_expression)!=='string'){
			this.debug_console('jquery_expression error','error')
			return;
		}
		if(this.global_typeof(fetch_way)!=='string'){
			this.debug_console('fetch_way error','error')
			return;
		}
		if( fetch_way!=='meets_the' && fetch_way!=='under_the' ){
			this.debug_console('fetch_way error','error')
			return;
		
		}
		var return_data={
			'values':{},
			'human_read_names':{},
			'reg_1s':{},
			'error_msg_1s':{},
			'all_inputs_jqobject':null
		};
		var values=return_data['values'];
		var human_read_names=return_data['human_read_names'];
		var reg_1s=return_data['reg_1s'];
		var error_msg_1s=return_data['error_msg_1s'];
		
		var fetch_jquery_expression_input_radio=
			'input[type="radio"][name][name!=""]:checked';			
		var fetch_function_input_radio=function(){
			var the_input_jqobject=jQuery(this);
			var the_input_name;
			var the_input_value;
			
			the_input_name=the_input_jqobject.attr('name');
			the_input_value=the_input_jqobject.val();
			values[the_input_name]=the_input_value;
			
			human_read_names[the_input_name]=null;
			reg_1s[the_input_name]=null;
			error_msg_1s[the_input_name]=null;
		}
		
		var fetch_jquery_expression_textarea=
			'textarea[name][name!=""]';
		var fetch_function_textarea=function(){
			var the_input_jqobject=jQuery(this);
			var the_input_name;
			var the_input_human_read_name;
			var the_input_reg_1;
			var the_input_error_msg_1;
			var the_input_value;
			
			the_input_name=the_input_jqobject.attr('name');
			the_input_human_read_name=the_input_jqobject.attr('human_read_name');
			the_input_reg_1=the_input_jqobject.attr('reg_1');
			the_input_error_msg_1=the_input_jqobject.attr('error_msg_1');
		
			if( the_input_jqobject.is('[component_type="ckeditor"]') ){
				the_input_value=jQuery.bill_bridge_ckeditor.real_objs[the_input_jqobject.attr('id')].getData();
			}else{
				the_input_value=the_input_jqobject.val();
			}
			
			values[the_input_name]=the_input_value;
			
			if( bill_core.global_typeof(the_input_human_read_name)==='string' ){
				human_read_names[the_input_name]=the_input_human_read_name;
			}else{
				human_read_names[the_input_name]=null;
			}
			if( bill_core.global_typeof(the_input_reg_1)==='string' ){
				reg_1s[the_input_name]=the_input_reg_1;
			}else{
				reg_1s[the_input_name]=null;
			}
			if( bill_core.global_typeof(the_input_error_msg_1)==='string' ){
				error_msg_1s[the_input_name]=the_input_error_msg_1;
			}else{
				error_msg_1s[the_input_name]=null;
			}
			
		}
		
		
		
		var checkbox_values={};
		var fetch_jquery_expression_input_checkbox=
			'input[type="checkbox"][name][name!=""]:checked';
		var fetch_function_input_checkbox=function(){
			var the_input_jqobject=jQuery(this);
			var the_input_name;
			var the_input_value;
			
			
			the_input_name=the_input_jqobject.attr('name');
			
			the_input_value=the_input_jqobject.val();
			
			if( checkbox_values.hasOwnProperty(the_input_name)===false ){
				checkbox_values[the_input_name]=[];
				values[the_input_name]='';
			}
			checkbox_values[the_input_name].push(the_input_value);
			
			human_read_names[the_input_name]=null;
			reg_1s[the_input_name]=null;
			error_msg_1s[the_input_name]=null;
		}
		
		var select_values={};
		var fetch_jquery_expression_select=
			'select[name][name!=""]';
		var fetch_function_select=function(){
			var the_input_jqobject=jQuery(this);
			var the_input_name;
			var the_input_human_read_name;
			var the_input_reg_1;
			var the_input_error_msg_1;
			var the_input_value;
			
			the_input_name=the_input_jqobject.attr('name');
			the_input_human_read_name=the_input_jqobject.attr('human_read_name');
			the_input_reg_1=the_input_jqobject.attr('reg_1');
			the_input_error_msg_1=the_input_jqobject.attr('error_msg_1');
		
			
			if( select_values.hasOwnProperty(the_input_name)===false ){
				select_values[the_input_name]=[];
				values[the_input_name]='';
			}
			the_input_jqobject.find('option:selected').each(
				function(){
					select_values[the_input_name].push($(this).val());
				}
			)
			
			if( bill_core.global_typeof(the_input_human_read_name)==='string' ){
				human_read_names[the_input_name]=the_input_human_read_name;
			}else{
				human_read_names[the_input_name]=null;
			}
			if( bill_core.global_typeof(the_input_reg_1)==='string' ){
				reg_1s[the_input_name]=the_input_reg_1;
			}else{
				reg_1s[the_input_name]=null;
			}
			if( bill_core.global_typeof(the_input_error_msg_1)==='string' ){
				error_msg_1s[the_input_name]=the_input_error_msg_1;
			}else{
				error_msg_1s[the_input_name]=null;
			}
			
		}
		
		var fetch_jquery_expression_others=
			'input[type="text"][name][name!=""],'+
			'input[type="date"][name][name!=""],'+
			'input[type="hidden"][name][name!=""],'+
			'input[type="password"][name][name!=""],'+
			'input[type="file"][name][name!=""]';
		var fetch_function_others=function(){
			var the_input_jqobject=jQuery(this);
			var the_input_name;
			var the_input_human_read_name;
			var the_input_reg_1;
			var the_input_error_msg_1;
			var the_input_value;
			
			the_input_name=the_input_jqobject.attr('name');
			the_input_human_read_name=the_input_jqobject.attr('human_read_name');
			the_input_reg_1=the_input_jqobject.attr('reg_1');
			the_input_error_msg_1=the_input_jqobject.attr('error_msg_1');
			
			the_input_value=the_input_jqobject.val();
			values[the_input_name]=the_input_value;
				
			if( bill_core.global_typeof(the_input_human_read_name)==='string' ){
				human_read_names[the_input_name]=the_input_human_read_name;
			}else{
				human_read_names[the_input_name]=null;
			}
			if( bill_core.global_typeof(the_input_reg_1)==='string' ){
				reg_1s[the_input_name]=the_input_reg_1;
			}else{
				reg_1s[the_input_name]=null;
			}
			if( bill_core.global_typeof(the_input_error_msg_1)==='string' ){
				error_msg_1s[the_input_name]=the_input_error_msg_1;
			}else{
				error_msg_1s[the_input_name]=null;
			}
			
		}
			
		if(fetch_way==='meets_the' || fetch_way==='under_the'){
			var source_range;
			if(fetch_way==='meets_the'){
				source_range=jQuery(jquery_expression);
			}else if(fetch_way==='under_the'){
				source_range=jQuery(jquery_expression).find('*');
			}
			
			var fetch_target_input_radio=source_range.filter(fetch_jquery_expression_input_radio);
			var fetch_target_textarea=source_range.filter(fetch_jquery_expression_textarea);
			var fetch_target_input_checkbox=source_range.filter(fetch_jquery_expression_input_checkbox);
			var fetch_target_select=source_range.filter(fetch_jquery_expression_select);
			var fetch_target_others=source_range.filter(fetch_jquery_expression_others);
			source_range.each(
				function(){
					if(jQuery(this).is(fetch_target_input_radio)){
						fetch_function_input_radio.call(this)
					}else if(jQuery(this).is(fetch_target_textarea)){
						fetch_function_textarea.call(this)
					}else if(jQuery(this).is(fetch_target_input_checkbox)){
						fetch_function_input_checkbox.call(this)
					}else if(jQuery(this).is(fetch_target_select)){
						fetch_function_select.call(this)
					}else if(jQuery(this).is(fetch_target_others)){
						fetch_function_others.call(this)
					}
				}
			);
			
			for(var input_name in checkbox_values){
				var temp_array=checkbox_values[input_name].map(
					function(element){
						return element.
						replace(/[\|\,]/g,
							function(match){
								if(match==='|'){
									return '|vertical_line|';
								}else if(match===','){
									return '|comma|';
								}
							}
						);
					}
				)
				values[input_name]=temp_array.join(',,,');
			}
			
			for(var input_name in select_values){
				var temp_array=select_values[input_name].map(
					function(element){
						return element.
						replace(/[\|\,]/g,
							function(match){
								if(match==='|'){
									return '|vertical_line|';
								}else if(match===','){
									return '|comma|';
								}
							}
						);
					
					}
				)
				values[input_name]=temp_array.join(',,,');
			}
			return_data['all_inputs_jqobject']=
				fetch_target_input_radio.
				add(fetch_target_textarea).
				add(fetch_target_input_checkbox).
				add(fetch_target_select).
				add(fetch_target_others);
		}
		
		if( Object.keys(values).length==0 ){
			return_data['values']=null;
			return_data['human_read_names']=null;
			return_data['reg_1s']=null;
			return_data['error_msg_1s']=null;
		}
		
		return return_data;
	},
	'string_array_to_multivalue':function(the_array){
		if(Array.isArray(the_array)){
			
		}else{
			return '';
		}
		var temp_map={
			'|':'|vertical_line|',
			',':'|comma|'
		}
		var temp_array=the_array.map(
			function(element){
				return element.
				replace(/[\|\,]/g,
					function(match){
						return temp_map[match];
					}
				);
			
			}
		)
		
		return temp_array.join(',,,');
	},
	'string_multivalue_to_array':function(the_multivalue){
		if(this.global_typeof(the_multivalue)==='string'){
			
		}else{
			return [];
		}
		var temp_map={
			'|vertical_line|':'|',
			'|comma|':','
		}
		var temp_array=the_multivalue.split(',,,');
		temp_array=temp_array.map(
			function(element){
				return element.
				replace(/\|.+?\|/g,
					function(match){
						return temp_map[match];
					}
				);
				;
			
			}
		);
		
		return temp_array;
	},
	/**
	 * 檢查輸入的變數是否為有長度字串 
	 * @param checked_var mixed 要檢測的變數
	 * @return string
	 */
	'string_is_solid':function(checked_var){
		if(this.global_typeof(checked_var)!=='string'){
			return '0';
		}
		if(checked_var===''){
			return '0';
		}
		return '1';//若變數的資料型態是string且不為空，則返回'1'
	},

	/**
	 * 
	 * 檢查輸入的字串是否以特定字串開頭
	 *
	 * @param string testword 被檢查的字串
	 * @param string subword 該特定字串
	 * @return string
	 */
	'string_is_start_with':function(testword,subword) {
		if(this.string_is_solid(subword)==='1' &&  this.string_is_solid(testword)==='1'){
		
		}else{
			return '0';
		}
		var the_reg_pattern=new RegExp("^"+this.validate_regexp_escape(subword), '')
		if(the_reg_pattern.test(testword)){
			return '1';
		}else{
			return '0';
		}
	},

	/**
	 * 
	 * 檢查輸入的字串是否以特定字串結尾
	 *
	 * @param string testword 被檢查的字串
	 * @param string subword 該特定字串
	 * @return string
	 */
	'string_is_end_with':function(testword,subword) {
		if(this.string_is_solid(subword)==='1' &&  this.string_is_solid(testword)==='1'){
		
		}else{
			return '0';
		}
		var the_reg_pattern=new RegExp(this.validate_regexp_escape(subword)+'$', '')
		if(the_reg_pattern.test(testword)){
			return '1';
		}else{
			return '0';
		}
	},

	/**
	 * 
	 * 將特定字首字串及特定字尾字串的方式，去取得中間的字串
	 *
	 * @param string source_string 要處理的來源字串
	 * @param string start_string 特定字首字串
	 * @param string end_string 特定字尾字串
	 * @return string 中間的字串
	 *
	 * 舉例:
	 * var the_string='data_row_a80235_id';
	 * var the_fetch_string=bill_core.string_fetch_specific(the_string,'data_row_1','_id');
	 * console.log(the_fetch_string);
	 * output為 a80235
	 *
	 */
	 'string_fetch_specific':function(source_string,start_string,end_string){
		if(this.global_typeof(source_string)!=='string'){
			alert('source_string argument error');
			return;
		}
		if(this.global_typeof(start_string)!=='string'){
			alert('start_string argument error');
			return;
		}
		if(this.global_typeof(end_string)!=='string'){
			alert('end_string argument error');
			return;
		}
		
		start_string=this.validate_regexp_escape(start_string);
		end_string=this.validate_regexp_escape(end_string);

		var temp_reg=new RegExp('^'+start_string+'([\\s\\S]+)'+end_string+'$');
		var temp_result=temp_reg.exec(source_string);
		if(temp_result===null){
			return '';
		}else{
			return temp_result[1];
		}
		
	},
	
	/**
	 * 
	 * 返回指定長度的數字字串，不足長度的，向左補0
	 *
	 * @param number num 要處理的數字
	 * @param number digits_count 指定的長度
	 * @return string
	 *
	 */
	'string_add_zero':function(num,digits_count,radix){
		var return_string='';
		if(digits_count===undefined){
			digits_count=2;
		}
		if(radix===undefined){
			radix=10;
		}
		if(this.global_typeof(num)!=='number'){
			this.debug_console('bill_core.'+arguments.callee.name+' num error!','error');
			return;
		}else{
			return_string=num.toString(radix);
			if(digits_count<return_string.length){
				this.debug_console('bill_core.'+arguments.callee.name+' num error!','error');
				return;
			}
		}
		var zero_counts=digits_count-return_string.length;
		
		for( var temp_counts=1;temp_counts<=zero_counts;temp_counts++ ){
			return_string='0'+return_string;
		}
			
		return  return_string;
	},
	'string_pad':function(the_string,pad_char,need_length,direction){
		var return_result='';
		if(this.global_typeof(the_string)!=='string'){
			this.debug_console('bill_core.'+arguments.callee.name+' the_string error!','error');
			return return_result;
		}
		if(
			this.global_typeof(pad_char)!=='string' || 
			pad_char.length!==1
		){
			this.debug_console('bill_core.'+arguments.callee.name+' pad_char error!','error');
			return return_result;
		}
		if(
			this.global_typeof(need_length)!=='number' ||
			need_length<1
		){
			this.debug_console('bill_core.'+arguments.callee.name+' need_length error!','error');
			return return_result;
		}
		if(
			this.global_typeof(direction)!=='string' || 
			['left','right'].indexOf(direction)===-1
		){
			this.debug_console('bill_core.'+arguments.callee.name+' direction error!','error');
			return return_result;
		}
		if(the_string.length>=need_length){
			return_result=the_string.substr(the_string,need_length);
			return return_result;
		}
		var pad_counts=need_length-the_string.length;
		return_result=the_string;
		if(direction==='left'){
			for( var temp_counts=1;temp_counts<=pad_counts;temp_counts++ ){
				return_result=pad_char+return_result;
			}
		}else if(direction==='right'){
			for( var temp_counts=1;temp_counts<=pad_counts;temp_counts++ ){
				return_result=return_result+pad_char;
			}
		}
		return  return_result;
	},
	/**
	 * 
	 * 確保變數返回的資料是字串
	 *
	 * @param mixed checked_var 
	 * @return string
	 *
	 */
	'string_ensure':function(checked_var) {

		var checked_var_type=this.global_typeof(checked_var);
		if(checked_var_type=='number'){
			return checked_var.toString();
		}else if(checked_var_type=='boolean'){
			return checked_var.toString();
		}else if(checked_var_type=='string'){
			return checked_var;
		}else{
			return '';
		}

	},

	/**
	 * 
	 * 為數字加千分位
	 *
	 * @param number num 
	 * @return string
	 *
	 */
	'string_add_thousand_separator_to':function(num){
		var n = num.toString(), p = n.indexOf('.');
		return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
			return p<0 || i<p ? ($0+',') : $0;
		});
	},

	/**
	 * 
	 * 若字串開始有出現特定字串則移除掉
	 *
	 * @param string source_string 要處理的來源字串
	 * @param string start_string 該特定字串
	 * @return string 返回一個處理過後的新字串
	 *
	 * 舉例:
	 * var the_string='data_row_id_a80235';
	 * var the_result_string=bill_core.string_remove_start(the_string,'data_row_id_');
	 * console.log(the_result_string);
	 * output為 a80235
	 *
	 */
	'string_remove_start':function(source_string,start_string){
		if(this.global_typeof(source_string)!=='string'){
			alert('source_string argument error');
			return;
		}

		if(this.global_typeof(start_string)!=='string'){
			alert('start_string argument error');
			return;
		}

		start_string=this.validate_regexp_escape(start_string);
		var temp_reg=new RegExp('^'+start_string+'([\\s\\S]+)$');
		var temp_result=temp_reg.exec(source_string);
		if(temp_result===null){
			return source_string;
		}else{
			return temp_result[1];
		}
		
	},
	
	/**
	 * 
	 * 若字串結尾有出現特定字串則移除掉
	 *
	 * @param string source_string 要處理的來源字串
	 * @param string end_string 該特定字串
	 * @return string 返回一個處理過後的新字串
	 *
	 * 舉例:
	 * var the_string='a80235_data_row_id';
	 * var the_result_string=bill_core.string_remove_end(the_string,'_data_row_id');
	 * console.log(the_result_string);
	 * output為 a80235
	 *
	 */
	'string_remove_end':function(source_string,end_string){
		if(this.global_typeof(source_string)!=='string'){
			alert('source_string argument error');
			return;
		}

		if(this.global_typeof(end_string)!=='string'){
			alert('end_string argument error');
			return;
		}

		end_string=this.validate_regexp_escape(end_string);
		var temp_reg=new RegExp('^([\\s\\S]+)'+end_string+'$');
		var temp_result=temp_reg.exec(source_string);
		if(temp_result===null){
			return source_string;
		}else{
			return temp_result[1];
		}
		
	},
	 'string_replace':function(source_string,sub_string,new_sub_string){
		if(this.global_typeof(source_string)!=='string'){
			alert('source_string argument error');
			return;
		}
		if(this.global_typeof(sub_string)!=='string'){
			alert('sub_string argument error');
			return;
		}
		if(this.global_typeof(new_sub_string)!=='string'){
			alert('new_sub_string argument error');
			return;
		}
		
		sub_string=this.validate_regexp_escape(sub_string);

		return source_string.replace(
			new RegExp(sub_string,'g'), 
			new_sub_string
		)
		
	},
	'string_random_word':function(wordlength,exclude_chars){
		var return_result='';
		var args_illegal_is_found='0';
		if ( 
			this.global_typeof(wordlength)==='number' && wordlength>=0
		) {
			
		}else{
			args_illegal_is_found='1';
			this.debug_console('bill_core.'+arguments.callee.name+' wordlength error!','error');
		}
		if ( 
			this.global_typeof(exclude_chars)==='string'
		) {
			
		}else{
			args_illegal_is_found='1';
			this.debug_console('bill_core.'+arguments.callee.name+' exclude_chars error!','error');
		}
		if(args_illegal_is_found==='1'){
			return return_result;
		}
		
		var sGenerator = "";

		var possible_chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ1234567890';
		possible_chars=possible_chars.replace(
			new RegExp('['+this.validate_regexp_escape(exclude_chars)+']','g'),
			''
		);
		var possible_chars_count = possible_chars.length;

		for (var tmp_cursor = 1; tmp_cursor <= wordlength; tmp_cursor++) {
			sGenerator += possible_chars[this.number_int_random(0,possible_chars_count-1)];
		}
		return_result=sGenerator;
		return return_result;
		
	},
	 'escape_html_specialchars':function(the_html){
		var return_result='';
		if(this.global_typeof(the_html)!=='string'){
			this.debug_console('bill_core.'+arguments.callee.name+' the_html error!','error');
			return return_result;
		}
		var temp_map={
			'\'':'&#039;',
			'"':'&quot;',
			'&':'&amp;',
			'<':'&lt;',
			'>':'&gt;'
		};
		return_result=the_html.
			replace(/['"&<>]/g,
				function(match){
					return temp_map[match];
				}
			);
		return return_result;
	},
	 'inverse_escape_html_specialchars':function(the_html){
		var return_result='';
		if(this.global_typeof(the_html)!=='string'){
			this.debug_console('bill_core.'+arguments.callee.name+' the_html error!','error');
			return return_result;
		}
		var temp_map={
			'&#039;':'\'',
			'&quot;':'"',
			'&amp;':'&',
			'&lt;':'<',
			'&gt;':'>'
		};
		return_result=the_html.
			replace(/&.+?;/g,
				function(match){
					return temp_map[match];
				}
			);
		return return_result;
	},
	/**
	 * 
	 * 將日期以指定的格式輸出,這邊的格式是依照php的日期格式
	 *
	 * @param string the_datetimebigint 日期
	 * @param string the_format 格式
	 * @return string
	 */
	'datetimebigint_toFormattedString':function(the_datetimebigint,the_format){
		if(this.string_is_solid(the_datetimebigint)==='1'){
		}else{
			return '';
			/*
			var now_datetime=new Date();
			the_datetimebigint=
				now_datetime.getFullYear().toString()+
				this.string_add_zero((now_datetime.getMonth()+1),2)+
				this.string_add_zero(now_datetime.getDate(),2)+
				this.string_add_zero(now_datetime.getHours(),2)+
				this.string_add_zero(now_datetime.getMinutes(),2)+
				this.string_add_zero(now_datetime.getSeconds(),2);
				*/
		}
		
		var the_match_result=the_datetimebigint.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
		if(the_match_result===null){
			return '';
		}else{
			var the_parsed_year=the_match_result[1];
			var the_parsed_month=the_match_result[2];
			var the_parsed_month_alias_1='';
			switch(the_parsed_month) {
				case '01':
					the_parsed_month_alias_1='Jan';
					break;
				case '02':
					the_parsed_month_alias_1='Feb';
					break;
				case '03':
					the_parsed_month_alias_1='Mar';
					break;
				case '04':
					the_parsed_month_alias_1='Apr';
					break;
				case '05':
					the_parsed_month_alias_1='May';
					break;
				case '06':
					the_parsed_month_alias_1='Jun';
					break;
				case '07':
					the_parsed_month_alias_1='Jul';
					break;
				case '08':
					the_parsed_month_alias_1='Aug';
					break;
				case '09':
					the_parsed_month_alias_1='Sep';
					break;
				case '10':
					the_parsed_month_alias_1='Oct';
					break;
				case '11':
					the_parsed_month_alias_1='Nov';
					break;
				case '12':
					the_parsed_month_alias_1='Dec';
					break;				
				default:
			} 
			var the_parsed_day=the_match_result[3];
			var the_parsed_hour=the_match_result[4];
			var the_parsed_minute=the_match_result[5];
			var the_parsed_second=the_match_result[6];
		
			return the_format.replace('Y',the_parsed_year).
			replace('y',the_parsed_year.substr(-2)).
			replace('m',the_parsed_month).
			replace('n',this.string_remove_start(the_parsed_month,'0')).
			replace('M',the_parsed_month_alias_1).
			replace('d',the_parsed_day).
			replace('j',this.string_remove_start(the_parsed_day,'0')).
			replace('H',the_parsed_hour).
			replace('i',the_parsed_minute).
			replace('s',the_parsed_second);
		}
	},

	/**
	 * 
	 * 剖析日期 返回 相關資訊
	 *
	 * @param string the_datetimebigint 日期
	 * @return object
	 */
	'datetimebigint_parse':function(the_datetimebigint){
		if(this.string_is_solid(the_datetimebigint)==='1'){
		}else{
			var now_datetime=new Date();
			the_datetimebigint=
				now_datetime.getFullYear().toString()+
				this.string_add_zero((now_datetime.getMonth()+1),2)+
				this.string_add_zero(now_datetime.getDate(),2)+
				this.string_add_zero(now_datetime.getHours(),2)+
				this.string_add_zero(now_datetime.getMinutes(),2)+
				this.string_add_zero(now_datetime.getSeconds(),2);
		}
		
		var the_match_result=the_datetimebigint.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
		if(the_match_result===null){
			return '';
		}else{
			var the_parsed_year=the_match_result[1];
			var the_parsed_month=the_match_result[2];
			var the_parsed_month_alias_1='';
			switch(the_parsed_month) {
				case '01':
					the_parsed_month_alias_1='Jan';
					break;
				case '02':
					the_parsed_month_alias_1='Feb';
					break;
				case '03':
					the_parsed_month_alias_1='Mar';
					break;
				case '04':
					the_parsed_month_alias_1='Apr';
					break;
				case '05':
					the_parsed_month_alias_1='May';
					break;
				case '06':
					the_parsed_month_alias_1='Jun';
					break;
				case '07':
					the_parsed_month_alias_1='Jul';
					break;
				case '08':
					the_parsed_month_alias_1='Aug';
					break;
				case '09':
					the_parsed_month_alias_1='Sep';
					break;
				case '10':
					the_parsed_month_alias_1='Oct';
					break;
				case '11':
					the_parsed_month_alias_1='Nov';
					break;
				case '12':
					the_parsed_month_alias_1='Dec';
					break;				
				default:
			} 
			var the_parsed_day=the_match_result[3];
			var the_parsed_hour=the_match_result[4];
			var the_parsed_minute=the_match_result[5];
			var the_parsed_second=the_match_result[6];
			
			return {
				'Y':the_parsed_year,
				'm':the_parsed_month,
				'M':the_parsed_month_alias_1,
				'd':the_parsed_day,
				'H':the_parsed_hour,
				'i':the_parsed_minute,
				's':the_parsed_second
			};
		}
	},

	/**
	 * 
	 * 將目前的日期時間以datetimebigint表示
	 *
	 * @param bool hour_is_zero 小時是否為0
	 * @param bool minute_is_zero 分鐘是否為0
	 * @param bool second_is_zero 秒數是否為0
	 * @return string
	 */
	'datetimebigint_now':function(hour_is_zero,minute_is_zero,second_is_zero){
		var now_datetime=new Date(),
		now_datetime_Y=now_datetime.getFullYear(),
		now_datetime_m=this.string_add_zero(now_datetime.getMonth()+1,2),
		now_datetime_d=this.string_add_zero(now_datetime.getDate(),2);
		
		if(hour_is_zero==='1'){
			now_datetime_H='00';
		}else{
			now_datetime_H=this.string_add_zero(now_datetime.getHours(),2);
		}
		
		if(minute_is_zero==='1'){
			now_datetime_i='00';
		}else{
			now_datetime_i=this.string_add_zero(now_datetime.getMinutes(),2);
		}
		if(second_is_zero==='1'){
			now_datetime_s='00';
		}else{
			now_datetime_s=this.string_add_zero(now_datetime.getSeconds(),2);
		}
		
		return now_datetime_Y+now_datetime_m+now_datetime_d+now_datetime_H+now_datetime_i+now_datetime_s;
	},

	/**
	 * 
	 * 將datetimebigint資料轉換成日期物件
	 *
	 * @param string source_datetimebigint 來源資料
	 * @return object
	 */
	'datetimebigint_to_Date':function(source_datetimebigint){
		var target_Date=null,
		source_datetimebigint_info=this.datetimebigint_parse(source_datetimebigint)
		;
		target_Date=new Date(
			parseInt(source_datetimebigint_info['Y'],10), 
			parseInt(source_datetimebigint_info['m'],10)-1, 
			parseInt(source_datetimebigint_info['d'],10), 
			parseInt(source_datetimebigint_info['H'],10), 
			parseInt(source_datetimebigint_info['i'],10), 
			parseInt(source_datetimebigint_info['s'],10), 
			0
		);
		
		return target_Date;
	},

	
	/**
	 * 
	 * 對datetimebigint資料作日期時間新增操作
	 *
	 * @param  string source_datetimebigint 來源資料
	 * @param number nums 單位數字
	 * @param string nums_unit 單位
	 * @return string
	 */
	'datetimebigint_add':function(source_datetimebigint, nums, nums_unit) {
		var new_datetimebigint = '',

		source_Date=this.datetimebigint_to_Date(source_datetimebigint);

		switch (nums_unit) {
			case 'year':
				source_Date.setFullYear(source_Date.getFullYear()+nums);
				break;
			case 'month':
				source_Date.setMonth(source_Date.getMonth()+nums);
				break;
			case 'day':
				source_Date.setDate(source_Date.getDate()+nums);
				break;
			case 'hour':
				source_Date.setHours(source_Date.getHours()+nums);
				break;
			case 'minute':
				source_Date.setMinutes(source_Date.getMinutes()+nums);
				break;
			case 'second':
				source_Date.setSeconds(source_Date.getSeconds()+nums);
				break;
			case 'millisecond':
				source_Date.setMilliseconds(source_Date.getMilliseconds()+nums);
				break;
			default:	
		}
		new_datetimebigint=this.Date_to_datetimebigint(source_Date);
		return new_datetimebigint;
	},

	/**
	 * 
	 * datetimebigint資料之間的差距,a-b 回傳milliseconds
	 *
	 * @param string a_datetimebigint
	 * @param string b_datetimebigint
	 * @return number
	 */
	'datetimebigint_diff':function(a_datetimebigint,b_datetimebigint) {
		var datetimebigint_diff = '';
		var a_Date=this.datetimebigint_to_Date(a_datetimebigint);
		var b_Date=this.datetimebigint_to_Date(b_datetimebigint);
		datetimebigint_diff=a_Date-b_Date;
		return datetimebigint_diff;
	},

	
	/**
	 * 
	 * 取得日期the_datetimebigint所屬禮拜的第一天datetimebigint
	 *
	 * @param string the_datetimebigint
	 * @return string
	 */
	'datetimebigint_week_start':function(the_datetimebigint) {
		var return_datetimebigint;	
		var op_datetimebigint;
		var op_date;
		if(this.string_is_solid(the_datetimebigint)==='1'){
			op_datetimebigint=this.datetimebigint_trim_time(the_datetimebigint);
			op_date=this.datetimebigint_to_Date(op_datetimebigint);
		}else{
			op_datetimebigint=this.datetimebigint_now('1','1','1');
			op_date=this.datetimebigint_to_Date(op_datetimebigint);
		}
		
		return_datetimebigint=this.datetimebigint_add(op_datetimebigint, -1*((op_date.getDay()-0)/1), 'day');
		
		return return_datetimebigint;
	},

	/**
	 * 
	 * 去掉the_datetimebigint的時間部分
	 *
	 * @param string the_datetimebigint
	 * @return string
	 */
	'datetimebigint_trim_time':function(the_datetimebigint) {

		var op_datetimebigint;
		if(this.string_is_solid(the_datetimebigint)==='1'){}else{
			op_datetimebigint=this.datetimebigint_now('1','1','1');
			return op_datetimebigint;
		}
		var temp_array=this.datetimebigint_parse(the_datetimebigint);
		op_datetimebigint=temp_array['Y']+temp_array['m']+temp_array['d']+'000000';
		return op_datetimebigint;
	},

	/**
	 * 
	 * 去掉the_datetimebigint的分鐘秒數部分
	 *
	 * @param string the_datetimebigint
	 * @return string
	 */
	'datetimebigint_trim_minute_second':function(the_datetimebigint) {

		var op_datetimebigint;
		if(this.string_is_solid(the_datetimebigint)==='1'){}else{
			op_datetimebigint=this.datetimebigint_now('0','1','1');
			return op_datetimebigint;
		}
		var temp_array=this.datetimebigint_parse(the_datetimebigint);
		op_datetimebigint=temp_array['Y']+temp_array['m']+temp_array['d']+temp_array['H']+'0000';
		return op_datetimebigint;
	},

	/**
	 * 
	 * datetimebigint資料之間的差距,a-b 回傳hours
	 *
	 * @param string a_datetimebigint
	 * @param string b_datetimebigint
	 * @return number
	 */
	'datetimebigint_hours_diff':function(a_datetimebigint,b_datetimebigint) {
		var datetimebigint_diff = 0;
		if(
			a_datetimebigint === undefined || 
			b_datetimebigint === undefined
		){
			return datetimebigint_diff;
		}
		datetimebigint_diff=this.datetimebigint_diff(a_datetimebigint,b_datetimebigint);
		datetimebigint_diff=datetimebigint_diff/1000/60/60;
		return datetimebigint_diff;
	},

	/**
	 * 
	 * datetimebigint資料之間的差距,a-b 回傳days
	 *
	 * @param string a_datetimebigint
	 * @param string b_datetimebigint
	 * @return number
	 */
	'datetimebigint_days_diff':function(a_datetimebigint,b_datetimebigint) {
		var datetimebigint_diff = 0;
		if(
			a_datetimebigint === undefined || 
			b_datetimebigint === undefined
		){
			return datetimebigint_diff;
		}
		datetimebigint_diff=this.datetimebigint_diff(a_datetimebigint,b_datetimebigint);
		datetimebigint_diff=datetimebigint_diff/1000/60/60/24;
		return datetimebigint_diff;
	},
	'datetimebigint_from_human_string':function(the_string) {
		var return_result = '';
		if(
			this.global_typeof(the_string)!=='string'
		){
			this.debug_console('bill_core.'+arguments.callee.name+' the_string error!','error');
			return return_result;
		}
		if(
			the_string.length<5
		){
			return return_result;
		}
		return_result=the_string.replace(
			/[\/\- \:]/g, 
			function (match, capture) {
				return '';
			}
		);
		return_result=this.string_pad(return_result,'0',14,'right');
		return return_result;
	},
	/**
	 * 
	 * 去得知某年的某月有多少天
	 *
	 * @param number iYear
	 * @param number iMonth
	 * @return number 天數
	 */
	'Date_daysInMonth':function(iYear,iMonth)
	{
		return 32 - new Date(iYear, iMonth-1, 32).getDate();
	},

	
	/**
	 * 
	 * 將日期物件轉換成datetimebigint資料
	 *
	 * @param object source_Date 來源資料
	 * @return string
	 */
	'Date_to_datetimebigint':function(source_Date){
		var target_datetimebigint='';
		target_datetimebigint=
				source_Date.getFullYear().toString()+
				this.string_add_zero((source_Date.getMonth()+1),2)+
				this.string_add_zero(source_Date.getDate(),2)+
				this.string_add_zero(source_Date.getHours(),2)+
				this.string_add_zero(source_Date.getMinutes(),2)+
				this.string_add_zero(source_Date.getSeconds(),2);
		return target_datetimebigint;
	},
	
	/**
	 * 
	 * 將日期以指定的格式輸出,這邊的格式是依照php的日期格式
	 *
	 * @param object source_Date 日期
	 * @param string the_format 格式
	 * @return string
	 */
	'Date_toFormattedString':function(source_Date,the_format){
		if(source_Date instanceof Date){
		}else{
			source_Date=new Date();
		}
		
		
		var the_parsed_year=source_Date.getFullYear().toString();
		var the_parsed_month=this.string_add_zero((source_Date.getMonth()+1),2);
		var the_parsed_month_alias_1='';
		switch(the_parsed_month) {
			case '01':
				the_parsed_month_alias_1='Jan';
				break;
			case '02':
				the_parsed_month_alias_1='Feb';
				break;
			case '03':
				the_parsed_month_alias_1='Mar';
				break;
			case '04':
				the_parsed_month_alias_1='Apr';
				break;
			case '05':
				the_parsed_month_alias_1='May';
				break;
			case '06':
				the_parsed_month_alias_1='Jun';
				break;
			case '07':
				the_parsed_month_alias_1='Jul';
				break;
			case '08':
				the_parsed_month_alias_1='Aug';
				break;
			case '09':
				the_parsed_month_alias_1='Sep';
				break;
			case '10':
				the_parsed_month_alias_1='Oct';
				break;
			case '11':
				the_parsed_month_alias_1='Nov';
				break;
			case '12':
				the_parsed_month_alias_1='Dec';
				break;				
			default:
		}
		
		
		var the_parsed_day=this.string_add_zero(source_Date.getDate(),2);
		var the_parsed_hour=this.string_add_zero(source_Date.getHours(),2);
		var the_parsed_minute=this.string_add_zero(source_Date.getMinutes(),2);
		var the_parsed_second=this.string_add_zero(source_Date.getSeconds(),2);
	
		return the_format.replace('Y',the_parsed_year).
		replace('y',the_parsed_year.substr(-2)).
		replace('m',the_parsed_month).
		replace('n',this.string_remove_start(the_parsed_month,'0')).
		replace('M',the_parsed_month_alias_1).
		replace('d',the_parsed_day).
		replace('j',this.string_remove_start(the_parsed_day,'0')).
		replace('H',the_parsed_hour).
		replace('i',the_parsed_minute).
		replace('s',the_parsed_second);
		
	},
	
	/**
	 * 
	 * 讓js的執行停頓x秒
	 *
	 * @param number seconds 
	 * @return bool
	 */
	'time_sleep':function(seconds) {
		if(this.global_typeof(seconds)==='number'){
		
		}else{
			alert('seconds參數資料型態錯誤');
			return;
		}
		var milliseconds=seconds*1000;
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) >= milliseconds){
			break;
			}
		}
	},

	/**
	 * 
	 * parse 23 hour to am,pm hour
	 *
	 * @param number the_hour
	 * @return object
	 */
	'time_23_hour_parse':function(the_hour) {
		if(this.global_typeof(the_hour)!=='number'){
			the_hour=0;
		}
		var return_array=[];
		if(the_hour>=12){
			return_array.push('pm');
		}else{
			return_array.push('am');
		}
		if(the_hour==0){
			return_array.push(12);
		}else if(the_hour<=12){
			return_array.push(the_hour);
		}else{
			return_array.push(the_hour-12);
		}
		return return_array;
	},

	/**
	 * 
	 * parse am,pm hour to 23 hour
	 *
	 * @param string hour_type
	 * @param number hour_number
	 * @return number
	 */
	'time_get_23_hour':function(hour_type,hour_number) {
		if(this.global_typeof(hour_type)!=='string'){
			hour_type='am';
		}
		if(this.global_typeof(hour_number)!=='number'){
			hour_number=1;
		}
		var return_hour=0;
		if(hour_number==12){
			if(hour_type=='am'){
				return_hour=0;
			}else if(hour_type=='pm'){
				return_hour=12;
			}
		}else{
			if(hour_type=='am'){
				return_hour=hour_number;
			}else if(hour_type=='pm'){
				return_hour=hour_number+12;
			}
		}
		return return_hour;
	},

	/**
	 * 
	 * 取得檔案的附檔名
	 *
	 * @param string filename
	 * @return string
	 */
	'file_fetch_extension':function(filename){
		if(this.string_is_solid(filename)==='1'){
			var file_extension=/[.](.+?)$/.exec(filename);
			if(file_extension===null){
				return '';
			}
			if(this.string_is_solid(file_extension[1])==='1'){
				return file_extension[1].toLowerCase();
			}else{
				return '';
			}
		}else{
			return '';
		}
	},

	/**
	 * 
	 * 取得檔案的主要檔名
	 *
	 * @param string filename
	 * @return string
	 */
	'file_fetch_mainname':function(filename){
		if(this.string_is_solid(filename)==='1'){
			var file_mainname=/\/{0,1}(.+?)[.]{0,1}.*?$/.exec(filename);
			if(file_mainname===null){
				return '';
			}
			if(this.string_is_solid(file_mainname[1])==='1'){
				return file_mainname[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	},
	/**
	 * 
	 * 取得檔案的檔名
	 *
	 * @param string filename
	 * @return string
	 */
	'file_fetch_name':function(filename){
		var temp_reg=new RegExp('['+this.validate_regexp_escape('\\/')+']([^'+this.validate_regexp_escape('\\/')+']+)$');
		var temp_result=temp_reg.exec(filename);
		if(temp_result===null){
			return '';
		}else{
			return temp_result[1];
		}
	},
	/**
	 * 
	 * 變更url的query參數部分
	 * @param string the_url 
	 * @param object updated_params
	 * @return string
	 *
	 * 舉例:
	 * var the_url='http://www.xxxx.com.tw/index.php?a=1&b=2&c=3';
	 * var the_new_url=bill_core.url_set_params(the_url,{'a':'4','b':'5','c':'6'});
	 * echo the_new_url;
	 * output為 http://www.xxxx.com.tw/index.php?a=4&b=5&c=6
	 *
	 */
	 'url_set_params':function(the_url,updated_params){
		var result_string='';
		if(this.string_is_solid(the_url)==='1' && this.global_typeof(updated_params)==='object'){
		
		}else{
			return result_string;
		}
		var temp_splits=the_url.split('?');
		
		if(/^http[s]*:\/\/.+$|^.+$/.test(temp_splits[0])){
		
		}else{
			return result_string;
		}
		
		//若分割自串的結果為1則代表沒有query string
		if(temp_splits.length===1){
			var parsed_to_url=temp_splits[0];
			var new_query_parts=[];
			for(var param_name in updated_params){
				var param_value=updated_params[param_name];
				new_query_parts.push(param_name+'='+param_value);
			}
			if(new_query_parts.length==0){
				result_string=parsed_to_url;
			}else{
				result_string=parsed_to_url+'?'+new_query_parts.join('&');
			}
			return result_string;
		}
		if(temp_splits.length===2){
			var parsed_to_url=temp_splits[0];
			var parsed_to_query=temp_splits[1];
			var original_query_parts=parsed_to_query.split('&');
			var original_params={};
			var overwrite_params;
			for(var kindex in original_query_parts){
				var temp_array=original_query_parts[kindex].split('=');
				//若分割結果的長度為1 則代表該字串不合key=value格式
				if(temp_array.length==1){
					continue;
				}else{
					original_params[temp_array[0]]=temp_array[1];	
				}
			}
			overwrite_params=original_params;
			
			for(var param_name in updated_params){
				var param_value=updated_params[param_name];
				overwrite_params[param_name]=param_value;
			}
			
			var new_query_parts=[];
			for(var param_name in overwrite_params){
				var param_value=overwrite_params[param_name];
				new_query_parts.push(param_name+'='+param_value);
			}
			if(new_query_parts.length==0){
				result_string=parsed_to_url;
			}else{
				result_string=parsed_to_url+'?'+new_query_parts.join('&');
			}
			return result_string;
		}
	},
	
	/**
	 * 
	 * 用js的方式去模擬典擊連結
	 *
	 * @param string href
	 * @param string href_target_is_blank 
	 * @return 
	 *
	 */
	'url_custom_href_process':function(href,href_target_is_blank){
		window.open(href,(href_target_is_blank==='1'?'_blank':'_self'));
	},

	/**
	 * 
	 * 取得url的某query參數的值
	 *
	 * @param string the_url 
	 * @param string param_name 參數名稱
	 * @return string
	 *
	 */
	'url_get_param':function(the_url,param_name){
		var result_string='';
		if(this.string_is_solid(the_url)==='1'){
		
		}else{
			return result_string;
		}
		var temp_splits=the_url.split('?');
		
		if(/^http[s]*:\/\/.+$|^.+$/.test(temp_splits[0])){
		
		}else{
			return result_string;
		}
		
		//若分割自串的結果為1則代表沒有query string
		if(temp_splits.length===1){
			return result_string;
		}
		if(temp_splits.length===2){
			var parsed_to_query=temp_splits[1];
			var original_query_parts=parsed_to_query.split('&');
			for(var kindex in original_query_parts){
				var temp_array=original_query_parts[kindex].split('=');
				//若分割結果的長度為1 則代表該字串不合key=value格式
				if(temp_array.length==1){
					continue;
				}else{
					if(temp_array[0]===param_name){
						result_string=temp_array[1];
						break;
					}
				}
			}
			
			return result_string;
		}
	},
	/**
	 * 
	 * 取得url的完整路徑
	 * Ex: http://localhost/index.php
	 *
	 * @param string the_url 
	 * @return string
	 *
	 */
	'url_get_full':function(the_url){
		var result_string='';
		if(this.string_is_solid(the_url)==='1'){
		
		}else{
			this.debug_console('bill_core.'+arguments.callee.name+' the_url error!','error');
			return return_string;
		}
		if( this.string_is_start_with(the_url,'/')==='1' ){
			this.debug_console('bill_core.'+arguments.callee.name+' the_url format not support!','error');
			return return_string;
		}
		if(
			this.string_is_start_with(the_url,'http://')==='1' || 
			this.string_is_start_with(the_url,'https://')==='1'
		){
			return_string=the_url;
		}
		else{
			return_string=this.base_url+the_url;
		}
		return return_string;
	},
	'url_get_now_dir':function(){
		var return_string='';
		var temp_path=window.location.origin+window.location.pathname;
		if( this.string_is_end_with(temp_path,'/')==='1' ){
			return_string=temp_path;
		}else{
			var be_searched_index=temp_path.lastIndexOf('/');
			return_string=temp_path.substring(0,be_searched_index+1);
		}
		return return_string;
	},
	/**
	 * 
	 * 將num四捨五入取到小數點第pos位
	 *
	 * @param number num
	 * @param number pos  
	 * @return 
	 *
	 */
	'math_round':function(num,pos){
		var size = Math.pow(10, pos);
		return Math.round(num * size) / size;
	},

	/**
	 * 
	 * 磁碟容量單位轉換
	 *
	 * @param number num 多少byte
	 * @param number tounit  轉換到甚麼單位
	 * @return number
	 *
	 */
	'math_convert_from_bytenum':function(num,tounit){
		
		var tounitnum=0;	
		if(tounit=='KB'){
			tounitnum=this.math_round(num/1024,2);
		}else if(tounit=='MB'){	
			tounitnum=this.math_round(num/1024/1024,2);
			
		}else if(tounit=='GB'){
			tounitnum=this.math_round(num/1024/1024/1024,2);
		}else{
			tounitnum=num;
		}
		
		return tounitnum;
	},

	/**
	 * 
	 * 將正規表示法的特殊字元escape成一般字元
	 *
	 * @param string source_string 要處理的來源字串
	 * @return string 中間的字串
	 *
	 */
	 'validate_regexp_escape':function(source_string){
		var return_string='';
		if(this.global_typeof(source_string)!=='string'){
			alert('source_string argument error');
			return return_string;
		}
		return_string=source_string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,'\\$1');
		
		return return_string;
	},

	/**
	 * 
	 * 驗證用的物件式陣列，索引為驗證器名稱，值為驗證器內容
	 * 
	 */
	'validate_regexp_items':{
		'rrequired':'^[\\s\\S]+$',
		'orequired':'(^[\\s\\S]+$)|(^$)',
		'rname':'^[\\s\\S]+$',
		'oname':'(^[\\s\\S]+$)|(^$)',
		'rchineseword':'^[\\u4e00-\\u9fa5\\uf900-\\ufa2d]+$',
		'ochineseword':'(^[\\u4e00-\\u9fa5\\uf900-\\ufa2d]+$)|(^$)',
		'rid':'^[a-zA-Z]{1}[\\s\\S]*$',
		'oid':'(^[a-zA-Z]{1}[\\s\\S]*$)|(^$)',
		'rrelativeurl':'^[\\u4e00-\\u9fa5\\uf900-\\ufa2d\\w\\/.?=&\\- %]+$',
		'orelativeurl':'(^[\\u4e00-\\u9fa5\\uf900-\\ufa2d\\w\\/.?=&\\- %]+$)|(^$)',
		'rsubject':'^[\\s\\S]+$',
		'osubject':'(^[\\s\\S]+$)|(^$)',
		'raccount':'^[\\w]+$',
		'oaccount':'(^[\\w]+$)|(^$)',
		'raccount_1':'^[\\w@]{8,}$',
		'oaccount_1':'(^[\\w@]{8,}$)|(^$)',
		'rpassword':'^[\\w@]{6,30}$',
		'opassword':'(^[\\w@]{6,30}$)|(^$)',
		'rpassword_1':'^(?=.*[a-z0-9])(?=.*[a-z])(?=.*[0-9]).{6,15}$',
		'opassword_1':'(^(?=.*[a-z0-9])(?=.*[a-z])(?=.*[0-9]).{6,15}$)|(^$)',
		'rpname':'^[\\w\\u4e00-\\u9fa5\\- \\/]+$',
		'opname':'(^[\\w\\u4e00-\\u9fa5\\- \\/]+$)|(^$)',
		'inumber':'[^\\d]',
		'rnumber':'^[\\d]+$',
		'onumber':'(^[\\d]+$)|(^$)',
		'rnumber_greater_than_0':'^[1-9]{1}[\\d]*$',
		'onumber_greater_than_0':'(^[1-9]{1}[\\d]*$)|(^$)',
		'rsnumber':'^[\\d\\+\\-]+$',
		'osnumber':'(^[\\d\\+\\-]+$)|(^$)',
		'rfloat':'^[\\d.]+$',
		'ofloat':'(^[\\d.]+$)|(^$)',
		'rpositivenumber':'^[\\d]+$',
		'opositivenumber':'(^[\\d]+$)|(^$)',
		'rnegativenumber':'^-[\\d]+$',
		'onegativenumber':'(^-[\\d]+$)|(^$)',
		'rgrpertimes':'^[\\d]{1,3}$',
		'rgrprice':'^[\\d]{1,5}$',
		'ogrprice':'(^[\\d]{1,5}$)|(^$)',
		'rtel':'^(\\([\\d]+\\)){0,1}[\\d\\-\\+ #]+$',
		'otel':'(^(\\([\\d]+\\)){0,1}[\\d\\-\\+ #]+$)|(^$)',
		'iemail':'[^_0-9a-zA-Z\\.\\-@]',
		'remail':'^[_\\w\\.\\-]+@[\\w\\-]+(\\.[a-z]+)+$',
		'oemail':'(^[_\\w\\.\\-]+@[\\w\\-]+(\\.[a-z]+)+$)|(^$)',
		'rdatetime':'(^[\\d]{4}-[\\d]{2}-[\\d]{2} [0-1][\\d]:[0-5][\\d]:[0-5][\\d]$)|(^[\\d]{4}-[\\d]{2}-[\\d]{2} [2][0-3]:[0-5][\\d]:[0-5][\\d]$)',
		'odatetime':'(^[\\d]{4}-[\\d]{2}-[\\d]{2} [0-1][\\d]:[0-5][\\d]:[0-5][\\d]$)|(^[\\d]{4}-[\\d]{2}-[\\d]{2} [2][0-3]:[0-5][\\d]:[0-5][\\d]$)|(^$)',
		'rdatetime_no_second':'(^[\\d]{4}-[\\d]{2}-[\\d]{2} [0-1][\\d]:[0-5][\\d]$)|(^[\\d]{4}-\\d{2}-\\d{2} [2][0-3]:[0-5][\\d]$)',
		'odatetime_no_second':'(^[\\d]{4}-[\\d]{2}-[\\d]{2} [0-1][\\d]:[0-5][\\d]$)|(^[\\d]{4}-\\d{2}-\\d{2} [2][0-3]:[0-5][\\d]$)|(^$)',
		'rdate':'^[\\d]{4}\\-[\\d]{2}\\-[\\d]{2}$',
		'odate':'(^[\\d]{4}\\-[\\d]{2}\\-[\\d]{2}$)|(^$)',
		'rtime':'(^[0-1][\\d]:[0-5][\\d]:[0-5][\\d]$)|(^[2][0-3]:[0-5][\\d]:[0-5][\\d]$)',
		'otime':'(^[0-1][\\d]:[0-5][\\d]:[0-5][\\d]$)|(^[2][0-3]:[0-5][\\d]:[0-5][\\d]$)|(^$)',
		'rmvfile':'(\\.[wW][mM]$)|(\\.[mM][pP][gG]$)|(\\.[mM][pP][eE][gG]$)|(\\.[wW][mM][vV]$)|(\\.[mM][pP]4$)|(\\.[aA][vV][iI]$)',
		'omvfile':'(\\.[wW][mM]$)|(\\.[mM][pP][gG]$)|(\\.[mM][pP][eE][gG]$)|(\\.[wW][mM][vV]$)|(\\.[mM][pP]4$)|(\\.[aA][vV][iI]$)|(^$)',
		'rflvfile':'(\\.[sS][wW][fF]$)|(\\.[fF][lL][vV]$)',
		'oflvfile':'(\\.[sS][wW][fF]$)|(\\.[fF][lL][vV]$)|(^$)',
		'rcsvfile':'\\.[cC][sS][vV]$',
		'ocsvfile':'(\\.[cC][sS][vV]$)|(^$)',
		'rxlsfile':'\\.[xX][lL][sS]$',
		'oxlsfile':'(\\.[xX][lL][sS]$)|(^$)',
		'rtxtfile':'\\.[tT][xX][tT]$',
		'otxtfile':'(\\.[tT][xX][tT]$)|(^$)',
		'rdocfile':'(\\.[dD][oO][cC]$)|(\\.[dD][oO][cC][xX]$)|(\\.[pP][dD][fF]$)|(\\.[xX][lL][sS]$)|(\\.[xX][lL][sS][xX]$)|(\\.[cC][sS][vV]$)',
		'odocfile':'(\\.[dD][oO][cC]$)|(\\.[dD][oO][cC][xX]$)|(\\.[pP][dD][fF]$)|(\\.[xX][lL][sS]$)|(\\.[xX][lL][sS][xX]$)|(\\.[cC][sS][vV]$)|(^$)',
		'rpicfile':'(\\.[jJ][pP][gG]$)|(\\.[jJ][pP][eE][gG]$)|(\\.[pP][nN][gG]$)|(\\.[gG][iI][fF]$)',
		'opicfile':'(\\.[jJ][pP][gG]$)|(\\.[jJ][pP][eE][gG]$)|(\\.[pP][nN][gG]$)|(\\.[gG][iI][fF]$)|(^$)',		
		'rhtml5videofile':'(\\.[mM][pP][4]$)|(\\.[wW][eE][bB][mM]$)|(\\.[oO][gG][vV]$)',
		'ohtml5videofile':'(\\.[mM][pP][4]$)|(\\.[wW][eE][bB][mM]$)|(\\.[oO][gG][vV]$)|(^$)',
		'rnormalfile':'(\\..+$)',
		'onormalfile':'(\\..+$)|(^$)',
		'rlegalfile':'[\\w.]+',
		'olegalfile':'([\\w.]+)|(^$)',
		'rcontent':'^[\\s\\S]+$',
		'ocontent':'(^[\\s\\S]+$)|(^$)',
		'rwebsite':'^(http://|https://).+$',
		'owebsite':'(^(http://|https://).+$)|(^$)',
		'rmoneycode':'^[\\d]{3}\\-[\\d]{12,14}$',
		'omoneycode':'(^[\\d]{3}\\-[\\d]{12,14}$)|(^$)',
		'ryoutubevideourl':'^http://www\\.youtube\\.com\\/watch[?]v=([\\w\\-]{11})',
		'oyoutubevideourl':'(^http://www\\.youtube\\.com\\/watch[?]v=([\\w\\-]{11}))|(^$)',
		'rnotadminurl':'^(?!admin/).+',
		'onotadminurl':'(^(?!admin/).+)|(^$)',
		'rlatlng':'^[\\d.\\,]+$',
		'olatlng':'(^[\\d.\\,]+$)|(^$)',
		'rcolorcode':'^#[0-9A-F]{6}$',
		'ocolorcode':'(^#[0-9A-F]{6}$)|(^$)',
		'rtwvatnumber':'^[0-9]{8}$',
		'otwvatnumber':'(^[0-9]{8}$)|(^$)'
	},

	/**
	 * 
	 * 驗證用的物件式陣列，索引為驗證器名稱，值為驗證器的提示輸入內容
	 * 
	 */
	'validate_regexp_tips':{
		'rrequired':'~輸入格式~<br />1.必填',
		'orequired':'~輸入格式~<br />1.非必填',	
		'rname':'~輸入格式~<br />1.不得為空值',
		'oname':'~輸入格式~<br />1.可為空值',
		'rchineseword':'~輸入格式~<br />1.不得為空值<br />2.需為中文字',
		'ochineseword':'~輸入格式~<br />1.可為空值<br />2.需為中文字',
		'rid':'~輸入格式~<br />1.不得為空值<br />2.第一個字元必須為英文字',
		'oid':'~輸入格式~<br />1.可為空值<br />2.第一個字元必須為英文字',
		'rrelativeurl':'~輸入格式~<br />1.不得為空值<br />2.大小寫英文字母或數字',
		'orelativeurl':'~輸入格式~<br />1.可為空值<br />2.大小寫英文字母或數字',
		'rsubject':'~輸入格式~<br />1.不得為空值<br />2.不得輸入單引號或雙引號',
		'osubject':'~輸入格式~<br />1.可為空值<br />2.不得輸入單引號或雙引號',
		'raccount':'~輸入格式~<br />1.不得為空值<br />2.大小寫英文字母或數字或底線',
		'oaccount':'~輸入格式~<br />1.可為空值<br />2.大小寫英文字母或數字或底線',
		'raccount_1':'~輸入格式~<br />1.不得為空值<br />2.大小寫英文字母或數字或底線或@,8碼以上',
		'oaccount_1':'~輸入格式~<br />1.可為空值<br />2.大小寫英文字母或數字或底線或@,8碼以上',
		'rpassword':'~輸入格式~<br />1.不得為空值<br />2.大小寫英文字母或數字或底線或@,6~30碼',
		'opassword':'~輸入格式~<br />1.可為空值<br />2.大小寫英文字母或數字或底線或@,6~30碼',
		'rpassword_1':'~輸入格式~<br />1.不得為空值<br />2.小寫英文字母或數字,6~15碼<br />3.至少有一個英文字母及數字',
		'opassword_1':'~輸入格式~<br />1.可為空值<br />2.小寫英文字母或數字,6~15碼<br />3.至少有一個英文字母及數字',
		'rpname':'~輸入格式~<br />1.不得為空值<br />2.大小寫英文字母或數字或中文字',
		'opname':'~輸入格式~<br />1.可為空值<br />2.大小寫英文字母或數字或中文字',
		'inumber':'非數字',
		'rnumber':'~輸入格式~<br />1.不得為空值<br />2.需為數字',
		'onumber':'~輸入格式~<br />1.可為空值<br />2.需為數字',
		'rsnumber':'~輸入格式~<br />1.不得為空值<br />2.需為數字,+,-',
		'osnumber':'~輸入格式~<br />1.可為空值<br />2.需為數字,+,-',
		'rfloat':'~輸入格式~<br />1.不得為空值<br />2.需為浮點數',
		'ofloat':'~輸入格式~<br />1.可為空值<br />2.需為浮點數',
		'rpositivenumber':'~輸入格式~<br />1.不得為空值<br />2.需為正整數',
		'opositivenumber':'~輸入格式~<br />1.可為空值<br />2.需為正整數',
		'rnegativenumber':'~輸入格式~<br />1.不得為空值<br />2.需為負整數',
		'onegativenumber':'~輸入格式~<br />1.可為空值<br />2.需為負整數',
		'rnumber_greater_than_0':'~輸入格式~<br />1.不得為空值<br />2.需為大於0的數字',
		'onumber_greater_than_0':'~輸入格式~<br />1.可為空值<br />2.需為大於0的數字',
		'rtel':'~輸入格式~<br />1.不得為空值<br />2.數字及符號-()# ',
		'otel':'~輸入格式~<br />1.可為空值<br />2.數字及符號-()# ',
		'iemail':'非email格式所允許的字元',
		'remail':'~輸入格式~<br />1.不得為空值<br />2.xxx@xxx.xxx',
		'oemail':'~輸入格式~<br />1.可為空值<br />2.xxx@xxx.xxx',
		'rdatetime':'~輸入格式~<br />1.不得為空值<br />2.xxxx-xx-xx xx:xx:xx',
		'odatetime':'~輸入格式~<br />1.可為為空值<br />2.xxxx-xx-xx xx:xx:xx',
		'rdatetime_no_second':'~輸入格式~<br />1.不得為空值<br />2.xxxx-xx-xx xx:xx',
		'odatetime_no_second':'~輸入格式~<br />1.可為為空值<br />2.xxxx-xx-xx xx:xx',
		'rdate':'~輸入格式~<br />1.不得為空值<br />2.xxxx-xx-xx',
		'odate':'~輸入格式~<br />1.可為空值<br />2.xxxx-xx-xx xx:xx:xx',
		'rmvfile':'~輸入格式~<br />1.不得為空值<br />2.副檔名需為wm或mpg或mpeg或wmv或mp4或avi',
		'omvfile':'~輸入格式~<br />1.可為空值<br />2.副檔名需為wm或mpg或mpeg或wmv或mp4或avi',
		'rflvfile':'~輸入格式~<br />1.不得為空值<br />2.副檔名需為flv或swf',
		'oflvfile':'~輸入格式~<br />1.可為空值<br />2.副檔名需為flv或swf',
		'rdocfile':'~輸入格式~<br />1.不得為空值<br />2.副檔名需為doc或docx或pdf或xls或xlsx或csv',
		'odocfile':'~輸入格式~<br />1.可為空值<br />2.副檔名需為doc或docx或pdf或xls或xlsx或csv',
		'rtxtfile':'~輸入格式~<br />1.不得為空值<br />2.副檔名需為txt',
		'otxtfile':'~輸入格式~<br />1.可為空值<br />2.副檔名需為txt',
		'rcsvfile':'~輸入格式~<br />1.不得為空值<br />2.副檔名需為csv',
		'ocsvfile':'~輸入格式~<br />1.可為空值<br />2.副檔名需為csv',
		'rxlsfile':'~輸入格式~<br />1.不得為空值<br />2.副檔名需為xls',
		'oxlsfile':'~輸入格式~<br />1.可為空值<br />2.副檔名需為xls',
		'rpicfile':'~輸入格式~<br />1.不得為空值<br />2.副檔名需為jpg或jpeg或png或gif',
		'opicfile':'~輸入格式~<br />1.可為空值<br />2.副檔名需為jpg或jpeg或png或gif',
		'rhtml5videofile':'~輸入格式~<br />1.不得為空值<br />2.副檔名需為mp4或webm或ogv',
		'ohtml5videofile':'~輸入格式~<br />1.可為空值<br />2.副檔名需為mp4或webm或ogv',
		'rnormalfile':'~輸入格式~<br />1.不得為空值',
		'onormalfile':'~輸入格式~<br />1.可為空值',
		'rcontent':'~輸入格式~<br />1.不得為空值',
		'ocontent':'~輸入格式~<br />1.可為空值',
		'rwebsite':'~輸入格式~<br />1.不得為空值<br />2.開頭必須為http://或https://',
		'owebsite':'~輸入格式~<br />1.可為空值<br />2.開頭必須為http://或https://',
		'rlegalfile':'~輸入格式~<br />1.不得為空值<br />2.大小寫英文字母或數字或_或.',
		'olegalfile':'~輸入格式~<br />1.可為空值<br />2.大小寫英文字母或數字或_或.',
		'rmoneycode':'~輸入格式~<br />1.不得為空值<br />2.接為數字，前三碼代表行號，其後12碼或14碼為帳號',
		'omoneycode':'~輸入格式~<br />1.可為空值<br />2.接為數字，前三碼代表行號，其後12碼或14碼為帳號',
		'ryoutubevideourl':'~輸入格式~<br />1.不得為空值<br />2.開頭為http://www.youtube.com/watch?',
		'oyoutubevideourl':'~輸入格式~<br />1.可為空值<br />2.開頭為http://www.youtube.com/watch?',
		'rnotadminurl':'~輸入格式~<br />1.不得為空值<br />2.開頭不得為admin/',
		'onotadminurl':'~輸入格式~<br />1.可為空值<br />2.開頭不得為admin/',
		'rlatlng':'~輸入格式~<br />1.不得為空值<br />2.格式為 緯度,經度',
		'olatlng':'~輸入格式~<br />1.可為空值<br />2.格式為 緯度,經度',
		'rcolorcode':'~輸入格式~<br />1.不得為空值<br />2.開頭為#，之後固定6碼，A至F 0至9',
		'ocolorcode':'~輸入格式~<br />1.可為空值<br />2.開頭為#，之後固定6碼，A至F 0至9',
		'rtwvatnumber':'~輸入格式~<br />1.不得為空值<br />2.固定8碼，0至9',
		'otwvatnumber':'~輸入格式~<br />1.可為空值<br />2.固定8碼，0至9'
	},

	/**
	 * 
	 * 驗證字串
	 *
	 * @param validator_name 驗證器名稱
	 * @param string source_string 要驗證的字串
	 * @return bool
	 *
	 *
	 */
	'validate_string':function(validator_name,source_string){
		if(this.global_typeof(validator_name)!=='string'){
			alert('validator_name必須為字串');
			return '0';
		}
		if(this.global_typeof(source_string)!=='string'){
			alert('source_string必須為字串');
			return '0';
		}
		
		var temp_reg=null;
		if(this.validate_regexp_items[validator_name]===undefined){
			 temp_reg =new RegExp(validator_name);
		}else{
			 temp_reg = new RegExp(this.validate_regexp_items[validator_name]);
		}
		if(temp_reg.test(source_string)){
			return '1';
		}else{
			return '0';
		}
	},
	'validate_remove_illegal':function(validator_name,source_string){
		if(this.global_typeof(validator_name)!=='string'){
			alert('validator_name必須為字串');
			return '0';
		}
		if(this.global_typeof(source_string)!=='string'){
			alert('source_string必須為字串');
			return '0';
		}
		
		var temp_reg=null;
		if(this.validate_regexp_items[validator_name]===undefined){
			 temp_reg =new RegExp(validator_name,'g');
		}else{
			 temp_reg = new RegExp(this.validate_regexp_items[validator_name],'g');
		}
		return source_string.replace(temp_reg,'');
	},
	'validate_inputs_data':function(inputs_data){
		var return_result={
			'fails':{}
		};
		if(this.global_typeof(inputs_data)!=='object'){
			this.debug_console('bill_core.'+arguments.callee.name+' inputs_data error!','error');
			return_result['fails']=null;
			return return_result;
		}
		if( 
			this.global_typeof(inputs_data['reg_1s'])!=='object' &&
			this.global_typeof(inputs_data['reg_1s'])!=='null'
		
		){
			this.debug_console('bill_core.'+arguments.callee.name+' inputs_data error!','error');
			return_result['fails']=null;
			return return_result;
		}
		
		var reg_1s=inputs_data['reg_1s'];
		var values=inputs_data['values'];
		var human_read_names=inputs_data['human_read_names'];
		var error_msg_1s=inputs_data['error_msg_1s'];
	
		if( this.global_typeof(reg_1s)==='null' ){
			return_result['fails']=null;
			return return_result;
		}
		
		
		for(var the_input_name in reg_1s ){
			var the_reg_1=reg_1s[the_input_name];
			var the_value=values[the_input_name];
			var the_human_read_name=human_read_names[the_input_name];
			var the_error_msg_1=error_msg_1s[the_input_name];
			if(this.global_typeof(the_value)!=='string'){
				this.debug_console('bill_core.'+arguments.callee.name+' input '+the_input_name+' error!','error');
				return_result['fails']=null;
				break;
			}
			if(this.string_is_solid(the_reg_1)==='0'){
				continue;
			}
			
			var the_reg_tip=this.validate_regexp_tips[the_reg_1];
			if(the_reg_tip===undefined){
				the_reg_tip='請輸入正確的格式';
			}
			var the_reg_1_obj=null;
			
			if(this.validate_regexp_items[the_reg_1]===undefined){
				the_reg_1_obj =new RegExp(the_reg_1);
			}else{
				the_reg_1_obj = new RegExp(this.validate_regexp_items[the_reg_1]);
			}

			if(the_reg_1_obj.test(the_value)){
				inputs_data.all_inputs_jqobject.filter('[name="'+the_input_name+'"]').attr('validate_fail_message','');
			}
			else{
				if( return_result.fails.hasOwnProperty(the_input_name)===false ){
					return_result.fails[the_input_name]={
						'value':'',
						'human_read_name':'',
						'validate_fail_message':''
					};
				}
				return_result.fails[the_input_name]['value']=the_value;
				if(this.string_is_solid(the_human_read_name)==='1'){
					return_result.fails[the_input_name]['human_read_name']=the_human_read_name;
				}
				else{
					return_result.fails[the_input_name]['human_read_name']=the_input_name;
				}
				if(this.string_is_solid(the_error_msg_1)==='1'){
					return_result.fails[the_input_name]['validate_fail_message']=the_error_msg_1;
					inputs_data.all_inputs_jqobject.filter('[name="'+the_input_name+'"]').attr('validate_fail_message',the_error_msg_1);
				}
				else{
					return_result.fails[the_input_name]['validate_fail_message']=the_reg_tip;
					inputs_data.all_inputs_jqobject.filter('[name="'+the_input_name+'"]').attr('validate_fail_message',the_reg_tip);
				}
				
			}
		}
		
		if( Object.keys(return_result.fails).length==0 ){
			return_result['fails']=null;
		}
		return return_result;
	},
	'array_keep_solid_string_value':function(the_array){
		if(this.global_typeof(the_array)!=='object'){
			this.debug_console('bill_core.'+arguments.callee.name+' the_array error!','error');
			return;
		}
		for(var the_element_index in the_array){
			var the_element_value=the_array[the_element_index];
			if( this.string_is_solid(the_element_value)=='1' ){
					
			}
			else{
				the_array.splice(parseInt(the_element_index,10),1);
			}
		}
		
		return;
	},
	'object_keep_solid_string_value':function(the_object){
		if(this.global_typeof(the_object)!=='object'){
			this.debug_console('bill_core.'+arguments.callee.name+' the_object error!','error');
			return;
		}
		for(var the_attr_name in the_object){
			var the_attr_value=the_object[the_attr_name];
			if( this.string_is_solid(the_attr_value)=='1' ){
					
			}
			else{
				delete the_object[the_attr_name];
			}
		}
		
		return;
	},
	'form_simulate_send':function(param1,param2,param3,param4,param5){
		//data
		//data、action
		//data、action、method
		//data、action、method、target
		//data、action、method、target、enctype
		var data,action,method,enctype,target;
		if(arguments.length==0){
			console.error('bill_core.'+arguments.callee.name+' params error!');
			return;
		}else if(arguments.length==1){
			data=param1;
			action='';
			method='post';
			target="_self";
			enctype='application/x-www-form-urlencoded';
			
		}else if(arguments.length==2){
			data=param1;
			action=param2;
			method='post';
			target="_self";
			enctype='application/x-www-form-urlencoded';
			
		}else if(arguments.length==3){		
			data=param1;
			action=param2;
			method=param3;
			target="_self";
			enctype='application/x-www-form-urlencoded';
			
		}else if(arguments.length==4){	
			data=param1;
			action=param2;
			method=param3;
			target=param4;
			enctype='application/x-www-form-urlencoded';
			
		}else if(arguments.length==5){	
			data=param1;
			action=param2;
			method=param3;
			target=param4;
			enctype=param5;
		}else{
			console.error('bill_core.'+arguments.callee.name+' params error!');
			return;
		}
		if(this.global_typeof(data)!=='object'){
			this.debug_console('bill_core.'+arguments.callee.name+' data error!','error');
			return;
		}
		if(this.global_typeof(action)!=='string'){
			this.debug_console('bill_core.'+arguments.callee.name+' action error!','error');
			return;
		}
		if(
			this.global_typeof(method)!=='string' ||
			['get','post'].indexOf(method)===-1
		){
			this.debug_console('bill_core.'+arguments.callee.name+' method error!','error');
			return;
		}
		
		if(
			this.global_typeof(target)!=='string'
		){
			this.debug_console('bill_core.'+arguments.callee.name+' target error!','error');
			return;
		}
		if(
			this.global_typeof(enctype)!=='string' ||
			['application/x-www-form-urlencoded','multipart/form-data','text/plain'].indexOf(enctype)===-1
		){
			this.debug_console('bill_core.'+arguments.callee.name+' enctype error!','error');
			return;
		}
		
		var temp_form = jQuery(
			"<form action='"+action+"' method='"+method
			+"' enctype='"+enctype+"' target='"+target+"' ></form>"
		);

		jQuery.each(data,function (the_key,the_value) {
			var temp_input = jQuery("<input type='hidden' />");
			temp_input.attr("name",the_key);
			temp_input.val(the_value);
			temp_form.append(temp_input);
		});
		jQuery(document.body).append(temp_form);
		temp_form.submit().remove();
	},
	
	'debug_console':function(param1,param2){
		//message
		//message、level(嚴重性等級)：info、warn、error
		if(arguments.length==0){
			console.error('bill_core.'+arguments.callee.name+' params error!');
			return;
		}else if(arguments.length==1){
			console.info(param1);
		}else if(arguments.length==2){
			if(param2=='info'){
				console.info(param1);
			}else if(param2=='warn'){
				console.warn(param1);
			}else if(param2=='error'){
				console.error(param1);
			}else{
				console.error('bill_core.'+arguments.callee.name+' params error!');
			}
			return;
		}else{
			console.error('bill_core.'+arguments.callee.name+' params error!');
			return;
		}
	},
	'debug_object':function(param1,param2){
		//object,string
		//param1 要debug的物件,param2 資訊的種類 name_and_value,json
		//若為陣列物件，則其內建的屬性不會顯示出來
		if(this.global_typeof(param1)!=='object'){
			this.debug_console('bill_core.'+arguments.callee.name+' params1 error!','error');
			return;
		}
		if(this.global_typeof(param2)!=='string'){
			this.debug_console('bill_core.'+arguments.callee.name+' params2 error!','error');
			return;
		}
		if( param2!=='name_and_value' && param2!=='json' && param2!=='dom' ){
			this.debug_console('bill_core.'+arguments.callee.name+' params2 error!','error');
			return;
		}
		if(param2==='name_and_value'){
			for( var obj_attr_name in param1 ){
				var obj_attr_value=param1[obj_attr_name];
				bill_core.debug_console(
					'attr_name:'+obj_attr_name+','+
					'attr_name_data_type:'+this.global_typeof(obj_attr_name)+';'+
					'attr_value:'+obj_attr_value+','+
					'attr_value_data_type:'+this.global_typeof(obj_attr_value)
				);
			}
		}
		else if(param2==='json'){
			bill_core.debug_console(
				JSON.stringify(param1,null,'\t')
			);
		}
		else if(param2==='dom'){
			var temp_string = '{\n',
				values = [],
				counter = 0;
			jQuery.each(param1, function(key, value) {
			  if (value && value.nodeName) {
				var domnode = '<' + value.nodeName.toLowerCase();
				domnode += value.className ? ' class="' + value.className + '"' : '';
				domnode += value.id ? ' id="' + value.id + '"' : '';
				domnode += '>';
				value = domnode;
			  }
			  values[counter++] = key + ': ' + value;
			});
			temp_string += values.join(',\n');
			temp_string += '\n}';
			bill_core.debug_console(
				temp_string
			);
		}
	},
	'debug_stopwatch_begin':function(op_name){
		if(this.global_typeof(op_name)!=='string'){
			this.debug_console('bill_core.'+arguments.callee.name+' op_name error!','error');
			return;
		}
		bill_core.debug_stopwatch_date=new Date();
		bill_core.debug_stopwatch_op_name=op_name;
		
	},
	'debug_stopwatch_end':function(){
		if(bill_core.debug_stopwatch_date===undefined){
			this.debug_console('bill_core.'+arguments.callee.name+' debug stopwatch never begin','error');
			return;
		}
		var now_date=new Date();
		bill_core.debug_console(bill_core.debug_stopwatch_op_name+' took '+(now_date.getTime()-bill_core.debug_stopwatch_date.getTime())+' ms');
	},
	'ajax_post':function(param1,param2,param3,param4,param5,param6){
		//destination_url、post_data、request_success_handler、request_fail_handler
		//destination_url、post_data、request_success_handler、request_fail_handler、is_sync
		//destination_url、post_data、request_success_handler、request_fail_handler、is_sync、context
		if(arguments.length<4){
			console.error('bill_core.'+arguments.callee.name+' params error!');
			return;
		}
		
		if(
			this.global_typeof(param1)=='string' && 
			this.global_typeof(param2)=='object' && 
			this.global_typeof(param3)=='function' &&
			this.global_typeof(param4)=='function'
		){	
		}else{
			console.error('bill_core.'+arguments.callee.name+' params error!');
			return;
		}
		var is_sync='1';
		var context=null;
		if(arguments.length>=5 && (param5==='0' || param5==='1')){
			is_sync=param5;
		}
		if(arguments.length>=6 && this.global_typeof(param6)=='object'){
			context=param6;
		}
		
		var ajax_settings={
		   type: "post",
		   url: param1,
		   dataType:'json',
		   data:param2,
		   success: param3,
		   error:param4
		};
		if(param2 instanceof FormData){
			ajax_settings['processData']=false;
			ajax_settings['contentType']=false;
			ajax_settings['cache']=false;
		}
		
		if(is_sync==='1'){
			ajax_settings['async']=false;
		}else{
			
			ajax_settings['async']=true;
		}
		
		if(this.global_typeof(context)=='object'){
			ajax_settings['context']=context;
		}
		jQuery.ajax(ajax_settings);
		
	},
	'number_is_solid':function(checked_var){
		if(this.global_typeof(checked_var)!=='number'){
			return '0';
		}
		
		return '1';//若變數的資料型態是number，則返回'1'
	},
	'number_int_random':function(min_int,max_int){
		var return_result=0;
		var args_illegal_is_found='0';
		if ( 
			this.global_typeof(min_int)==='number' && this.validate_string('rnumber',min_int.toString())==='1'
		) {
			
		}else{
			args_illegal_is_found='1';
			this.debug_console('bill_core.'+arguments.callee.name+' min_int error!','error');
		}
		if ( 
			this.global_typeof(max_int)==='number' && this.validate_string('rnumber',max_int.toString())==='1'
		) {
			
		}else{
			args_illegal_is_found='1';
			this.debug_console('bill_core.'+arguments.callee.name+' max_int error!','error');
		}
		
		if(args_illegal_is_found==='1'){
			return return_result;
		}
		if(min_int>max_int){
			this.debug_console('bill_core.'+arguments.callee.name+' min_int,max_int error!','error');
			return return_result;
		}
		return_result=min_int+Math.floor(Math.random()*(max_int-min_int+1));
		return return_result;
	},
	'jquery_outer_html':function(jqobject){
		return jQuery('<div></div>').append(jqobject.clone()).html();
	},
	'img_suitable_width':function(img_url,max_width){
		var the_img_jqobject=jQuery("<img border='0' src='"+img_url+"' />");
			
		if(
			bill_core.number_is_solid(max_width)==='1' &&
			max_width>0
		){
		}else{
			max_width=400;
		}
		var display_img_width=the_img_jqobject[0].naturalWidth;
		alert(display_img_width);
		if(display_img_width>max_width){
			display_img_width=max_width;
		}
		if(display_img_width==0){
			display_img_width=max_width;
		}
		
		return display_img_width;
	},
	'math_op':function(num_1,num_2,op_name){
		if(this.global_typeof(num_1)!=='number'){
			this.debug_console('bill_core.'+arguments.callee.name+' num_1 error!','error');
			return;
		}
		if(this.global_typeof(num_2)!=='number'){
			this.debug_console('bill_core.'+arguments.callee.name+' num_2 error!','error');
			return;
		}
		if(this.global_typeof(op_name)!=='string'){
			this.debug_console('bill_core.'+arguments.callee.name+' op_name error!','error');
			return;
		}
		var num_1_string=num_1.toString(10);
		var num_2_string=num_2.toString(10);
		 
		
		var num_1_part_1_string='';
		var num_1_part_2_string='';
		var num_2_part_1_string='';
		var num_2_part_2_string='';
		
		var temp_array=num_1_string.split('.');
		if(temp_array.length==1){
			num_1_part_1_string=temp_array[0];
		}else{
			num_1_part_1_string=temp_array[0];
			num_1_part_2_string=temp_array[1];
		}
		temp_array=num_2_string.split('.');
		if(temp_array.length==1){
			num_2_part_1_string=temp_array[0];
		}else{
			num_2_part_1_string=temp_array[0];
			num_2_part_2_string=temp_array[1];
		}
		
		var temp_max=Math.max(num_1_part_2_string.length,num_2_part_2_string.length);
		var temp_num_1=
			parseInt(num_1_part_1_string,10)*Math.pow(10,temp_max)+
			parseInt(num_1_part_2_string,10)*Math.pow(10,temp_max-num_1_part_2_string.length);
		var temp_num_2=
			parseInt(num_2_part_1_string,10)*Math.pow(10,temp_max)+
			parseInt(num_2_part_2_string,10)*Math.pow(10,temp_max-num_2_part_2_string.length);
		
		var return_result=0;
		switch(op_name){
			case '+':
				return_result=(temp_num_1+temp_num_2)/Math.pow(10,temp_max);
			break;
			case '-':
				return_result=(temp_num_1-temp_num_2)/Math.pow(10,temp_max);
			break;
		}
		
		return return_result;

	}
}
