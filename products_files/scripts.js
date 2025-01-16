if(document.querySelectorAll('.js-init-click').length){
	setTimeout(function (){
		document.querySelectorAll('.js-init-click').forEach(el => {
			el.dispatchEvent(new Event('click', {
				bubbles: true,
				cancelable: true,
				view: window
			}));
		});
	}, 10);
}

function sendYandexGoal(target) {
	if((typeof ym != 'undefined') && target != 'undefined' && target){
		ym(91700576, 'reachGoal', target);
		console.log('yandex_goal: '+target);
	}
}

function showDownloadCatalogMessage($form, responce){
	if($form.querySelector('.success-output')) {
		var brandSelect = $form.querySelector('[name="brand"]');
		if(brandSelect){
			let href = brandSelect.options[brandSelect.selectedIndex].getAttribute('data-href');
			$form.querySelector('.success-output .catalog-download-link').setAttribute('href', href);
		}
		$form.querySelector('.success-output').style.display = 'block';
		$form.querySelector('.success-output .catalog-download-link').click();
	}
}

$(document).ready((function() {
    $(".map-columns__dropdown-right-arrow").on("click", (function() {
        var _this = $(this)
          , bOpen = !_this.hasClass("opened")
          , parent = _this.closest("li.item");
        if (parent.length) {
            var dropdown = parent.find(">.map-columns__dropdown");
            dropdown.length && (dropdown.slideToggle(),
            dropdown.toggleClass("opened"),
            _this.toggleClass("opened"))
        }
    }
    ))
}
));

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
/*side head block*/
$(document).on("click", ".slide-block .slide-block__head", function (e) {
	var _this = $(this),
		menu = _this.siblings(".slide-block__body"),
		bVisibleMeu = menu.is(":visible");

	if (!_this.hasClass("clicked") && menu.length && !_this.hasClass("ignore") && !$(e.target).attr("href")) {
		var type = _this.data("id");
		_this.addClass("clicked");

		if (bVisibleMeu) {
			$.cookie(type + "_CLOSED", "Y", {
				path: "/",
			});
			menu.slideUp();
		} else {
			$.removeCookie(type + "_CLOSED", {
				path: "/",
			});
			menu.slideDown();
		}

		_this.toggleClass("closed");
		_this.removeClass("clicked");
	}
});
$(document).on("click", ".side-menu .toggle_block", function (e) {
	var _this = $(this),
		menu = _this.closest(".child").find("> .submenu-wrapper"),
		bVisibleMeu = menu.is(":visible");

	if (!_this.hasClass("clicked")) {
		_this.addClass("clicked");
		menu.slideToggle(150, function () {
			_this.removeClass("clicked");
		});
		_this.toggleClass("closed");
	}

	_this.closest(".child").toggleClass("opened");
});
/**/


const $range = document.querySelectorAll('[data-range="true"]');

if ($range) {
	$range.forEach(el => {
		let min = Number(el.getAttribute('data-min')),
			max = Number(el.getAttribute('data-max')),
			minStart = Number(el.getAttribute('data-start-min')),
			maxStart = Number(el.getAttribute('data-start-max'));

		if(!minStart) minStart = min;
		if(!maxStart) minStart = max;

		noUiSlider.create(el.querySelector('[data-range-slide]'), {
			start: [minStart, maxStart],
			connect: true,
			range: {
				'min': min,
				'max': max
			}
		})

		el.querySelector('[data-range-slide]').noUiSlider.on('update', function (values, handle) {
			if (handle) {
				el.querySelector('[data-range="input_2"]').value = values[handle].replace(/[.]/g, ",")
				// el.querySelector('[data-range="input_text_2"]').innerHTML = values[handle].replace(/[.]/g, ",")
			} else {
				el.querySelector('[data-range="input_1"]').value = values[handle].replace(/[.]/g, ",")
				// el.querySelector('[data-range="input_text_1"]').innerHTML = values[handle].replace(/[.]/g, ",")
			}
		})

		el.querySelector('[data-range-slide]').noUiSlider.on('end', (_, handle) => {
			const event = new Event('change', {
				bubbles: true,
				cancelable: true,
				view: window
			});

			if (handle) {
				el.querySelector('[data-range="input_2"]').dispatchEvent(event)
			} else {
				el.querySelector('[data-range="input_1"]').dispatchEvent(event)
			}
		})
	})
}
document.addEventListener('click', e => {
	if( e.target.closest('.js-change-card-view') ) {
		e.preventDefault();
		setCardViewCookies(e.target.closest('.js-change-card-view'));
	}else if( e.target.closest('.js-sort-selector') ) {
		e.preventDefault();
		setSortCookies(e.target.closest('.js-sort-selector'));
	}
});

