//引用該檔案前，需先引用jquery元件
function global_typeof(checked_var) {
	if(typeof(checked_var)==='number'){
		if(checked_var===NaN){
			return 'NaN';
		}else if(checked_var===Number.MAX_VALUE){
			return 'Number.MAX_VALUE';
		}else if(checked_var===Number.MIN_VALUE){
			return 'Number.MIN_VALUE'
		}else if(checked_var===Number.NaN){
			return 'Number.NaN'
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
		}else if(checked_var.length!==undefined){
			return 'array';
		}else{
			return 'object';
		}
	}else if(typeof(checked_var)==='function'){
		return 'function';
	}else if(typeof(checked_var)==='undefined'){
		return 'undefined';
	}else{
		return '';
	}
}
function global_is_non_empty_string(checked_var) {
	if(typeof(checked_var)!=='string'){
		return false;
	}
	if(checked_var===''){
		return false;
	}
	return true;
}
function global_is_solid_string(checked_var) {
	return global_is_non_empty_string(checked_var);
}
function global_is_start_with(subword,testword) {
	if(global_is_non_empty_string(subword) &&  global_is_non_empty_string(testword)){
	
	}else{
		return false;
	}
	var the_reg_pattern=new RegExp("^"+subword, '')
	if(the_reg_pattern.test(testword)){
		return true;
	}else{
		return false;
	}
}
function global_is_end_with(subword,testword) {
	if(global_is_non_empty_string(subword) &&  global_is_non_empty_string(testword)){
	
	}else{
		return false;
	}
	var the_reg_pattern=new RegExp(subword+'$', '')
	if(the_reg_pattern.test(testword)){
		return true;
	}else{
		return false;
	}
}

function global_sleep(seconds) {
	if(typeof(seconds)==='number'){
	
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
}


function global_daysInMonth(iYear,iMonth)
{
	return 32 - new Date(iYear, iMonth-1, 32).getDate();
}
function global_is_empty(checked_var){
	if(checked_var===undefined || checked_var===null || checked_var===''){
		return true;
	}else{
		return false;
	}
}
function global_datebigint_toFormattedString(the_format,the_datebigint)
{
	if(global_is_solid_string(the_datebigint)){
	}else{
		var now_datetime=new Date();
		the_datebigint=
			now_datetime.getFullYear().toString()+
			global_add_zero((now_datetime.getMonth()+1),2)+
			global_add_zero(now_datetime.getDate(),2)+
			global_add_zero(now_datetime.getHours(),2)+
			global_add_zero(now_datetime.getMinutes(),2)+
			global_add_zero(now_datetime.getSeconds(),2);
	}
	
	var the_match_result=the_datebigint.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
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
		replace('m',the_parsed_month).
		replace('M',the_parsed_month_alias_1).
		replace('d',the_parsed_day).
		replace('H',the_parsed_hour).
		replace('i',the_parsed_minute).
		replace('s',the_parsed_second);
	}
} 

function global_datebigint_parse(the_datebigint)
{
	if(global_is_solid_string(the_datebigint)){
	}else{
		var now_datetime=new Date();
		the_datebigint=
			now_datetime.getFullYear().toString()+
			global_add_zero((now_datetime.getMonth()+1),2)+
			global_add_zero(now_datetime.getDate(),2)+
			global_add_zero(now_datetime.getHours(),2)+
			global_add_zero(now_datetime.getMinutes(),2)+
			global_add_zero(now_datetime.getSeconds(),2);
	}
	
	var the_match_result=the_datebigint.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
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
} 

function global_objToString(obj, level) {
	var out = '';
	for (var i in obj)
	{
		
		out += i + ": " + obj[i] + "\n";
		
	}
	return out;
}

function global_is_non_empty_array(checked_var) {
	if(typeof(checked_var)!=='object'){
		return false;
	}
	if(checked_var===null){
		return false;
	}
	if(checked_var.length===undefined){
		var temp_size=0;
		for(var tempkey in checked_var){
			temp_size++;
			break;
		}
		if(temp_size===0){
			return false;
		}
	}else{
		if(checked_var.length===0){
			return false;
		}
	}
	return true;
}

