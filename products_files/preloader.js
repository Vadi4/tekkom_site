if (document.getElementById('preloader')) {
	const outer = document.createElement('div');
	outer.style.visibility = 'hidden';
	outer.style.overflow = 'scroll';
	outer.style.msOverflowStyle = 'scrollbar';
	document.body.appendChild(outer);
	const inner = document.createElement('div');
	outer.appendChild(inner);

	const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

	outer.parentNode.removeChild(outer);

	document.body.style.paddingRight = scrollbarWidth + 'px';
	document.body.classList.add('disabled');

	window.addEventListener('load', function () {
		document.getElementById('preloader').classList.add('hide');
		document.body.style.paddingRight = '';
		document.body.classList.remove('disabled');
	});
}