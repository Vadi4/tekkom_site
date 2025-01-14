$(document).ready(function () {
	// $('.bx_filter_search_reset').on('click', function () {
	// 	location.href = $('form.smartfilter').find('#del_url').val();
	// })

	$(document).on('click', '.bx_filter_parameters_box_title', function (e) {
		var active = 2;
		if ($(this).closest(".bx_filter_parameters_box").hasClass("active")) {
			$(this).next(".bx_filter_block").slideUp(100);
		} else {
			$(this).next(".bx_filter_block").slideDown(200);
		}
		$(this).closest(".bx_filter_parameters_box").toggleClass("active");

		if ($(this).closest(".bx_filter_parameters_box").hasClass("active")) {
			active = 3;
		}

		$.cookie.json = true;
		$.cookie("filter_prop_" + $(this).closest(".bx_filter_parameters_box").data('prop_code'), active, {
			path: '/',
			domain: '',
			expires: 360
		});

		e.preventDefault();
	});
	$('.bx_filter_parameters_box').each(function () {
		if ($.cookie("filter_prop_" + $(this).data('prop_code')) == 2) {
			$(this).removeClass('active');
			$(this).find('.bx_filter_block').hide();
		} else if ($.cookie("filter_prop_" + $(this).data('prop_code')) == 3) {
			$(this).addClass('active');
			$(this).find('.bx_filter_block').show();
		}
	})
})