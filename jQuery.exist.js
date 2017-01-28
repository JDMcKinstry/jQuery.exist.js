if (window.hasOwnProperty('jQuery')) {
		;(function($) {
		function exists($ele) { return $ele instanceof jQuery && !!$ele.length; }
		if (!$.exist) {
			$.extend({
				exist: function() {
					var args = Array.prototype.slice.call(arguments);
					//	args(1) = selector
					//	args(2) = selector, method
					//	args(2+) = arrays [sel, meth, meth]
					//	args(2+) = objectss { selector: '', success: meth, fail: meth }
					//	args(3) = selector, method, method
					//	args(3) = selector, method, bool (wether to make sure ALL in selector exist or not)
					
					if (args.length == 1) {	//	args(1) = selector
						var a = args[0];
						if (typeof a == 'string' || a instanceof jQuery) return exists( typeof a == 'string' ? $(a) : a );
					}
					
					if (args.length == 2) {
						var a = $.map(args, function(val) { return typeof val; }).toString();
						
						//	args(2) = selector, method || method, selector
						if (/^(string,function)|(function,string)$/.test(a)) {
							//	make string a jQuery Object
							typeof args[0] == 'string' ? args[0] = $(args[0]) : args[1] = $(args[1]);
							//	remap
							a = $.map(args, function(val) { return typeof val; }).toString();
						}
						
						//	args(2) = $(selector), method || method, $(selector)
						if ((/^(object,function)$/.test(a) && args[0] instanceof jQuery) || (/^(function,object)$/.test(a) && args[1] instanceof jQuery)) {
							var sel = typeof args[0] == 'object' ? args[0] = $(args[0]) : args[1] = $(args[1]),
								cb = sel != args[0] ? args[0] : args[1];
							if (exists(sel)) {
								var arrSel = sel.selector.split(',').map(function(v) { return $.trim(v); });
								//	file through each possible selector and apply cb to each individually
								for (var i=0;i<arrSel.length;i++) if (exists($(arrSel[i]))) cb.apply($(arrSel[i]));
							}
							return sel;
						}
					}
					
					if (args.length == 3) {
						var a = $.map(args, function(val) { return typeof val; }).toString();
						
						//	args(3) = selector, method, method	//	2nd method will always be FAIL callback
						if (a && /^st\w+,fu\w+,fu\w+|fu\w+,st\w+,fu\w+|fu\w+,fu\w+,st\w+$/.test(a)) {
							typeof args[0] == 'string' ? args[0] = $(args[0]) : typeof args[1] == 'string' ? args[1] = $(args[1]) : args[2] = $(args[2]);
							//	remap
							a = $.map(args, function(val) { return typeof val; }).toString();
						}
						
						//	args(3) = $(selector), method, method	//	2nd method will always be FAIL callback
						if (a && /^ob\w+,fu\w+,fu\w+|fu\w+,ob\w+,fu\w+|fu\w+,fu\w+,ob\w+$/.test(a)) {
							var sel = typeof args[0] == 'object' ? args[0] = $(args[0]) : typeof args[1] == 'object' ? args[1] = $(args[1]) : args[2] = $(args[2]),
								arrSel = sel.selector.split(',').map(function(v) { return $.trim(v); }),
								cb = sel != args[0] ? args[0] : sel != args[1] ? args[1] : args[2],
								cbFail = cb != args[2] && typeof args[2] == 'function' ? args[2] : cb != args[1] && typeof args[1] == 'function' ? args[1] : args[0];
							for (var i=0;i<arrSel.length;i++) {
								if (exists($(arrSel[i]))) cb.apply($(arrSel[i]));
								else cbFail.apply(arrSel[i]);
							}
							return sel;
						}
						
						//	args(3) = selector, method, boolean	//	BOOL = if call back ALL at once, or individual
						if (a && /^bo\w+,(fu\w+,st\w+|st\w+,fu\w+)|fu\w+,(bo\w+,st\w+|st\w+,bo\w+)|st\w+,(bo\w+,fu\w+|fu\w+,bo\w+)$/.test(a)) {
							typeof args[0] == 'string' ? args[0] = $(args[0]) : typeof args[1] == 'string' ? args[1] = $(args[1]) : args[2] = $(args[2]);
							//	remap
							a = $.map(args, function(val) { return typeof val; }).toString();
						}
						//	args(3) = $(selector), method, boolean	//	BOOL = if call back ALL at once, or individual
						if (a && /^bo\w+,(fu\w+,ob\w+|ob\w+,fu\w+)|fu\w+,(bo\w+,ob\w+|ob\w+,bo\w+)|ob\w+,(bo\w+,fu\w+|fu\w+,bo\w+)$/.test(a)) {
							var sel = typeof args[0] == 'object' ? args[0] = $(args[0]) : typeof args[1] == 'object' ? args[1] = $(args[1]) : args[2] = $(args[2]),
								cb = sel != args[0] ? args[0] : sel != args[1] ? args[1] : args[2],
								atOnce = cb != args[2] && typeof args[2] == 'boolean' ? args[2] : cb != args[1] && typeof args[1] == 'boolean' ? args[1] : args[0];
							if (exists(sel)) atOnce ? cb.apply(sel) : $.exist(sel, cb);
							else if (atOnce) cbFail.apply(sel.selector);
							return sel;
						}
					}
					
					if (args.length == 4) {
						var a = $.map(args, function(val) { return typeof val; }).toString(),
							r = RegExp(/^bo\w+,(fu\w+,fu\w+,st\w+)|bo\w+,(fu\w+,st\w+,fu\w+)|bo\w+,(st\w+,fu\w+,fu\w+)|fu\w+,(bo\w+,fu\w+,st\w+)|fu\w+,(bo\w+,st\w+,fu\w+)|fu\w+,(fu\w+,bo\w+,st\w+)|fu\w+,(fu\w+,st\w+,bo\w+)|fu\w+,(st\w+,bo\w+,fu\w+)|fu\w+,(st\w+,fu\w+,bo\w+)|st\w+,(bo\w+,fu\w+,fu\w+)|st\w+,(fu\w+,bo\w+,fu\w+)|st\w+,(fu\w+,fu\w+,bo\w+)$/);
						//	args(4) = selector, method, method, boolean	//	BOOL = if call back ALL at once, or individual
						if (a && r.test(a)) {
							typeof args[0] == 'string' ? args[0] = $(args[0]) : typeof args[1] == 'string' ? args[1] = $(args[1]) : typeof args[2] == 'string' ? args[2] = $(args[2]) : args[3] = $(args[3]);
							//	remap
							a = $.map(args, function(val) { return typeof val; }).toString();
						}
						//	args(4) = $(selector), method, method, boolean	//	BOOL = if call back ALL at once, or individual
						r = RegExp(r.toString().substr(1, r.toString().length-2).replace(/st/g, 'ob'));
						if (a && r.test(a)) {
							var sel = typeof args[0] == 'object' ? args[0] = $(args[0]) : typeof args[1] == 'object' ? args[1] = $(args[1]) : typeof args[2] == 'object' ? args[2] = $(args[2]) : args[3] = $(args[3]),
								cb = typeof args[0] == 'function' ? args[0] : typeof args[1] == 'function' ? args[1] : args[2],
								cbFail = typeof args[3] == 'function' ? args[3] : typeof args[2] == 'function' ? args[2] : args[1],
								atOnce = typeof args[3] == 'boolean' ? args[3] : typeof args[2] == 'boolean' ? args[2] : typeof args[1] == 'boolean' ? args[1] : args[0];
							if (exists(sel)) atOnce ? cb.apply(sel) : $.exist(sel, cb, cbFail);
							else if (atOnce) cbFail.apply(sel.selector);
							return sel;
						}
					}
					
					var a = $.map(args, function(val) { return Object.prototype.toString.call(val).slice(8, -1); }).toString(),
						atOnce = args.indexOf(true) < 0;
					if (/array/i.test(a)) {
						return $.each(args, function(i, v) {
							if (v instanceof Array) $.exist.apply($, atOnce ? v : v.concat([true]));
						});
					}
					else if (/object/i.test(a)) {
						return $.each(args, function(i, v) {
							if (v instanceof Object) {
								v = $.map(v, function(val, key) { return val; });
								if (v instanceof Array) $.exist.apply($, atOnce ? v : v.concat([true]));
							}
						});
					}
					
					return null;
				}
			});
			$.fn.extend({
				exist: function() {
					var args = [$(this)];
					if (arguments.length) for (x in arguments) args.push(arguments[x]);
					return $.exist.apply($, args);
				}
			});
		}
	})(jQuery);
}
