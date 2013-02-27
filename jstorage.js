/**
 *
 * jStorage - https://github.com/martinkr/jStorage
 *
 * jStorage provides an convenient API for storing values.
 * Use the same API for storing your data in localStorage, sessionStorage,
 * cookies (bonus: cookies as localStorage/sessionStorage fallback!) and jQuery.data.
 *
 * @TODO API:clear()
 * @TODO STORAGEEVENTS!?
 *
 * @Version: 1.1b
 *
 * @example:
 *  Create,update:
 *    jQuery.storage.setItem('key','value','localStorage|sessionStorage|cookie|data');
 *  Delete:
 *    jQuery.storage.removeItem('key','localStorage|sessionStorage|cookie|data');
 *  Read:
 *    jQuery.storage.getItem('cookie','localStorage|sessionStorage|cookie|data');
 *  Length (returns the number of key/value pairs for this specific type):
 *    jQuery.storage.lenght('cookie');
 *
 * Convenient: If you skip the last "type" parameter, jStorage automatically uses the last type you used to store your data with.
 *
 * Copyright (c) 2011 Martin Krause (jquery.public.mkrause.info)
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Martin Krause public@mkrause.info
 * @copyright Martin Krause (jquery.public.mkrause.info)
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 * @license GNU http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @requires
 *  jQuery JavaScript Library - http://jquery.com/
 *    Copyright 2010, John Resig
 *    Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license
 *  jCookie - a jQuery-Plugin providing an convenient api for CRUD-related cookie handling
 *    Copyright 2008-2011, Martin Krause
 *    Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license
 *
 */

// JSLint setting, @see http://www.jslint.com/lint.html#options
/*jslint devel: false, browser: true, continue: true, eqeq: true, vars: true, evil: true, white: true, forin: true, css: true, cap: true, nomen: true, plusplus: true, maxerr: 500, indent: 4 */

