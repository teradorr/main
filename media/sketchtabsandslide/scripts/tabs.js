jQuery( document ).ready(function() {
	jQuery('.sketchtabs .tabs > ul').each(function () {

		var jQueryactive, jQuerycontent, jQuerylinks = jQuery(this).find('a');


		jQueryactive = jQuery(jQuerylinks.filter('[href="' + location.hash + '"]')[0] || jQuerylinks[0]);
		jQueryactive.addClass('active');

		jQuerycontent = jQuery(jQueryactive[0].hash);

		jQuerylinks.not(jQueryactive).each(function () {
			jQuery(this.hash).hide();
		});

		jQuery(this).on('click', 'a', function (e) {
			jQueryactive.removeClass('active');
			jQuerycontent.hide();

			jQueryactive = jQuery(this);
			jQuerycontent = jQuery(this.hash);

			jQueryactive.addClass('active');
			jQuerycontent.show();

			e.preventDefault();
		});
	});
});