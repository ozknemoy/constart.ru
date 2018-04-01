/**
 * Created by ozknemoy on 12.01.2017.
 */
var express = require('express');
var app     = module.exports = express();

var bigSeo = require('bigseo')();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('/'));
app.set('views', './dev');
// Your application config
app.use(bigSeo.run());
app.set('view options', {
    layout: false
});
app.use(express.bodyParser());
//app.use(express.methodOverride());

// Your application routes
/*app.configure(function(){
    //app.set('view engine', 'jade');
    app.set('view options', {
        layout: false
    });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});*/

/*app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});*/

app.get('/', function(req, res) {
    res.render('./index');
});

app.get('/project/:id/:num/about?_escaped_fragment_', function (req, res) {
    console.log("req",req);

    var id = req.params.id;
    res.render('app/404/404.html');
});

app.get('*', function(req, res) {
    res.render('./index');
});

app.listen(8000, function(){
    console.log("Express server listening on port 8000");
});