function setSortCookies($this){
	setCookie('sort_field', $this.getAttribute('data-sort_field'));
	setCookie('sort_dir', $this.getAttribute('data-sort_dir'));
	
	window.location.reload();
}

function setCardViewCookies($this){
	setCookie('card_view', $this.getAttribute('data-view'));
	if($this.getAttribute('data-cols')) setCookie('card_cols', $this.getAttribute('data-cols'));
	
	window.location.reload();
}

document.addEventListener('submit', e => {
	if( e.target.closest('._form') ) {
		let $form = e.target;
		e.preventDefault();
		
		let click_timeout = 4000;
		if ($form.getAttribute('data-timeout')) {
			click_timeout = +$form.getAttribute('data-timeout');
		}

		clearFormErrors($form);
		let $submit = $form.querySelector('[type="submit"], .js-submit');
		if($submit) $submit.classList.add('loading');

		var headers = {"X-Requested-With":"XMLHttpRequest"};
		if( document.querySelector('meta[name="csrf-token"]') ) {
			headers['X-CSRF-Token'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
		}		

		var formData = new FormData($form);
		if(e.submitter && e.submitter.getAttribute('name')){
			formData.append(e.submitter.getAttribute('name'), e.submitter.value);
		}
		
		let afterSuccess = false;
		if ($form.getAttribute('data-after_success')) {
			afterSuccess = $form.getAttribute('data-after_success');
		}
		
		fetch(
			$form.getAttribute('action'),
			{
				method: 'POST',
				body: formData,
				headers: headers
			}
		).then(
			response => response.json()
		).then(
			response => {
				if (!response.result) {
					if (response.errors) {
						var firstError = false;
						for (var key in response.errors) {
							if(!firstError && response.errors[key][0]) firstError = response.errors[key][0];
							if($form.querySelector('[name="' + key + '"]')){
								$form.querySelector('[name="' + key + '"]').classList.add('error');
							}
						}
						if(response.message){
							if(response.message == 'The given data was invalid.' && firstError){
								showErrorMessage($form, firstError);
							}else{
								showErrorMessage($form, response.message);
							}
							
						}else{
							showErrorMessage($form, Object.values(response.errors)[0]);
						}
					} else if(response.message_html) {
						if ($form.querySelector('._message')) {

							$form.querySelector('._message').innerHTML = response.message;
						} else {
							showErrorMessage($form, response.message);
						}

					} else {
						showErrorMessage($form, response.message);
					}
				} else {

					if($form.getAttribute('data-ytarget')){
						sendYandexGoal($form.getAttribute('data-ytarget'));
					}
					
					if($form.getAttribute('data-reset') == 1) {
						$form.reset();
					}
					if (response.refresh || $form.getAttribute('data-refresh') == 1) {
						window.location.reload();
					}
					
					if(afterSuccess){
						if(window[afterSuccess]($form, response)) return true;
					}

					if (response.href) {
						if(!response.timeout){
							var win = window.location.href = response.href;
						}else{
							showSuccessMessage($form, response);
							setTimeout(function () {
								var win = window.location.href = response.href;
							}, response.timeout);
						}
					
						
					} else if(response.message_html) {
						if ($form.querySelector('._message')) {
							$form.querySelector('._message').innerHTML = response.message_html;
						} else {
							showErrorMessage($form, response.message);
						}
						
					} else {
						showSuccessMessage($form, response);
						if($form.getAttribute('data-redirect')){
							window.location.href = $form.getAttribute('data-redirect');
						}
						setTimeout(function () {
							if ($form.getAttribute('data-click')) {
								document.querySelector($form.getAttribute('data-click')).click()
							} else if(document.querySelector('.b-popup__close')) {
								document.querySelector('.b-popup__close').click();
							}
						}, click_timeout);
					}
				}
				if($submit) $submit.classList.remove('loading');
			}
		).catch((error) => {
			console.log(error);
			if($submit) $submit.classList.remove('loading');
		});
	}
});

function clearFormErrors($form) {
	let errs = $form.querySelectorAll('._err');
	errs.forEach(function (item, i) {
		item.innerHTML = "";
	});
	
	//убираем класс ошибки с полей
	let err_fields = $form.querySelectorAll('.error');
	err_fields.forEach(function (item, i) {
		item.classList.remove('error');
	});
	if($form.querySelector('._message')){
		$form.querySelector('._message').innerHTML = '';
	}
	
}

function showErrorMessage($form, message) {
	if(typeof message == 'object'){
		alertError.show(message[0]);
	}else{
		alertError.show(message);
	}
}

function showSuccessMessage($form, response) {
	if($form.getAttribute('data-center_msg') == 1){
		alertSuccessCenter.show(response.message);
	}else{
		alertSuccess.show(response.message);
	}
	
}

function getParam(p){
    var match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
	options = {
		path: '/',
	};

	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString();
	}

	let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

	for (let optionKey in options) {
		updatedCookie += "; " + optionKey;
		let optionValue = options[optionKey];
		if (optionValue !== true) {
			updatedCookie += "=" + optionValue;
		}
	}

	document.cookie = updatedCookie;
}

