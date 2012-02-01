/**
 * @projectDescription
 *
 * Spec for:
 *  jStorage - https://github.com/martinkr/jStorage
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
 *
 *  Jasmine A JavaScript Testing Framework - https://github.com/pivotal/jasmine
 *    Copyright (c) 2008-2011 Pivotal Labs
 *    Licensed under the MIT license - https://github.com/pivotal/jasmine/MIT.LICENSE
 */


describe('jstorage ', function() {

  var _sKey = "FOO";
  var _sValue = "BAR";
  var counter = 0;

  beforeEach(function() {
    _sKey = "FOO";
    _sValue = "BAR";
  });

  afterEach(function() {
    jQuery.storage.removeItem(_sKey, 'data');
    jQuery.storage.removeItem(_sKey, 'cookie');
    jQuery.storage.removeItem(_sValue, 'cookie');
    jQuery.storage.removeItem(_sKey, 'localStorage');
    jQuery.storage.removeItem(_sKey, 'sessionStorage');
  });

  // options
  // it('can set and get plugins options', function () {
  //   jQuery.storage.setItem(_sKey,_sValue,'options');
  //   expect(jQuery.storage.getItem(_sKey,{type:'options'})).toEqual(_sValue)
  // });
  // status
  it('can display the current status', function() {
    expect(jQuery.storage.getItem('cookie', 'status')).toEqual('cookie');
  });

  /**
   * $.data
   */

  // $.data
  it('can write a value using $.data', function() {
    jQuery.storage.setItem(_sKey, _sValue, 'data');
    expect(jQuery(window).data('jStorage')[_sKey]).toEqual(_sValue);
  });

  it('can read a value using $.data', function() {
    // // read
    jQuery.storage.setItem(_sKey, _sValue, 'data');
    expect(jQuery.storage.getItem(_sKey, 'data')).toEqual(_sValue);
  });

  it('can update a value using $.data', function() {
    // update
    jQuery.storage.setItem(_sValue, _sKey, {
      type: 'data'
    });
    // direct
    expect(jQuery(window).data('jStorage')[_sValue]).toEqual(_sKey);
    // data
    expect(jQuery.storage.getItem(_sValue, 'data')).toEqual(_sKey);
  });

  it('can delete a value using $.data', function() {
    // delete
    // direct
    jQuery.storage.setItem(_sKey, null, 'data');
    expect(jQuery(window).data('jStorage')[_sKey]).toEqual(undefined);

    // API
    jQuery.storage.removeItem(_sKey, 'data');
    expect(jQuery(window).data('jStorage')[_sKey]).toEqual(undefined);

  });

  it('can write using the last TYPE', function() {
    jQuery.storage.setItem(_sKey, _sValue, 'cookie');
    jQuery.storage.setItem(_sKey, _sValue, 'data');
    jQuery.storage.removeItem(_sKey, 'data');
    jQuery.storage.removeItem(_sKey, 'cookie');

    jQuery.storage.setItem(_sKey, _sValue);

    //still data, deleting cookie should not switch writing type
    expect(jQuery.storage.getItem('sType', 'options')).toEqual('data');
    expect(jQuery(window).data('jStorage')[_sKey]).toEqual(_sValue);

    jQuery.storage.setItem(_sKey, _sValue, 'cookie');
    jQuery.storage.setItem(_sValue, _sKey + '2');
    // cookie
    expect(jQuery.storage.getItem('sType', 'options')).toEqual('cookie');
    expect(document.cookie).toContain(_sKey + '2');
  });

  /**
   * cookie
   */

  // session cookie
  it('can write a session cookie using jCookie', function() {
    jQuery.storage.setItem(_sKey, _sValue, 'cookie');
    expect(document.cookie).toContain(_sValue);
  });

  it('can read a session cookie using jCookie', function() {
    jQuery.storage.setItem(_sKey, _sValue, 'cookie');
    expect(jQuery.storage.getItem(_sKey, 'cookie')).toEqual(_sValue);
  });

  it('can delete a session cookie using jCookie', function() {
    jQuery.storage.removeItem(_sKey, 'cookie');
    expect(jQuery.storage.getItem(_sKey, 'cookie')).toEqual(undefined);

  });

  // persistent cookie, + 365 days with multiple options
  it('can write a persistent cookie (+365 days) using jCookie', function() {
    _sKey = _sKey + "365";
    _sValue = _sValue + "365";
    jQuery.storage.setItem(_sKey, _sValue, {
      type: 'cookie',
      expires: 365
    });
    expect(document.cookie).toContain(_sValue);
  });

  it('can read a persistent cookie (+365 days) using jCookie', function() {
    _sKey = _sKey + "365";
    _sValue = _sValue + "365";
    jQuery.storage.setItem(_sKey, _sValue, {
      type: 'cookie',
      expires: 365
    });
    expect(jQuery.storage.getItem(_sKey, 'cookie')).toEqual(_sValue);
  });

  it('can delete a persistent cookie (+365 days) using jCookie', function() {
    jQuery.storage.removeItem(_sKey, 'cookie');
    expect(jQuery.storage.getItem(_sKey, 'cookie')).toEqual(undefined);

  });

  // different contents
  it('can write/read a number to a cookie using jCookie', function() {
    _sKey = 'FOO';
    _sValue = 100;
    jQuery.storage.setItem(_sKey, _sValue, {
      type: 'cookie'
    });
    expect(document.cookie).toContain(_sValue);
    expect(parseInt(jQuery.storage.getItem(_sKey, 'cookie'))).toEqual(parseInt(_sValue));
  });

  // different contents
  it('can write/read a boolean to a cookie using jCookie', function() {
    _sKey = 'FOO';
    _sValue = true;
    jQuery.storage.setItem(_sKey, _sValue, {
      type: 'cookie'
    });
    expect(document.cookie).toContain(_sValue);
    expect(jQuery.storage.getItem(_sKey, 'cookie')).toBeTruthy();
    _sValue = false;
    jQuery.storage.setItem(_sKey, _sValue, {
      type: 'cookie'
    });
    expect(document.cookie).toContain(_sValue);
    expect(jQuery.storage.getItem(_sKey, 'cookie')).toBeFalsy();

  });

  // different contents
  it('can write/read an array to a cookie using jCookie', function() {
    _sKey = 'FOO';
    _sValue = ['STRING', 100,
    {
      key: 'value'
    },
    true];
    jQuery.storage.setItem(_sKey, _sValue, {
      type: 'cookie'
    });
    expect(document.cookie).toContain('STRING');

    var _content = jQuery.storage.getItem(_sKey, 'cookie');
    expect(_content[0]).toEqual(_sValue[0]);
    expect(_content[1]).toEqual(_sValue[1]);
    expect(_content[2]).toEqual(_sValue[2]);
    expect(_content[2].key).toEqual(_sValue[2].key);
    expect(_content[3]).toEqual(_sValue[3]);

  });

  // different contents
  it('can write/read an object to a cookie using jCookie', function() {
    _sKey = 'FOO';
    _sValue = {
      'STRING': 'STRING',
      'ARRAY': [0, 1, 2, 3],
      'OBJECT': {
        'key': 'value'
      },
      'BOOLEANTRUE': true,
      'BOOLEANFALSE': false
    };
    jQuery.storage.setItem(_sKey, _sValue, {
      type: 'cookie'
    });

    expect(document.cookie).toContain('STRING');

    var _content = jQuery.storage.getItem(_sKey, 'cookie');

    expect(_content.STRING).toEqual(_sValue.STRING);
    expect(_content.ARRAY).toEqual(_sValue.ARRAY);
    expect(_content.ARRAY[1]).toEqual(_sValue.ARRAY[1]);
    expect(_content.OBJECT).toEqual(_sValue.OBJECT);
    expect(_content.OBJECT.key).toEqual(_sValue.OBJECT.key);
    expect(_content.BOOLEANTRUE).toBeTruthy();
    expect(_content.BOOLEANFALSE).toBeFalsy();

  });

  /**
   * localstorage
   */

  it('can write to localStorage using jCookie as fallback', function() {
    _sKey = 'FOO';
    _sValue = "BAR";
    jQuery.storage.setItem(_sKey, _sValue, {
      type: 'localStorage'
    });

    if ('localStorage' in window && window['localStorage'] === null) {
      expect(jQuery.storage.getItem('localStorage', 'status')).toEqual('cookie');
      expect(document.cookie).toContain(_sValue);
    } else {
      expect(jQuery.storage.getItem('localStorage', 'status')).toEqual('localStorage');
      expect(window.localStorage[_sKey]).toEqual(_sValue);
    }

  });

  it('can read from localStorage using jCookie as fallback', function() {
    _sKey = 'FOO';
    _sValue = "BAR";
    jQuery.storage.setItem(_sKey, _sValue, 'localStorage');
    expect(jQuery.storage.getItem(_sKey, 'localStorage')).toEqual(_sValue);

    if ('localStorage' in window && window['localStorage'] === null) {
      expect(jQuery.storage.getItem('localStorage', 'status')).toEqual('cookie');
      expect(document.cookie).toContain(_sValue);
    } else {
      expect(jQuery.storage.getItem('localStorage', 'status')).toEqual('localStorage');
      expect(jQuery.storage.getItem(_sKey, 'localStorage')).toEqual(_sValue);
    }

  });

  /**
   * sessionStorage
   */

  it('can write to sessionStorage using jCookie as fallback', function() {
    _sKey = 'FOO';
    _sValue = "BAR";
    jQuery.storage.setItem(_sKey, _sValue, {
      type: 'sessionStorage'
    });

    if ('sessionStorage' in window && window['sessionStorage'] === null) {
      expect(jQuery.storage.getItem('sessionStorage', 'status')).toEqual('cookie');
      expect(document.cookie).toContain(_sValue);
    } else {
      expect(jQuery.storage.getItem('sessionStorage', 'status')).toEqual('sessionStorage');
      expect(window.sessionStorage[_sKey]).toEqual(_sValue);
    }

  });

  it('can read from sessionStorage using jCookie as fallback', function() {
    _sKey = 'FOO';
    _sValue = "BAR";
    jQuery.storage.setItem(_sKey, _sValue, 'sessionStorage');
    expect(jQuery.storage.getItem(_sKey, 'sessionStorage')).toEqual(_sValue);

    if ('sessionStorage' in window && window['sessionStorage'] === null) {
      expect(jQuery.storage.getItem('sessionStorage', 'status')).toEqual('cookie');
      expect(document.cookie).toContain(_sValue);
    } else {
      expect(jQuery.storage.getItem('sessionStorage', 'status')).toEqual('sessionStorage');
      expect(jQuery.storage.getItem(_sKey, 'sessionStorage')).toEqual(_sValue);
    }

  });

  /**
   * length
   */
   // it('can return the number of key/value pairs currently present in the list using the last TYPE ',function () {
   //    expect(jQuery.storage.length.toEqual(0));
   // });

   it('can return the number of key/value pairs currently present in localStorage',function () {
      var  _sType = 'localStorage';
      expect(jQuery.storage.length(_sType)).toEqual(0);
      jQuery.storage.setItem(_sKey, _sValue, _sType);
      
      expect(jQuery.storage.length(_sType)).toEqual(1);
      jQuery.storage.removeItem(_sKey, _sType);
      
      expect(jQuery.storage.length(_sType)).toEqual(0);

      jQuery.storage.setItem(_sKey, _sValue, _sType);
      jQuery.storage.setItem(_sKey, _sValue, _sType);
      console.info(_sType, window.localStorage.length)
      expect(jQuery.storage.length(_sType)).toEqual(1);

      jQuery.storage.setItem(_sValue,_sKey, _sType);
      expect(jQuery.storage.length(_sType)).toEqual(2);
      
      jQuery.storage.removeItem(_sKey, _sType);
      jQuery.storage.removeItem(_sValue, _sType);

   });

   // it('can return the number of key/value pairs currently present in sessionStorage',function () {
   //    expect(jQuery.storage.length('sessionStorage').toEqual(0));
   // });
   
   // it('can return the number of key/value pairs currently present at the cookie',function () {
   //    expect(jQuery.storage.length('cookie').toEqual(0));
   // });

   // it('can return the number of key/value pairs currently present at the dom-storage',function () {
   //    expect(jQuery.storage.length('dom').toEqual(0));
   // });

});