function global_is_solid_array(checked_var) {
	return global_is_non_empty_array(checked_var);
}

function global_fetch_file_extension(filename)
{
	if(global_is_non_empty_string(filename)){
		var file_extension=/[.](.+?)$/.exec(filename);
		if(file_extension===null){
			return '';
		}
		if(global_is_non_empty_string(file_extension[1])){
			return file_extension[1].toLowerCase();
		}else{
			return '';
		}
	}else{
		return '';
	}
}
function global_fetch_file_mainname(filename)
{
	if(global_is_non_empty_string(filename)){
		var file_mainname=/\/{0,1}(.+?)[.]{0,1}.*?$/.exec(filename);
		if(file_mainname===null){
			return '';
		}
		if(global_is_non_empty_string(file_mainname[1])){
			return file_mainname[1];
		}else{
			return '';
		}
	}else{
		return '';
	}
}
//變更URL的QUREY字串
function global_set_url_params(the_url,updated_params)
{
	var result_string='';
	if(global_is_non_empty_string(the_url) && global_typeof(updated_params)==='object'){
	
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
}
function global_get_url_param(the_url,param_name)
{
	var result_string='';
	if(global_is_non_empty_string(the_url)){
	
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
}
function global_parse_template_string(template_string,params)
{
	if(global_typeof(template_string)!=='string'){
		alert('template_string argument error');
		return;
	}
	if(global_typeof(params)!=='object'){
		alert('params argument error');
		return;
	}
	
	return template_string.replace(
		/!!!(.+?)!!!/g, 
		function (match, capture) { 
			return params[capture];
		}
	); // "gold ring|string"
	
}
function global_fetch_specific_string(source_string,start_string,end_string)
{
	if(global_typeof(source_string)!=='string'){
		alert('source_string argument error');
		return;
	}
	if(global_typeof(start_string)!=='string'){
		alert('start_string argument error');
		return;
	}
	if(global_typeof(end_string)!=='string'){
		alert('end_string argument error');
		return;
	}
	
	start_string=global_escape_for_regexp(start_string);
	end_string=global_escape_for_regexp(end_string);

	var temp_reg=new RegExp('^'+start_string+'([\\s\\S]+)'+end_string+'$');
	var temp_result=temp_reg.exec(source_string);
	if(temp_result===null){
		return '';
	}else{
		return temp_result[1];
	}
	
}
function global_escape_for_regexp(source_string)
{
	var return_string='';
	if(global_typeof(source_string)!=='string'){
		alert('source_string argument error');
		return return_string;
	}
	return_string=source_string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,'\\$1');
	
	return return_string;
}
function global_custom_href_process(href,href_target_is_blank){
	window.open(href,(href_target_is_blank=='1'?'_blank':'_self'));
}
function global_round(num,pos){
	var size = Math.pow(10, pos);
	return Math.round(num * size) / size;

}

function global_convert_from_bytenum(num,tounit){
	
	var tounitnum=0;	
	if(tounit=='KB'){
		tounitnum=global_round(num/1024,2);
	}else if(tounit=='MB'){	
		tounitnum=global_round(num/1024/1024,2);
		
	}else if(tounit=='GB'){
		tounitnum=global_round(num/1024/1024/1024,2);
	}else{
		tounitnum=num;
	}
	
	return tounitnum;
}
function global_add_zero(num,digits_count){
	var return_string='00';
	if(digits_count===undefined){
		digits_count=2;
	}
	if(global_typeof(num)!=='number'){
		return return_string;
	}else{
		return_string=num.toString();
	}
	if(num<Math.pow(10, digits_count-1)){
		for(var zero_counts=digits_count-1;zero_counts>0;zero_counts=zero_counts-1){
			return_string='0'+return_string;
		}
	}	
	return  return_string;
}

function global_ensure_string(checked_var) {

	var checked_var_type=global_typeof(checked_var);
	if(checked_var_type=='number'){
		return checked_var.toString();
	}else if(checked_var_type=='boolean'){
		return checked_var.toString();
	}else if(checked_var_type=='string'){
		return checked_var;
	}else{
		return '';
	}

}

function global_add_thousand_separator_to(num){
    var n = num.toString(), p = n.indexOf('.');
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
        return p<0 || i<p ? ($0+',') : $0;
    });
}

