import express = require('express');
import path = require('path');
var port: number = process.env.PORT || 3000;
var app = express();

app.use('/libs', express.static(path.resolve(__dirname, '../node_modules')));
app.use(express.static(path.resolve(__dirname, '../public')));

var renderIndex = (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
}

app.get('/*', renderIndex);

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
