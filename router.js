(function () {

    window.Router = function (options) {
        var self = this;
        self.options = _merge(self.defaultOptions, options || {});
        self.routes = [];
    }

    Router.prototype.parse = function (url) {
        var self = this;
        var routes = self.routes;
        var options = self.options;
        var olc = options.optionalLeftClosure;
        var orc = options.optionalRightClosure;
        var lc = options.leftClosure;
        var rc = options.rightClosure;
        var isMatch = false;

        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var optionalParts = _getOptionalParts(route.template, olc, orc);
            var unoptionalTemplate = route.template.split(olc).join('').split(orc).join('');
            var routesToParse = [unoptionalTemplate];

            for (var j = 0; j < optionalParts.length; j++) {
                routesToParse.push(unoptionalTemplate.replace(optionalParts[j], ''));
            };

            for (var j = 0; j < routesToParse.length; j++) {
                var routeToParse = routesToParse[j];
                var parsedRoute = _parse(url, routeToParse, lc, rc);
                if (parsedRoute) {
                    isMatch = true;
                    route.callback(parsedRoute, routeToParse);
                    break;
                }
            }
        }
        if (!isMatch)
            self.options.bypassedCallback();
    }

    Router.prototype.defaultOptions = {
        searchVariableName: 'search',
        leftClosure: '{',
        rightClosure: '}',
        optionalLeftClosure: '[',
        optionalRightClosure: ']',
        bypassedCallback: function () { console.log('bypassed all rootes'); }
    }

    Router.prototype.addRoute = function (name, template, callback) {
        var self = this;
        self.routes.push({
            name: name,
            template: template,
            callback: callback
        });
    }

    function _getOptionalParts(template, olc, orc) {
        var optionalParts = [];

        if (template.indexOf(olc) !== -1) {
            var insideClosures = false;
            var optionalPart = '';
            for (var i = 0; i < template.length; i++) {
                if (template[i] === olc)
                    insideClosures = true;
                else if (template[i] === orc) {
                    insideClosures = false;
                    optionalParts.push(optionalPart);
                    optionalPart = '';
                } else if (insideClosures)
                    optionalPart += template[i];
            }
        }
        return optionalParts;
    }

    function _parse(url, template, lc, rc) {
        var variables = {};
        var insideClosures = false;
        var variableName = '';
        var variableValue = '';

        for (var i = 0, j = 0; i < template.length; i++) {
            if (_isAny(template[i], [lc, rc])) {
                switch (template[i]) {
                    case lc:
                        insideClosures = true;
                        break;
                    case rc:
                        insideClosures = false;
                        var rightLimit = template.length > i + 1 ? template[i + 1] : '';
                        while (j < url.length) {
                            variableValue += url[j];
                            j++;
                            if (url.length === j || url[j] === rightLimit) {
                                variables[variableName] = variableValue;
                                variableName = variableValue = '';
                                break;
                            }
                        }
                        break;
                }
            } else if (!insideClosures) {
                if (template[i] !== url[j]) {
                    return false;
                } else {
                    j++;
                }
            } else if (insideClosures) {
                variableName += template[i];
            }
        }
        return variables;
    }

    function _isAny(a, bs) {
        for (var i = 0; i < bs.length; i++) {
            if (bs[i] === a)
                return true;
        }
        return false;
    }

    function _merge(a, b) {
        var copy = {};
        _extend(copy, a, [HTMLElement, Array]);
        _extend(copy, b, [HTMLElement, Array]);
        return copy;
    }

    function _extend(a, b, excludeInstances) {
        for (var prop in b)
            if (b.hasOwnProperty(prop)) {
                var isInstanceOfExcluded = false;
                if (excludeInstances)
                    for (var i = 0; i < excludeInstances.length; i++)
                        if (b[prop] instanceof excludeInstances[i])
                            isInstanceOfExcluded = true;

                if (typeof b[prop] === 'object' && !isInstanceOfExcluded) {
                    a[prop] = a[prop] !== undefined ? a[prop] : {};
                    _extend(a[prop], b[prop], excludeInstances);
                } else
                    a[prop] = b[prop];
            }
    }
} ());
