function ChildBrowser() {}

if ($ua.iP()) {
    // Callback when the location of the page changes
    // called from native
    ChildBrowser.prototype._onLocationChange = function(newLoc) {
        window.plugins.childBrowser.onLocationChange(newLoc);
    };

    // Callback when the user chooses the 'Done' button
    // called from native
    ChildBrowser.prototype._onClose = function() {
        window.plugins.childBrowser.onClose();
    };

    // Callback when the user chooses the 'open in Safari' button
    // called from native
    ChildBrowser.prototype._onOpenExternal = function() {
        window.plugins.childBrowser.onOpenExternal();
    };

    // Pages loaded into the ChildBrowser can execute callback scripts, so be careful to
    // check location, and make sure it is a location you trust.
    // Warning ... don't exec arbitrary code, it's risky and could fuck up your app.
    // called from native
    ChildBrowser.prototype._onJSCallback = function(js,loc) {
        //Not Implemented
        //window.plugins.childBrowser.onJSCallback(js,loc);
    };

    /* The interface that you will use to access functionality */

    // Show a webpage, will result in a callback to onLocationChange
    ChildBrowser.prototype.showWebPage = function(loc) {
        cordova.exec(null, null, "ChildBrowserCommand", "showWebPage", loc);
    };

    // close the browser, will NOT result in close callback
    ChildBrowser.prototype.close = function() {
        cordova.exec(null, null, "ChildBrowserCommand", "close", null);
    };

    ChildBrowser.prototype.jsExec = function(jsString) {
        // Not Implemented!!
        //cordova.exec("ChildBrowserCommand.jsExec",jsString);
    };

}

if ($ua.droid()) {
    ChildBrowser.CLOSE_EVENT = 0;
    ChildBrowser.LOCATION_CHANGED_EVENT = 1;

    ChildBrowser.prototype.showWebPage = function(url, options) {
       if (options === null || options === "undefined") {
            options = options || {};
            options.showLocationBar = true;
            options.locationBarAlign = "top";
        }
        cordova.exec(this._onEvent, this._onError, "ChildBrowser", "showWebPage",
            [url, options]);
    };
    /**
     * Close the browser opened by showWebPage.
     */
    ChildBrowser.prototype.close = function() {
        cordova.exec(null, null, "ChildBrowser", "close", []);
    };

    /**
     * Display a new browser with the specified URL.
     * This method starts a new web browser activity.
     *
     * @param url           The url to load
     * @param usecordova   Load url in cordova webview [optional]
     */
    ChildBrowser.prototype.openExternal = function(url, usecordova) {
        if (usecordova === true)
            navigator.app.loadUrl(url);
        else
            cordova.exec(null, null, "ChildBrowser", "openExternal",
                [url, usecordova]);
    };

    /**
     * Method called when the child browser has an event.
     */
    ChildBrowser.prototype._onEvent = function(data) {
        if (data.type == ChildBrowser.CLOSE_EVENT && typeof window.plugins.childBrowser.onClose === "function") {
            window.plugins.childBrowser.onClose();
        }
        if (data.type == ChildBrowser.LOCATION_CHANGED_EVENT && typeof window.plugins.childBrowser.onLocationChange === "function") {
            window.plugins.childBrowser.onLocationChange(data.location);
        }
    };

/**
 * Method called when the child browser has an error.
 */
    ChildBrowser.prototype._onError = function(data) {
        if (typeof window.plugins.childBrowser.onError === "function") {
            window.plugins.childBrowser.onError(data);
        }
    };
}

ChildBrowser.prototype.install = function() {
	if (!window.plugins)
        	window.plugins = {};

    window.plugins.childBrowser = new ChildBrowser();
};

module.exports = new ChildBrowser();