function deleteCookie(name) {
	setCookie(name, "", {
		'max-age': -1
	})
}

if( document.querySelector('.swiper-catalog') ) {

	document.querySelectorAll('.swiper-catalog').forEach( slider => {
		const $paginationWrap = slider.querySelector('.catalog-swiper-pagination');
		const $prev = slider.querySelector('.catalog-swiper-prev');
		const $next = slider.querySelector('.catalog-swiper-next');

		const swiper = new Swiper(slider, {
			slidesPerView: 1.2,
			spaceBetween: 24,
			pagination: {
				el: $paginationWrap,
				clickable: true,
			},
			navigation: {
				nextEl: $next,
				prevEl: $prev,
			},
			breakpoints: {
				640: {
					slidesPerView: 2,
					spaceBetween: 24,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 32,
				},
				1400: {
					slidesPerView: 4,
					spaceBetween: 32,
				},
			}
		});
	});

}

// mob triggers carousel
let ready = (callback) => {
	if (document.readyState != "loading") callback();
	else document.addEventListener("DOMContentLoaded", callback);

}

ready(() => {
	const $mobTriggerCarousel = document.querySelector('[data-mob-slider-triggers]');
	const mediaMobTriggers = window.matchMedia("(max-width: 1023px)");
	if ($mobTriggerCarousel && mediaMobTriggers.matches) {

		tns({
			container: $mobTriggerCarousel,
			controls: false,
			nav: true,
			gutter: 16,
			nav: true,
			navPosition: 'bottom',
			responsive: {
				0: {
					items: 2
				},
				480: {
					items: 3
				}
			}
		});
	}

	const $mobCarousel = document.querySelector('[data-mob-gallery]');
	const mediaMobCarousel = window.matchMedia("(max-width: 992px)");

	if ($mobCarousel && mediaMobCarousel.matches) {

		tns({
			container: $mobCarousel,
			controls: false,
			nav: true,
			navPosition: 'bottom',
			gutter: 16,
			responsive: {
				0: {
					items: 1
				},
				560: {
					items: 2
				}
			}
		});
	}
	// catalog slider

	if( document.querySelector('[data-products-carousel]') ) {
		document.querySelectorAll('[data-products-carousel]').forEach( slider => {
			var slider = tns({
				container: slider,
				slideBy: 'page',
				controls: false,
				nav: true,
				autoplay: true,
				autoplayTimeout: 5000,
				autoplayButtonOutput: false,
				navPosition: 'bottom',
				gutter: 20,
				responsive: {
					0: {
						items: 2
					},
					500: {
						items: 3
					},
					992: {
						items: 4
					},
					1500: {
						items: 5
					}
				}
			});


		});
	}


// end catalog slider


	function getCookieCustom(name) {
		let matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	const $cookies = document.querySelector('[data-cookies]');
	if( $cookies && getCookieCustom('cookies_presentation') != 1) {
		let timeout = 5000;
		if( $cookies.getAttribute('data-timeout') ) {
			timeout = +$cookies.getAttribute('data-timeout');
		}

		let bannerTimer = setTimeout( () => {
			$cookies.classList.add('_visible');
		}, timeout);

		const handlerClick = (ev) => {
			const add = ev.target.closest('[data-agree-cookies]')
			const close = ev.target.closest('[data-close-cookies]')

			if(add) {
				clearTimeout(bannerTimer);
				document.cookie = 'cookies_presentation=1;max-age=31536000';
				$cookies.classList.remove('_visible')
				$cookies.removeEventListener('click', handlerClick, { passive: true } )
				return
			}

			if(close) {
				$cookies.classList.remove('_visible')
			}
		}

		$cookies.addEventListener('click', handlerClick, { passive: true });
	}

});
// gallery images carousel
window.addEventListener('load', function(event) {
	var $actMenuLink = $('.burger-menu__item--current');
	$actMenuLink.removeClass('burger-menu__item--current')
	$actMenuLink.trigger('mouseenter');
});

// sidebar scroll
window.addEventListener('load', function(event) {
	const mq = window.matchMedia('(min-width: 991px)').matches;
	const $scrollSidebar = document.querySelector('.left_block .sticky-block') || document.querySelector('.b-grid-layout__aside .sticky-block');

	if(mq && $scrollSidebar){
		const calculateSidebarHeight = () => {
			let top = $scrollSidebar.getBoundingClientRect().top < 0 ? 0: $scrollSidebar.getBoundingClientRect().top;
			const height = window.innerHeight - top;
			$scrollSidebar.style.height = height + 'px';
		}

		calculateSidebarHeight();
		window.addEventListener('scroll', function (e) {
			calculateSidebarHeight();
		});
	}

});
// end sidebar scroll


// tooltips events
let tooltip;
document.onmouseover = function(event) {

	let anchorElem = event.target.closest('[data-tooltip]');

	if (!anchorElem) return;

	tooltip = showTooltip(anchorElem, anchorElem.dataset.tooltip);
}

document.onmouseout = function() {

	if (tooltip) {
		tooltip.remove();
		tooltip = false;
	}

}


function showTooltip(anchorElem, html) {
	let tooltipElem = document.createElement('div');
	let tooltipPos = anchorElem.dataset.tooltipPos;
	tooltipElem.className = 'tooltip-cstm';
	tooltipElem.innerHTML = html;
	document.body.append(tooltipElem);

	if(!html) return;

	let coords = anchorElem.getBoundingClientRect();


	let left = coords.left + (anchorElem.offsetWidth - tooltipElem.offsetWidth) / 2;
	if (left < 0) left = 0;

	let top = coords.top - tooltipElem.offsetHeight - 5;
	if (top < 0 || tooltipPos == 'bottom') {
		top = coords.top + anchorElem.offsetHeight + 5;
	}

	tooltipElem.style.left = left + 'px';
	tooltipElem.style.top = top + 'px';

	return tooltipElem;
}

// end tooltips events

if( window.matchMedia('(max-width: 992px)').matches ) {
	if(document.querySelector('[data-hidden-mob-text]')){
		document.querySelectorAll('[data-hidden-mob-text]').forEach( item => {
			const maxHeight = +item.getAttribute('data-max-mob-height');
			const height = item.clientHeight;

			if( maxHeight < height ) {
				item.style.height = maxHeight + 'px';
				item.style.overflow = 'hidden';
				item.closest('[data-hidden-parent]').querySelector('[data-hidden-link-wrap]').style.display = '';
			}
		})
	}

	document.addEventListener('click', e => {
		if( e.target.closest('[data-hidden-link-show]') ) {

			const $target = e.target.closest('[data-hidden-link-show]');
			const $linkWrap = $target.closest('[data-hidden-link-wrap]');
			const $parent = $target.closest('[data-hidden-parent]').querySelector('[data-hidden-mob-text]');

			$linkWrap.remove();
			$parent.style.height = '';
			$parent.style.overflow = '';

		}
	});
}

const slideUpCstm = (target, duration = 500) => {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.boxSizing = 'border-box';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout( () => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
	}, duration);
};

