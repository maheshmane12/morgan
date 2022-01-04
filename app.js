var express = require('express')
var morgan = require('morgan')
var fs= require('fs');
var path= require('path');
var rfs = require('rotating-file-stream')
var uuid = require('node-uuid');

morgan.token('id', function getId (req) {
    return req.id
})


var app = express()

app.use(assignId)
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
    
},{flags: 'a'})
 

app.use(morgan('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
}))
app.use(morgan('common', {
    stream: accessLogStream
}))  
  
app.get('/', function (req, res) {
  res.send('hello, world!');
})
app.get('/login',(req,res)=>{
    res.send('login page');
})
function assignId (req, res, next) {
    req.id = uuid.v4()
    next()
  }

app.listen(3000,()=>{
    console.log("running")
})