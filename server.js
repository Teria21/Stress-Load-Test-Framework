var express = require('express');
var app = express();
var morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.static('public'));

app.listen(3000,function(){
    console.log('Express start on port 3000 ');
});