const slideDownCstm = (target, duration = 500) => {
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;
	if (display === 'none') display = 'block';
	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.boxSizing = 'border-box';
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout( () => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
	}, duration);
};

document.addEventListener('click', e => {
	if( e.target.closest('[data-mob-toggle-title]') ) {
		const $target = e.target.closest('[data-mob-toggle-title]');
		const $content = $target.closest('div').querySelector('[data-hidden-step]');
		if( $target.classList.contains('js-act') ) {
			$target.classList.remove('js-act');
			slideUpCstm($content);
		} else {
			$target.classList.add('js-act');
			slideDownCstm($content);
		}
	}
});

function sendEcommerceOrder($form, response){
    if(typeof dataLayer == 'undefined') return false;
    if(!response.ecommerce) return false;
    
    window.dataLayer.push(response.ecommerce);
}


//по клику на ссылку товара отправляем клик в коммерцию, данные по товару берем из переменной которая уходит в коммерцию при просмотре списка.
if(typeof dataLayer != 'undefined' && typeof ecommerceListData != 'undefined'){
    document.addEventListener('click', e => {
        if( e.target.closest('[data-elink]') ) {
            let product = ecommerceListData.ecommerce.impressions.products.find(obj => obj['id'] === +e.target.closest('[data-elink]').getAttribute('data-elink'));
            if(product){
                let ecommerceObj = {
                    "ecommerce": {
                        "currencyCode": "RUB",
                        "click": {
                            "products": [ 
                            ]
                        }
                    }
                };
                ecommerceObj.ecommerce.click.products.push(product);
                window.dataLayer.push(ecommerceObj);
            }
        }
    });
}


