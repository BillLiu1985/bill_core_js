(function(jQuery,bill_core){
	{
		let never_used_is_found='0';
		if(jQuery===undefined){
			console.error('jquery never used');
		}
		if(jQuery.ui===undefined){
			console.error('jqueryui never used');
		}
		if(bill_core===undefined){
			console.error('bill_core never used');
		}
		if(never_used_is_found==='1'){
			return;
		}
	}
	
	jQuery.bill_dialog={
		'alert':function(content_html,options){
			if( bill_core.string_is_solid(content_html)==='1' ){
			}else{
				bill_core.debug_console('jQuery.bill_dialog.'+arguments.callee.name+' content_html error!','error');
				return;
			}
			if(typeof(options)==='undefined'){
				options={};
			}
			
			var default_options={
				'title':'提醒',
				'position':'center'
			};
			
			var opts = $.extend( {}, default_options, options );
			$('#bill_dialog_alert').html(content_html);
			$('#bill_dialog_alert').dialog({
				'dialogClass': "no-close",
				'draggable': false,
				'resizable': false,
				'width':350,
				'position':opts.position,
				'modal':true,
				'title':opts.title,
				'closeOnEscape': false,
				'show': {
					'effect':'drop',
					'duration':400
				},
				'hide': {
					'effect':'drop',
					'duration':400
				},
				'buttons':[
					{	
						'id' : "bill_dialog_ok_button",
						'text' : "確定",
						'click': function(){
							$(this).dialog("close"); 
						}
					}
				] 
			});
			
		},
		'notify':function(content_html,options){
			if( bill_core.string_is_solid(content_html)==='1' ){
			}else{
				bill_core.debug_console('jQuery.bill_dialog.'+arguments.callee.name+' content_html error!','error');
				return;
			}
			
			if(typeof(options)==='undefined'){
				options={};
			}
			
			var default_options={
				'title':'提醒',
				'position':'center',
				'stay_time':2000
			};
			
			var opts = $.extend( {}, default_options, options );
			$('#bill_dialog_notify').html(content_html);
			$('#bill_dialog_notify').dialog({
				'dialogClass': "no-close",
				'draggable': false,
				'resizable': false,
				'position':opts.position,
				'modal':true,
				'title':opts.title,
				'closeOnEscape': false,
				'show': {
					'effect':'drop',
					'duration':400
				},
				'hide': {
					'effect':'drop',
					'duration':400
				},
				
				'open': function( event, ui ){
					setTimeout(function(){$('#bill_dialog_notify').dialog("close")},opts.stay_time)
				}
			});
			
		},
		confirm:function(){
			
		},
		page:function(){
			
		}
	};
	jQuery(
		function(){
			var alert_temp_html='';
			alert_temp_html='<div id="bill_dialog_alert" style="display:none;"></div>';
			$('body').append(alert_temp_html);
			
			var notify_temp_html='';
			notify_temp_html='<div id="bill_dialog_notify" style="display:none;"></div>';
			$('body').append(notify_temp_html);
			
			var confirm_temp_html='';
			confirm_temp_html='<div id="bill_dialog_confirm" style="display:none;"></div>';
			$('body').append(confirm_temp_html);
			
			var page_temp_html='';
			page_temp_html='<div id="bill_dialog_page" style="display:none;"></div>';
			$('body').append(page_temp_html);
		}
	);
})(jQuery,bill_core);