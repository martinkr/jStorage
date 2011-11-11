/**
 * @projectDescription
 *
 * jStorage provides an convenient api for CRUD-related storage tasks
 * An unique API for storing values, weather it will be localStorage / sessionStorage / cookie / s.data or custom DOM-Storage
 *
 * Version: 0.2
 *
 * TODO:
 * implement cookie
 * implement $.data
 * implement DOM-Storage
 *
 * @example:
 *  Create,update:
 *  jQuery.storage.setItem('cookie','value');
 *  Delete:
 *  jQuery.storage.removeItem('cookie',null);
 *  Read:
 *  jQuery.storage.getItem('cookie');
 *
 * Copyright (c) 2011 Martin Krause (jquery.public.mkrause.info)
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Martin Krause public@mkrause.info
 * @copyright Martin Krause (jquery.public.mkrause.info)
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 * @license GNU http://www.gnu.org/licenses/gpl-3.0.html
 *
 */
(function($) {
$.storage = function () {

	//"private" variables:
	var _hasStorage = 'localStorage' in window && window['localStorage'] !== null;

	var _normalizeArguments = function () {
		/*
		console.log(arguments)
		// enfoce params, even if just an object has been passed
		var oOptions_ = oOptions_ || {};
		if (typeof(arguments[0][0]) !== 'string' && arguments[0].length === 1) {
			oOptions_ = arguments[0];
			sCookieName_ = oOptions_.name;
			oValue_ = oOptions_.value;
			oExpires_ = oOptions_.expires;
		}
		return oOptions_;
		*/
	}

	/**
	 * Reads the stored values
	 * @private
	 * @param {String} sKey_, Identifier to grab
	 * @param {Object} oOptions_, additional options (expires: session)
	 * @return {Value}
	 */
	var _read = function (sKey_,oOptions_) {
		var oOptions_ = oOptions_ || {expires: 'session'}
		var _sType = (oOptions_.expires == 'session') ?  'sessionStorage' : 'localStorage' ;
		return window[_sType].getItem(sKey_);
	}

	/**
	 * Writes a value
	 * @private
	 * @param {String} sKey_, Identifier to grab
	 * @param {Object} sValue_, Value to store
	 * @param {Object} oOptions_, additional options (expires: session)
	 * @return {Void}
	 */
	var _write = function (sKey_,sValue_,oOptions_) {
		var oOptions_ = oOptions_ || {expires: 'session'}
		var _sType = (oOptions_.expires == 'session') ?  'sessionStorage' : 'localStorage' ;
		if(sValue_ == null) {
			window[_sType].removeItem(sKey_);
			return;
		}
		window[_sType].setItem(sKey_,sValue_);
		return;
	}

	/**
	 * Publich API
	 */
	return  {
		/**
		 * Reads the stored values
		 * @param {String} sKey_, Identifier to grab
		 * @param {Object} oOptions_, additional options (expires: session)
		 * @return {Value}
		 */
 		getItem:function (sKey_) {
			return _read(sKey_);
		},

		/**
		 * Writes a value
		 * @private
		 * @param {String} sKey_, Identifier to grab
		 * @param {Object} sValue_, Value to store
		 * @param {Object} oOptions_, additional options (expires: session)
		 * @return {Void}
		 */
		setItem: function (sKey_,sValue_,bCookie_) {
			_write(sKey_,sValue_);
		},

		/**
		 * Deletes a value
		 * @param {String} sKey_, Identifier to delete
		 * @return {Void}
		 */
		removeItem: function(sKey_) {
			_write(sKey_,null);
		}
	};

}();
 })(jQuery);