function global_remove_end_string(source_string,end_string)
{
	if(global_typeof(source_string)!=='string'){
		alert('source_string argument error');
		return;
	}

	if(global_typeof(end_string)!=='string'){
		alert('end_string argument error');
		return;
	}

	end_string=global_escape_for_regexp(end_string);
	var temp_reg=new RegExp('^([\\s\\S]+)'+end_string+'$');
	var temp_result=temp_reg.exec(source_string);
	if(temp_result===null){
		return '';
	}else{
		return temp_result[1];
	}
	
}

function global_parse_http_user_agent() {
	//若device不為空字串 代表裝置是手機
	var return_data={
		'device':'PC',
		'browser_type':'',
		'browser_version':''
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
			if(global_is_start_with('MSIE ',temp_string)){
				return_data['browser_version']=global_fetch_specific_string(temp_string,'MSIE ','');	
				break;
			}
		}
	}else if(navigator.userAgent.search(/Firefox/i)!==-1){	
		return_data['browser_type']='Firefox';
		
		var temp_array=navigator.userAgent.split(' ');
		for(var kindex in temp_array){
			var temp_string=temp_array[kindex];
			if(global_is_start_with('Firefox/',temp_string)){
				return_data['browser_version']=global_fetch_specific_string(temp_string,'Firefox/','');	
				break;
			}
		}
	}else if(navigator.userAgent.search(/Chrome/i)!==-1){		
		return_data['browser_type']='Chrome';
		var temp_array=navigator.userAgent.split(' ');
		for(var kindex in temp_array){
			var temp_string=temp_array[kindex];
			if(global_is_start_with('Chrome/',temp_string)){
				return_data['browser_version']=global_fetch_specific_string(temp_string,'Chrome/','');	
				break;
			}
		}
	}else if(navigator.userAgent.search(/Safari/i)!==-1){	
		return_data['browser_type']='Safari';
		var temp_array=navigator.userAgent.split(' ');
		for(var kindex in temp_array){
			var temp_string=temp_array[kindex];
			if(global_is_start_with('Safari/',temp_string)){
				return_data['browser_version']=global_fetch_specific_string(temp_string,'Safari/','');	
				break;
			}
		}
	}else if(navigator.userAgent.search(/Opera/i)!==-1){
		//Opera的user_agent比較詭異 版本不好判斷
		return_data['browser_type']='Opera';	
	}
	
	return return_data;
}

