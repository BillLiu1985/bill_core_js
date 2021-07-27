(function(jQuery,bill_core){
	
	jQuery.bill_input_tip={
		'package_dir_url_path':bill_core.base_url+'js/bill_core_js/bill_input_tip/',
		'xOffset':-20,
		'yOffset':20,
		'input_jquery_expression':
			'input[type="text"][tip][tip!=""],'+
			'input[type="password"][tip][tip!=""],'+
			'input[type="date"][tip][tip!=""],'+
			'textarea[tip][tip!=""]',
		'attach':function(jquery_expression){
			if(bill_core.global_typeof(jquery_expression)!=='string'){
				bill_core.debug_console('jquery_expression error','error')
				return;
			}
			this.deattach(jquery_expression);
			var mouseover_handler_func=function(e){
				var display_tip=jQuery(this).attr('tip');
				var temp_reg_tip=bill_core.validate_regexp_tips[display_tip];
				if(temp_reg_tip===undefined){
				}else{
					display_tip=temp_reg_tip;
				}
				var top = (e.pageY + jQuery.bill_input_tip.yOffset);
				var left = (e.pageX + jQuery.bill_input_tip.xOffset);
				
				jQuery('body').append(
					'<p id="vtip">'+
						'<img id="vtipArrow" src="'+jQuery.bill_input_tip.package_dir_url_path+'images/vtip_arrow.png"/>' + 
						display_tip +
					'</p>'
				);
				jQuery('p#vtip').css("top", top+"px").css("left", left+"px");			
			}
			var mousemove_handler_func=function(e){
				var display_tip=jQuery(this).attr('tip');
				var temp_reg_tip=bill_core.validate_regexp_tips[display_tip];
				if(temp_reg_tip===undefined){
				}else{
					display_tip=temp_reg_tip;
				}
				
				var top = (e.pageY + jQuery.bill_input_tip.yOffset);
				var left = (e.pageX + jQuery.bill_input_tip.xOffset);
				jQuery('p#vtip').css("top", top+"px").css("left", left+"px");
			}
			var mouseout_handler_func=function(e){
				jQuery("p#vtip").remove();
			}
			
			jQuery(jquery_expression).on(
				{
					'mouseover.bill_input_tip':mouseover_handler_func
					,
					'mousemove.bill_input_tip':mousemove_handler_func
					,
					'mouseout.bill_input_tip':mouseout_handler_func
				}
				,
				jQuery.bill_input_tip.input_jquery_expression
			)
		
		},
		'deattach':function(jquery_expression){
			if(bill_core.global_typeof(jquery_expression)!=='string'){
				bill_core.debug_console('jquery_expression error','error')
				return;
			}
			jQuery(jquery_expression).off(
				'.bill_input'
				,
				jQuery.bill_input_tip.input_jquery_expression
			)
		}
	};
	
	
}(jQuery,bill_core));