// start for filter
const $filterList = document.querySelector('[data-filter-list]')

if($filterList) {
	setTimeout(() => {		
		document.querySelectorAll('[data-filter-item].active').forEach(item => {
			item.classList.remove('active')
		})
	}, 200);

	$filterList.addEventListener('click', (ev) => {
		if(!window.matchMedia('(min-width: 1024px)').matches) return

		const $button = ev.target.closest('[data-filter-btn]')
		const $filterItemAct = document.querySelector('[data-filter-item].active')
		
		if($filterItemAct) $filterItemAct.classList.remove('active')
		if(!$button) return  

		
		const $parent = $button.closest('[data-filter-item]')
		const $content = $parent.querySelector('[data-filter-content]')
		const dataContent = $content.getBoundingClientRect()

		$content.style.position = 'fixed'
		$content.style.top = `${dataContent.top}px`
		$content.style.left = `${dataContent.left}px`
		$content.style.maxWidth = `${dataContent.width}px`
	})

	document.addEventListener('click', ev => {
		if(!ev.target.closest('[data-filter-list]')) {
			const $filterItemAct = document.querySelector('[data-filter-item].active')
			if(!$filterItemAct) return

			$filterItemAct.classList.remove('active')
		}
	})
}

const $filterOpenList = document.querySelector('[data-filter-open-list]')

if($filterOpenList && window.matchMedia('(min-width: 1024px)').matches) {
	$filterOpenList.addEventListener('click', e => {
		const $filterBox =  document.querySelector('[data-filter-box]')
		const scrollHeight = $filterBox.scrollHeight
		const $filterLinks =  document.querySelector('[data-filter-links]');

		if($filterBox.classList.contains('js-act')) {
			$filterBox.classList.remove('js-act')
			$filterOpenList.classList.remove('js-act')
			$filterBox.style.removeProperty('max-height')
		} else {
			$filterBox.style.maxHeight = '';
			$filterLinks.style.display = 'none';
			$filterBox.style.display = '';

			if(document.querySelector('.b-filter-wrap__btn-open.js-act')) document.querySelector('.b-filter-wrap__btn-open.js-act').classList.remove('js-act');

			$filterOpenList.classList.add('js-act')
			$filterBox.classList.add('js-act')
			$filterBox.style.maxHeight = `${$filterBox.scrollHeight}px`

		}
	})
}

const $filterOpenLinks = document.querySelector('[data-filter-open-links]');

if($filterOpenLinks && window.matchMedia('(min-width: 1024px)').matches) {

	$filterOpenLinks.addEventListener('click', e => {
		e.preventDefault();

		const $filterBox =  document.querySelector('[data-filter-box]');
		const $filterLinks =  document.querySelector('[data-filter-links]');

		if($filterOpenLinks.classList.contains('js-act')) {
			$filterBox.style.display = '';
			$filterBox.style.maxHeight = '';
			$filterLinks.style.display = 'none';
			$filterOpenLinks.classList.remove('js-act');
		} else {
			if(document.querySelector('.b-filter-wrap__btn-open.js-act')) document.querySelector('.b-filter-wrap__btn-open.js-act').classList.remove('js-act');
			$filterBox.style.display = 'none';
			$filterBox.classList.remove('js-act');
			$filterOpenLinks.classList.add('js-act');
			$filterLinks.style.display = 'block';
		}

	});

}
// end for filter

