Router - Simple javascript routing system
==

Example
--

Adding route and parsing:

    var router = new Router();
    router.addRoute('default', '/{controller}/{action}?{search}', function(o){ console.log(JSON.stringify(o)); });
    router.parse('/home/index?me=kaxa&shen=arvici');
    
Output:

    { 
        "controller":"home", 
        "action":"index", 
        "search":"me=kaxa&shen=arvici" 
    }
    
Optional rooting parts:

    router.addRoute('optional', '/{controller}/{action}[?{search}]', function(o){ JSON.stringify(o)); });

Suceeds in both cases: `'/home/index?me=kaxa&shen=arvici'` and `'/home/index'`

In case if bypassed all routes:

    var router = new Router({
        bypassedCallback: function(){
            console.log('Bypassed all routes');
        }
    });

--

Default options
=

    searchVariableName: 'search',
    leftClosure: '{',
    rightClosure: '}',
    optionalLeftClosure: '[',
    optionalRightClosure: ']',
    bypassedCallback: function () { console.log('bypassed all rootes'); }
    
--

**TODOs**:

1. Add functionality to option- `searchVariableName` (converts search part of url into object)
2. Enable closures with multiple symbols