(function($) {
	$.storage = function() {

		// private vars
		// set the storage status. decide which types are available and set appropriate fallbacks
		var _oStatus = {
			localStorage: ('localStorage' in window && window.localStorage !== null) ? 'localStorage' : 'cookie',
			sessionStorage: ('sessionStorage' in window && window.sessionStorage !== null) ? 'sessionStorage' : 'cookie',
			cookie: 'cookie',
			data: 'data',
			status: 'status',
			options: 'options'
		};

		// set defaults
		var _oDefaults = {
			sType: 'data'
		};

		/**
		 * Initializes the storage functionality.
		 * @private
		 * @return {Void}
		 */
		var _initialize = function() {

				// notify if we're missing necessary APIs
				if (!jQuery.jCookie) {
					throw new Error('[jQuery.storage] missing jQuery.jCookie. Get jcookie.min.js from https://github.com/martinkr/jCookie/');
				}

				// some legacy user agents (point the finger at IE6 / 7) doesn't provide a native JSON API
				if (!JSON) {
					throw new Error('[jQuery.storage] missing JSON parser. Get json2.js from https://github.com/douglascrockford/JSON-js and / or visit json.org ');
				}

			}();

		/**
		 * Normalizes the object passed to the API functions
		 * @param {Object} oOptions_ raw options object as passed to the public API functions
		 * @param {Boole} bWrite_ distinguish between read and write normalization
		 * @return {Object} normalized options
		 */
		var _normalizeOptions = function(oOptions_, bWrite_) {

				// handle crazy users ;)
				if (typeof(oOptions_) == 'object' && !oOptions_.type) {
					oOptions_.type = _oDefaults.sType;
				}

				// handle String AND object
				var _sType = typeof(oOptions_) == 'string' ? oOptions_ : oOptions_.type;

				// rewrite localStorage / sessionStorage if the user agent
				if (_sType.indexOf('Storage') !== -1 && _oStatus[_sType] == 'cookie') {
					// use sessioncookie for sessionStorage and a long-living for localStorage
					oOptions_.expires = (_sType == 'sessionStorage') ? 'session' : 365;
				}

				// in case of a writing operation: store the current type as default (in case: no type is supplied)
				if (bWrite_) {
					_oDefaults.sType = _oStatus[_sType];
				}


				return {
					sType: _oStatus[_sType],
					sName: oOptions_.name || null,
					expires: oOptions_.expires || 'session',
					secure: oOptions_.secure ? true : false,
					path: oOptions_.path || false,
					domain: oOptions_.domain || false
				};
			};

		/**
		 * Reads the stored values
		 * @private
		 * @param {String} sKey_, Identifier to grab
		 * @param {String || Object}, String: indicates the type ( 'localStorage','sessionStorage','cookie','data')
		 * Object {
				type: {String}, 'localStorage','sessionStorage','cookie','data',
				expires: {String || Number}, ['session' || days], (cookie)
				secure: {BOOL}, [false], (cookie)
				path: {String}, [''], (cookie)
				domain: {String}, [''],(cookie)
			 }
		 * @return {Value}
		 */
		var _read = function(sKey_, oOptions_) {

				var _oOpts = _normalizeOptions(oOptions_);
				var _sType = _oOpts.sType;

				switch (_sType) {
					// deprecated
				case 'options':
					return _oDefaults[sKey_];


				case 'status':
					return _oStatus[sKey_];

				case 'data':
					if (jQuery(window).data('jStorage') === undefined) {
						return undefined;
					}
					return jQuery(window).data('jStorage')[sKey_];

				case 'cookie':
					// forcing jQuery.jCookie on initializing
					// if(!jQuery.jCookie) {
					// window.setTimeout( function () { jQuery.storage.getItem(sKey_,oOptions_)} , 100 );
					// } else {
					sKey_ = ['jStorage_',sKey_].join('');
					var _return = jQuery.jCookie(sKey_);
					// can't parse undefined
					if (_return) {
						return JSON.parse(jQuery.jCookie(sKey_));
					} else {
						return _return;
					}
					// }
				case 'sessionStorage':
				case 'localStorage':
					return window[_sType].getItem(sKey_);

				}

				return undefined;
			};

		/**
		 * Writes a value
		 * @private
		 * @param {String} sKey_, Identifier to grab
		 * @param {Object} sValue_, Value to store
		 * @param {String || Object}, String: indicates the type ( 'localStorage','sessionStorage','cookie','data')
		 * Object
			{
				type: {String}, 'localStorage','sessionStorage','cookie','data',
				expires: {String || Number}, ['session' || days], (cookie)
				secure: {BOOL}, [false], (cookie)
				path: {String}, [''], (cookie)
				domain: {String}, [''],(cookie)
			 }
		 * @return {Bool}
		 */
		var _write = function(sKey_, sValue_, oOptions_) {
				// we're actually writing not deleting
				var _bWrite = (sValue_ === null) ? false : true;
				// if no options are present, use the default writing type
				var _oOpts = _normalizeOptions(oOptions_ || {
					type: _oDefaults.sType
				}, _bWrite);
				var _sType = _oOpts.sType;

				switch (_sType) {
					//deprecated
					// case 'options' :
					// _oDefaults[sKey_] = sValue_;
					// return true;
					// break;
				case 'data':
					var _oData = jQuery(window).data('jStorage') || {};
					if (sValue_ === null) {
						return delete(_oData[sKey_]);
					}

					_oData[sKey_] = sValue_;
					jQuery(window).data('jStorage', _oData);
					return true;


				case 'cookie':
					// forcing jQuery.jCookie on initializing
					// if(!jQuery.jCookie) {
					// window.setTimeout( function () { jQuery.storage.setItem(sKey_,sValue_,oOptions_)} , 100 );
					// } else {
					sKey_ = ['jStorage_',sKey_].join('');
					if (sValue_ === null) {
						jQuery.jCookie(sKey_, null);
						return true;
					}
					jQuery.jCookie(sKey_, JSON.stringify(sValue_), _oOpts.expires, _oOpts);
					// }
					return true;


				case 'sessionStorage':
				case 'localStorage':
					if (sValue_ === null) {
						window[_sType].removeItem(sKey_);
						return true;
					}
					window[_sType].setItem(sKey_, sValue_);

					return true;

				}
				return false;
			};

			/**
			 * Returns the number of key-value pairs currently present.
			 * Pass the 'sType_' to distinguish between the different storages
			 * @private
			 * @param {String || Object}, String: indicates the type ( 'localStorage','sessionStorage','cookie','data')
			 * Object
				{
					type: {String}, 'localStorage','sessionStorage','cookie','data'
				 }
			 * @return {Bool}
			 */
			var _length = function( oOptions_) {

				// if no options are present, use the default writing type
				var _oOpts = _normalizeOptions(oOptions_ || {
					type: _oDefaults.sType
				}, false);
				var _sType = _oOpts.sType;
				var _iLength = 0;
				var _sKey, _oData;

				switch (_sType) {

					case 'data':
						_oData = jQuery(window).data('jStorage') || {};
						for(_sKey in _oData) { _iLength++; }
					break;

					case 'cookie':
						_aData = document.cookie.split(';')|| {};
						var _n = _aData.length;
						while(_n--) {if(_aData[_n].indexOf('jStorage_') !== -1 ) {_iLength++;}}
					break;

					case 'sessionStorage':
					case 'localStorage':
						_iLength = window[_sType].length;
					break;
				}
  				return _iLength;
			};

		/**
		 * Public API
		 */
		return {


			/**
			 * API: Reads the stored values
			 * @param {String} sKey_, Identifier to grab
			 * @param {Object} oOptions_, additional options (expires: session)
			 * @param {String} [sType_], storage to read from. Default: last written
			 * @return {Value}
			 */
			getItem: function(sKey_, sType_) {
				return _read(sKey_, sType_);
			},

			/**
			 * API: Writes a value
			 * @param {String} sKey_, Identifier to grab
			 * @param {Object} sValue_, Value to store
			 * @param {Object|String} oOptions_|sType_, additional options (expires: session) or sType_
			 * @return {Void}
			 */
			setItem: function(sKey_, sValue_, oOptions_) {
				_write(sKey_, sValue_, oOptions_);
			},

			/**
			 * API: Deletes a value
			 * @param {String} sKey_, Identifier to delete
			 * @param {Object|String} oOptions_|sType_, or sType_
			 * @return {Void}
			 */
			removeItem: function(sKey_, oOptions_) {
				_write(sKey_, null, oOptions_);
			},

			/**
			 * API: Returns the number of key-value pairs currently present
			 * @param {Object|String} oOptions_|sType_, or sType_
			 * @return {Number}
			 */
			length: function(oOptions_) {
				return _length(oOptions_);
			}
		};

	}();
})(jQuery);