let hiddenTexts = document.querySelectorAll('[data-hidden-text]');

let checkHiddenText = () => {
	hiddenTexts.forEach( el => {
		let textWrap = el.querySelector('.hidden-text__wrap');
		let link = el.querySelector('[data-show-text]');

		if( textWrap.clientHeight < textWrap.querySelector('div').clientHeight ) {
			link.style.display = '';
		} else {
			link.style.display = 'none';
		}
	});
};

document.addEventListener('click', e => {
	let target = e.target.closest('[data-show-text]');

	if( target != null ) {

		let textWrap = target.closest('[data-hidden-text]').querySelector('.hidden-text__wrap');

		if( !target.classList.contains('js-act') ) {

			target.classList.add('js-act');
			textWrap.style.maxHeight = 'none';

		} else {

			target.classList.remove('js-act');
			textWrap.style.maxHeight = '';

		}

		let linkText = target.innerHTML;
		target.innerHTML = target.getAttribute('data-text');
		target.setAttribute('data-text', linkText);

	}
});

// document.addEventListener('submit', function(e) {
// 	if(e.target.closest('.js-filters-form')){
// 		e.preventDefault();
// 		loadFilteredProducts(e.target.closest('.js-filters-form'));
// 	}
// });

document.addEventListener('change', function(e) {
	if(e.target.closest('.js-filters-form')){
		loadFilteredProducts(e.target.closest('.js-filters-form'));
	}
});

