jQuery(document).ready(function () {
	jQuery('.acc_trigger').not('.trigger_active').next('.acc_sketchfold').hide();
	jQuery('.acc_trigger').click( function() {
		$id = jQuery(this).attr("data-trigger-id");
		if(jQuery(this).hasClass('trigger_active') === true){
			jQuery(this).removeClass('trigger_active').next('.acc_sketchfold.triggerFold_'+$id).slideUp();
		} else {
		jQuery('.acc_sketchfold').slideUp();
		jQuery('.acc_trigger').removeClass('trigger_active');
		jQuery(this).addClass('trigger_active').next('.acc_sketchfold.triggerFold_'+$id).slideDown();}
	});
});