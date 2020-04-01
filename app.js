var express = require('express');
var request = require('request');
var moment  = require('moment');

var app = express();
var path = require('path');
var server = require('http').createServer(app);
var port = process.env.PORT || 4000;

const websocket = require('ws')
const wss = new websocket.Server({ port: 4001 });


app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

server.listen(port, () => { console.log('Server listening at port %d', port); });

app.get('/', function(req, res){
  res.render('index');
})

app.post('/scba', function(req, res){
  var data = req.body;
  console.log(data);
  res.send('200 Okay');
})

app.post('/hrm', function(req, res){
  var data = req.body;
  console.log(data);
  res.send('200 Okay');
})

app.post('/accel', function(req, res){
  var data = req.body;
  console.log(data);
  res.send('200 Okay');
})

app.post('/gyro', function(req, res){
  var data = req.body;
  console.log(data);
  res.send('200 Okay');
})

app.post('/orient', function(req, res){
  var data = req.body;
  console.log(data);
  res.send('200 Okay');
})

app.post('/magnetic', function(req, res){
  var data = req.body;
  console.log(data);
  res.send('200 Okay');
})

app.get('/rtsp', function(req, res){
  var data = req.body;
  res.send('{ "stream": "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov", "timestamp": ' + moment().unix() + ' }');
})

const timeout = 60000

function cbReader(arg) {
  console.log(moment().unix());
  setTimeout(cbReader, timeout, null);
}

setTimeout(cbReader, timeout, null);

var id = 0;
var clients = [];

function wsSendAll (message) {
  for (var i=0; i<clients.length; i++) {
    clients[i].send(message);
  }
}

wss.on('connection', ws => {
  clients.push (ws)
  ws.send('Hello! Message From Server!!')

  ws.on('message', message => {
    console.log(`Received message => ${message}`)
    wsSendAll (message);
  })

  ws.on('close', function close() {
    console.log('disconnected');
  });
})
