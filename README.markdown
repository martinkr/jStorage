<a name="README">[jStorage](https://github.com/martinkr/jStorage)</a>
=======
**jStorage provides an convenient API for storing values.
Use the same API for storing your data in localStorage, sessionStorage, cookies (bonus: cookies as localStorage/sessionStorage fallback!) and jQuery.data.**

## Example
* Create & Update: _jQuery.storage.setItem('key','value','localStorage|sessionStorage|cookie|data');_
* Delete: _jQuery.storeage.removeItem('key','localStorage|sessionStorage|cookie|data');_
* Read: _jQuery.storeage.getItem('key','localStorage|sessionStorage|cookie|data');_
* Length (returns the number of key/value pairs for this specific type): _jQuery.storage.lenght('localStorage|sessionStorage|cookie|data');_

Convenient: If you skip the last "type" parameter, jStorage automatically uses the last type you used to store your data with.

## Requires
 * jQuery JavaScript Library - http://jquery.com/; Copyright 2010, John Resig; Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license
 * jCookie JavaScript Library - http://jquery.com/; Copyright 2008-2011, Martin Krause; Dual licensed under the MIT or GPL Version 2 licenses

## License
Dual licensed under the MIT and GPL licenses.

* MIT - http://www.opensource.org/licenses/mit-license.php
* GNU - http://www.gnu.org/licenses/gpl-3.0.html

Copyright (c) 2010-2012 Martin Krause (jquery.public.mkrause.info)
