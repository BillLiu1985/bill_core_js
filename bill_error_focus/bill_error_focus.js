(function(jQuery,bill_core){
	
	jQuery.bill_error_focus={
		'action':'add_class',
		'input_jquery_expression':
			'input[type="text"][validate_fail_message],'+
			'input[type="password"][validate_fail_message],'+
			'select[validate_fail_message],'+
			'textarea[validate_fail_message]',
		'attach':function(jquery_expression){
			if(bill_core.global_typeof(jquery_expression)!=='string'){
				bill_core.debug_console('jquery_expression error','error')
				return;
			}
			this.deattach(jquery_expression);
			if(jQuery.bill_error_focus.action==='add_class'){
				jQuery(jquery_expression).find(this.input_jquery_expression).each(
					function(){
						if(jQuery(this).attr('validate_fail_message')!==''){
							jQuery(this).addClass("input_validation-failed");
						}
					}
				);
			}
		},
		'deattach':function(jquery_expression){
			if(bill_core.global_typeof(jquery_expression)!=='string'){
				bill_core.debug_console('jquery_expression error','error')
				return;
			}
			if(jQuery.bill_error_focus.action==='add_class'){
				jQuery(jquery_expression).find(this.input_jquery_expression).removeClass("input_validation-failed");
			}
		},
		'easy_attach':function(jquery_expression){
			if(bill_core.global_typeof(jquery_expression)!=='string'){
				bill_core.debug_console('jquery_expression error','error')
				return;
			}
			if(jQuery.bill_error_focus.action==='add_class'){
				jQuery(jquery_expression).addClass("input_validation-failed");
			}
			
		},
		'easy_deattach':function(jquery_expression){
			if(bill_core.global_typeof(jquery_expression)!=='string'){
				bill_core.debug_console('jquery_expression error','error')
				return;
			}
			if(jQuery.bill_error_focus.action==='add_class'){
				jQuery(jquery_expression).removeClass("input_validation-failed");
			}
			
		}
	};
	
	
}(jQuery,bill_core));

