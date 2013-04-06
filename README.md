Router - Simple javascript routing system
==

Example
--

Adding route and parsing:

    var router = new Router();
    router.addRoute('default', '/{controller}/{action}?{search}', function(o){ JSON.stringify(o)); });
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

