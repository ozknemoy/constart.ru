/**
 * Created by ozknemoy on 13.02.2017.
 */
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const baseUrl = path.join(__dirname,'');
app.set('port', port);
app.use(express.static(__dirname + '/production'));// для статики


/*app.get('_escaped_fragment_',(req,res)=> {
    console.log("_escaped_fragment_");///?_escaped_fragment_
    res.send('_escaped_fragment_'+ req)
});*/
// http://www.ng-newsletter.com/posts/serious-angular-seo.html
/*app.use(function(req, res, next) {
    var fragment = req.query._escaped_fragment_;

    if (!fragment) return next();

    if (fragment === "" || fragment === "/")
        fragment = "/index.html";

    if (fragment.charAt(0) !== "/")
        fragment = '/' + fragment;

    if (fragment.indexOf('.html') == -1)
        fragment += ".html";

    // Serve the static html snapshot
    try {
        var file = __dirname + "/view" + fragment;
        res.sendfile(file);
    } catch (err) {
        next()//res.send(404);
    }
});*/
/*
* /project/:id//:subpage
* /project/:id/:num/:subpage
* */
app.get('(/project/:id//:subpage|/project/:id/:num/:subpage)',(req,res)=> {
    console.log("/project",req.params.id,req.url);

    if(req.url.includes('_escaped_fragment_')) {
        const url = `view/project/${req.params.id}/1/${req.params.subpage}/index.html` ;
        res.sendFile(url,{
            root: __dirname
        })
        /*search: '?_escaped_fragment_=text',
         query: '_escaped_fragment_=text',
         pathname: '/user/56',
         path: '/user/56?_escaped_fragment_=text',*/
    } else {
        res.sendFile('production/index.html',{
            root: __dirname
        })
    }
});

app.get('/*',(req,res)=> {
    console.log("common",req.url);

    res.sendFile('production/index.html',{
        root: __dirname
    })
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


app.listen(app.get('port'), function(){
    console.log( 'Express запущен на http://localhost:' + app.get('port') );
});