var global_regexp_items={
	'required':'^[\\s\\S]+$',	
	'rname':'^[\\s\\S]+$',
	'oname':'^[\\s\\S]*$',
	'rchineseword':'^[\\u4e00-\\u9fa5\\uf900-\\ufa2d]+$',
	'ochineseword':'(^[\\u4e00-\\u9fa5\\uf900-\\ufa2d]+$)|(^$)',
	'rid':'^[a-zA-Z]{1}[\\s\\S]*$',
	'oid':'(^[a-zA-Z]{1}[\\s\\S]*$)|(^$)',
	'rrelativeurl':'^[\\u4e00-\\u9fa5\\uf900-\\ufa2d0-9a-zA-Z_\\/.?=&\\- %]+$',
	'orelativeurl':'(^[\\u4e00-\\u9fa5\\uf900-\\ufa2d0-9a-zA-Z_\\/.?=&\\- %]+$)|(^$)',
	'rsubject':'^[\\s\\S]+$',
	'osubject':'^[\\s\\S]*$',
	'raccount':'^[A-Za-z0-9_]+$',
	'oaccount':'^[A-Za-z0-9_]*$',
	'rpassword':'^[A-Za-z0-9_]{6,12}$',
	'opassword':'(^[A-Za-z0-9_]{6,12}$)|(^$)',
	'rpname':'^[A-Za-z0-9\\u4e00-\\u9fa5\\- \\/]+$',
	'opname':'(^[A-Za-z0-9\\u4e00-\\u9fa5\\- \\/]+$)|(^$)',
	'rnumber':'^\\d+$',
	'onumber':'^\\d*$',
	'rsnumber':'^[0-9\\+\\-]+$',
	'osnumber':'^[0-9\\+\\-]*$',
	'rfloat':'^[0-9.]+$',
	'ofloat':'^[0-9.]*$',
	'rgrpertimes':'^\\d{1,3}$',
	'rgrprice':'^\\d{1,5}$',
	'ogrprice':'^\\d{0,5}$',
	'rtel':'^(\\(\\d+\\)){0,1}[\\d\\-\\+ #]+$',
	'otel':'(^(\\(\\d+\\)){0,1}[\\d\\-\\+ #]+$)|(^$)',
	'remail':'^[_0-9a-zA-Z.\\-]+@[0-9a-zA-Z\\-_]+(\\.[a-z]+)+$',
	'oemail':'(^[_0-9a-zA-Z.\\-]+@[0-9a-zA-Z\\-_]+(\\.[a-z]+)+$)|(^$)',
	'rdatetime':'(^\\d{4}-\\d{2}-\\d{2} [0-1][0-9]:[0-5][0-9]:[0-5][0-9]$)|(^\\d{4}-\\d{2}-\\d{2} [2][0-3]:[0-5][0-9]:[0-5][0-9]$)',
	'odatetime':'(^\\d{4}-\\d{2}-\\d{2} [0-1][0-9]:[0-5][0-9]:[0-5][0-9]$)|(^\\d{4}-\\d{2}-\\d{2} [2][0-3]:[0-5][0-9]:[0-5][0-9]$)|(^$)',
	'rdate':'^\\d{4}\\-\\d{2}\\-\\d{2}$',
	'odate':'(^\\d{4}\\-\\d{2}\\-\\d{2}$)|(^$)',
	'rtime':'(^[0-1][0-9]:[0-5][0-9]:[0-5][0-9]$)|(^[2][0-3]:[0-5][0-9]:[0-5][0-9]$)',
	'otime':'(^[0-1][0-9]:[0-5][0-9]:[0-5][0-9]$)|(^[2][0-3]:[0-5][0-9]:[0-5][0-9]$)|(^$)',
	
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
	'rdocfile':'(\\.[dD][oO][cC]$)|(\\.[dD][oO][cC][xX]$)|(\\.[pP][dD][fF]$)|(\\.[xX][lL][sS]$)|(\\.[xX][lL][sS][xX]$)',
	'odocfile':'(\\.[dD][oO][cC]$)|(\\.[dD][oO][cC][xX]$)|(\\.[pP][dD][fF]$)|(\\.[xX][lL][sS]$)|(\\.[xX][lL][sS][xX]$)|(^$)',
	'rpicfile':'(\\.[jJ][pP][gG]$)|(\\.[jJ][pP][eE][gG]$)|(\\.[pP][nN][gG]$)|(\\.[gG][iI][fF]$)',
	'opicfile':'(\\.[jJ][pP][gG]$)|(\\.[jJ][pP][eE][gG]$)|(\\.[pP][nN][gG]$)|(\\.[gG][iI][fF]$)|(^$)',
	'rvideofile':'(\\.[mM][pP][4]$)|(\\.[wW][eE][bB][mM]$)|(\\.[oO][gG][vV]$)',
	'ovideofile':'(\\.[mM][pP][4]$)|(\\.[wW][eE][bB][mM]$)|(\\.[oO][gG][vV]$)|(^$)',
	'rnormalfile':'(\\..+$)',
	'onormalfile':'(\\..+$)|(^$)',
	'rlegalfile':'[\\w.]+',
	'olegalfile':'([\\w.]+)|(^$)',
	
	'rcontent':'^[\\s\\S]+$',
	'ocontent':'^[\\s\\S]*$',
	'rwebsite':'^(http:\\/\\/|https:\\/\\/).+$',
	'owebsite':'(^(http:\\/\\/|https:\\/\\/).+$)|(^$)',
	'rmoneycode':'^[0-9]{3}\\-[0-9]{12,14}$',
	'omoneycode':'(^[0-9]{3}\\-[0-9]{12,14}$)|(^$)',
	'rnotadminurl':'^(?!admin\\/).+',
	'onotadminurl':'(^(?!admin\\/).+)|(^$)',
	'rlatlng':'^[0-9.\\,]+$',
	'olatlng':'^[0-9.\\,]*$'
};
var global_regexp_tips={
	'required':'~輸入格式~<br/>1.必填',	
	'rname':'~輸入格式~<br/>1.不得為空值',
	'oname':'~輸入格式~<br/>1.可為空值',
	'rchineseword':'~輸入格式~<br/>1.不得為空值<br/>2.需為中文字',
	'ochineseword':'~輸入格式~<br/>1.可為空值<br/>2.需為中文字',
	'rid':'~輸入格式~<br/>1.不得為空值<br/>2.第一個字元必須為英文字',
	'oid':'~輸入格式~<br/>1.可為空值<br/>2.第一個字元必須為英文字',
	'rrelativeurl':'~輸入格式~<br/>1.不得為空值<br/>2.大小寫英文字母或數字',
	'orelativeurl':'~輸入格式~<br/>1.可為空值<br/>2.大小寫英文字母或數字',
	'rsubject':'~輸入格式~<br/>1.不得為空值<br/>2.不得輸入單引號或雙引號',
	'osubject':'~輸入格式~<br/>1.可為空值<br/>2.不得輸入單引號或雙引號',
	'raccount':'~輸入格式~<br/>1.不得為空值<br/>2.大小寫英文字母或數字或底線',
	'oaccount':'~輸入格式~<br/>1.可為空值<br/>2.大小寫英文字母或數字或底線',
	'rpassword':'~輸入格式~<br/>1.不得為空值<br/>2.大小寫英文字母或數字或底線,6~12碼<br/>',
	'opassword':'~輸入格式~<br/>1.可為空值<br/>2.大小寫英文字母或數字或底線,6~12碼<br/>',
	'rpname':'~輸入格式~<br/>1.不得為空值<br/>2.大小寫英文字母或數字或中文字',
	'opname':'~輸入格式~<br/>1.可為空值<br/>2.大小寫英文字母或數字或中文字',
	'rnumber':'~輸入格式~<br/>1.不得為空值<br/>2.需為數字',
	'onumber':'~輸入格式~<br/>1.可為空值<br/>2.需為數字',
	'rwebsite':'~輸入格式~<br/>1.不得為空值<br/>2.開頭必須為http://或https://',
	'owebsite':'~輸入格式~<br/>1.可為空值<br/>2.開頭必須為http://或https://',
	'rtel':'~輸入格式~<br/>1.不得為空值<br/>2.數字及符號-()# <br />',
	'otel':'~輸入格式~<br/>1.可為空值<br/>2.數字及符號-()# <br />',
	'remail':'~輸入格式~<br/>1.不得為空值<br/>2.xxx@xxx.xxx',
	'oemail':'~輸入格式~<br/>1.可為空值<br/>2.xxx@xxx.xxx',
	'rdatetime':'~輸入格式~<br/>1.不得為空值<br/>2.xxxx-xx-xx xx:xx:xx',
	'odatetime':'~輸入格式~<br/>1.可為為空值<br/>2.xxxx-xx-xx xx:xx:xx',
	'rdate':'~輸入格式~<br/>1.不得為空值<br/>2.xxxx-xx-xx',
	'odate':'~輸入格式~<br/>1.可為空值<br/>2.xxxx-xx-xx xx:xx:xx',
	'rmvfile':'~輸入格式~<br/>1.不得為空值<br/>2.副檔名需為wm或mpg或mpeg或wmv或mp4或avi',
	'omvfile':'~輸入格式~<br/>1.可為空值<br/>2.副檔名需為wm或mpg或mpeg或wmv或mp4或avi',
	'rflvfile':'~輸入格式~<br/>1.不得為空值<br/>2.副檔名需為flv或swf',
	'oflvfile':'~輸入格式~<br/>1.可為空值<br/>2.副檔名需為flv或swf',
	'rdocfile':'~輸入格式~<br/>1.不得為空值<br/>2.副檔名需為doc或docx或pdf或xls或xlsx',
	'odocfile':'~輸入格式~<br/>1.可為空值<br/>2.副檔名需為doc或docx或pdf或xls或xlsx',
	'rtxtfile':'~輸入格式~<br/>1.不得為空值<br/>2.副檔名需為txt',
	'otxtfile':'~輸入格式~<br/>1.可為空值<br/>2.副檔名需為txt',
	'rcsvfile':'~輸入格式~<br/>1.不得為空值<br/>2.副檔名需為csv',
	'ocsvfile':'~輸入格式~<br/>1.可為空值<br/>2.副檔名需為csv',
	'rxlsfile':'~輸入格式~<br/>1.不得為空值<br/>2.副檔名需為xls',
	'oxlsfile':'~輸入格式~<br/>1.可為空值<br/>2.副檔名需為xls',
	'rpicfile':'~輸入格式~<br/>1.不得為空值<br/>2.副檔名需為jpg或jpeg或png或gif',
	'opicfile':'~輸入格式~<br/>1.可為空值<br/>2.副檔名需為jpg或jpeg或png或gif',
	'rvideofile':'~輸入格式~<br/>1.不得為空值<br/>2.副檔名需為mp4或webm或ogv',
	'ovideofile':'~輸入格式~<br/>1.可為空值<br/>2.副檔名需為mp4或webm或ogv',
	'rnormalfile':'~輸入格式~<br/>1.不得為空值',
	'onormalfile':'~輸入格式~<br/>1.可為空值',
	'rcontent':'~輸入格式~<br/>1.不得為空值',
	'ocontent':'~輸入格式~<br/>1.可為空值',
	'rlegalfile':'~輸入格式~<br/>1.不得為空值<br/>2.大小寫英文字母或數字或_或.',
	'olegalfile':'~輸入格式~<br/>1.可為空值<br/>2.大小寫英文字母或數字或_或.',
	'rmoneycode':'~輸入格式~<br/>1.不得為空值<br/>2.接為數字，前三碼代表行號，其後12碼或14碼為帳號',
	'omoneycode':'~輸入格式~<br/>1.可為空值<br/>2.接為數字，前三碼代表行號，其後12碼或14碼為帳號',
	'rnotadminurl':'~輸入格式~<br/>1.不得為空值<br/>2.開頭不得為admin/',
	'onotadminurl':'~輸入格式~<br/>1.可為空值<br/>2.開頭不得為admin/',
	'rlatlng':'~輸入格式~<br/>1.不得為空值<br/>2.格式為 緯度,經度',
	'olatlng':'~輸入格式~<br/>1.可為空值<br/>2.格式為 緯度,經度'
};

function global_easy_validate_string(test_rule,source_string){
	if(global_typeof(test_rule)!=='string'){
		alert('test_rule必須為字串');
		return false;
	}
	if(global_typeof(source_string)!=='string'){
		alert('source_string必須為字串');
		return false;
	}
	
	var temp_reg=null;
	if(global_regexp_items[test_rule]===undefined){
		 temp_reg =new RegExp(test_rule);
	}else{
		 temp_reg = new RegExp(global_regexp_items[test_rule]);
	}
	if(temp_reg.test(source_string)){
		return true;
	}else{
		return false;
	}
}