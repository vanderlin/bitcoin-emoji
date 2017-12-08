var port = process.env.PORT || 5000
var path = require('path')
var express = require('express')
var serveStatic = require('serve-static');
var app = express()

app.listen(port, function() {
	console.log(`App running at http://localhost:${port}`);
})

app.use(express.static(path.join(__dirname, 'dist'))); //  "public" off of current is root

app.get('*', function(req,res){
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});