var filterTimer;
function loadFilteredProducts($form, page = 1, collection_id = 0){
	clearTimeout(filterTimer);
	filterTimer = setTimeout(function (){
		var $container = document.querySelector('.js-products-wrap');
		$container.classList.add('loading');
		
		var headers = {"X-Requested-With":"XMLHttpRequest"};
		if( document.querySelector('meta[name="csrf-token"]') ) {
			headers['X-CSRF-Token'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
		}
		
		var formData = new FormData($form);
		formData.set('page', page);
		
		var currentUrl = window.location.origin + window.location.pathname;
		
		fetch(
			currentUrl,
			{
				method: 'POST',
				body: formData,
				headers: headers
			}
		).then(
			response => response.json()
		).then(
			response => {
				if (!response.result) {
					alertError.show(response.message);
				} else {
					$container.innerHTML = response.message;
				}
				$container.classList.remove('loading');
			}
		).catch((error) => {
			alertError.show(error);
			$container.classList.remove('loading');
		});
		
	},500);
}


Element.prototype.trigger = function (type) {
	this.dispatchEvent(new Event(type, {
		bubbles: true,
		cancelable: true,
		view: window
	}));
}

// calculate resourse

const $formCalcResourse = document.querySelector('[data-calc-resourse]');
if( $formCalcResourse ) {
	$formCalcResourse.addEventListener('submit', (e) => {
		e.preventDefault();
		e.stopPropagation();

		$formCalcResourse.querySelectorAll('.error').forEach( el => {
			el.classList.remove('error');
		});

		const $Brg = $formCalcResourse.querySelector('[name="type"]');
		const $C = $formCalcResourse.querySelector('[name="lifting"]');
		const $P = $formCalcResourse.querySelector('[name="load"]');
		const $Speed = $formCalcResourse.querySelector('[name="rotation"]');

		if( !$C.value ) $C.closest('.input').classList.add('error');
		if( !$P.value ) $P.closest('.input').classList.add('error');
		if( !$Speed.value ) $Speed.closest('.input').classList.add('error');

		if( !$C.value || !$P.value || !$Speed.value ) return alertError.show('Не все данные заполнены');

		let Stepen = null;
		let C = $C.value;
		let P = $P.value;
		let Speed = $Speed.value;

		let Pmin = +$P.getAttribute('data-min');
		let Pmax = +$P.getAttribute('data-max');
		let SpeedMin = +$Speed.getAttribute('data-min');
		let SpeedMax = +$Speed.getAttribute('data-max');

		if( P < Pmin || P > Pmax ) return alertError.show(`Эквивалентная нагрузка должена быть от ${Pmin} до ${Pmax}`);
		if( Speed < SpeedMin || Speed > SpeedMax ) return alertError.show(`Частота вращения должна быть от ${SpeedMin} до ${SpeedMax}`);

		if( $Brg.value == 'roller' ) {
			Stepen = 3.33333;
		} else {
			Stepen = 3;
		}

		console.log(Stepen);

		const Lmr = Math.round(Math.pow((C / P), Stepen));
		const Lh = Math.round(Lmr * 1000000 / Speed / 60);

		const $total = $formCalcResourse.querySelector('.form-total').style.display = '';
		$formCalcResourse.querySelector('[data-lmr]').innerText = Lmr;
		$formCalcResourse.querySelector('[data-lh]').innerText = Lh;

	});
}

// end calculate resourse

function setEqualHeights(selector) {
	// Получаем все элементы по селектору
	const elements = document.querySelectorAll(selector);
	// Находим максимальную высоту
	let maxHeight = 0;
	elements.forEach(element => {
		const height = element.offsetHeight;
		if (height > maxHeight) {
			maxHeight = height;
		}
	});
	// Устанавливаем всем элементам одинаковую высоту
	elements.forEach(element => {
		element.style.height = maxHeight + 'px';
	});
}

// Вызываем функцию, передавая селектор
setEqualHeights('.b-quality-description-item__title');

// scripts for application popup

document.addEventListener('click', e => {

	const $target = e.target.closest('[data-application-link]');

	if( $target ) {
		e.preventDefault();
		e.stopPropagation();

		const $popup = document.querySelector('[data-application-popup]');
		const $layout = document.querySelector('[data-application-layout]');

		$popup.classList.add('js-act');
		$layout.classList.add('js-act');
	}

	if( e.target.closest('[data-application-layout]') ) {
		const $popup = document.querySelector('[data-application-popup]');
		const $layout = document.querySelector('[data-application-layout]');

		$popup.classList.remove('js-act');
		$layout.classList.remove('js-act');
	}


});


// test func
function callbackApplication() {
	return true;
}
// end test func

function initApplicationSteps(){
	const $appPopup = document.querySelector('[data-application-popup]');
	if( !$appPopup ) return;

	let $currentStep = $appPopup.querySelector('.application-popup__content-step.js-act');
	let currentStepsCount = +$currentStep.getAttribute('data-app-content-step');
	let $currentCounter = $appPopup.querySelector('.application-popup__step.js-act');

	const $stepBtnPrev = $appPopup.querySelector('[data-app-step-prev]');
	const $stepBtnNext = $appPopup.querySelector('[data-app-step-next]');
	const $btnAppSubmit = $appPopup.querySelector('[data-app-step-submit]');


	checkStep();

	$stepBtnNext.addEventListener('click', e => {
		e.preventDefault();
		changeStep(currentStepsCount + 1);
	});

	$stepBtnPrev.addEventListener('click', e => {
		e.preventDefault();
		changeStep(currentStepsCount - 1);
	});


	function changeStep(currentStep) {

		var $nextStep = $appPopup.querySelector(`[data-app-content-step="${currentStepsCount}"]`);

		const callbackFunc = $nextStep.getAttribute('data-step-approve-func');

		if( typeof window[callbackFunc] == "function" ) {
			if( !window[callbackFunc]() ) return;
		}

		currentStepsCount = currentStep;

		$currentStep.classList.remove('js-act');
		$currentStep = $appPopup.querySelector(`[data-app-content-step="${currentStepsCount}"]`);
		$currentStep.classList.add('js-act');

		$currentCounter.classList.remove('js-act');
		$currentCounter = $appPopup.querySelector(`[data-app-step="${currentStepsCount}"]`);
		$currentCounter.classList.add('js-act');

		$stepBtnPrev.classList.remove('js-hide')

		checkStep();

	}

	function checkStep() {
		if( currentStepsCount == 1 ) {
			$stepBtnPrev.classList.add('js-hide');
		} else {
			$stepBtnPrev.classList.remove('js-hide');
		}

		if( currentStepsCount == 4 ) {
			$stepBtnNext.style.display = 'none';
			$btnAppSubmit.style.display = '';
		} else {
			$stepBtnNext.style.display = '';
			$btnAppSubmit.style.display = 'none';
		}
	}


}

window.addEventListener('load', function(event) {
	initApplicationSteps();
});


// end scripts for application popup
