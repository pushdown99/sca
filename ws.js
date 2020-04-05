var express = require('express');
var request = require('request');
var moment  = require('moment');
var mysql   = require('mysql');

//var app = express();
//var path = require('path');
//var server = require('http').createServer(app);
//var port = process.env.PORT || 4000;

//var db = mysql.createConnection({
//  host     : 'localhost',
//  user     : 'sqladmin',
//  password : 'admin',
//  database : 'scba'
//});

//db.connect();

const websocket = require('ws')
const wss = new websocket.Server({ port: 4001 });

/*
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static('./node_modules/admin-lte'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

server.listen(port, () => { console.log('Server listening at port %d', port); });

app.get('/', function(req, res){
  res.render('index');
})

app.get('/chart', function(req, res){
  res.render('chart');
})

app.get('/spark', function(req, res){
  res.render('spark');
})

app.get('/scba', function(req, res){
  res.render('scba');
})

function scbaInsert (name, mac, rssi, pressure, lv1, lv2, lv3, timestamp) {
  var sql = "INSERT INTO scba (name, mac, rssi, pressure, lv_pressure, lv_temperature, lv_battery, ts) " +
            "values('" + name + "', " + "'" + mac + "', " + rssi + ", " + pressure + ", " + lv1 + ", " + lv2 + ", " + lv3 + ", FROM_UNIXTIME(" + timestamp + "))";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
}


function watchInsert (name, v1, v2, v3, timestamp) {
  var sql = "INSERT INTO watch (name, v1, v2, v3, ts) " +
            "values('" + name + "', " + parseFloat(v1) + ", " + parseFloat(v2) + ", " + parseFloat(v3) + ", FROM_UNIXTIME(" + timestamp + "))";
  console.log(sql);
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
}

app.post('/scba', function(req, res) {
  var data = req.body;
  console.log(data);
  res.send("{ 'code': 'success' }");
});

app.post('/watch', function(req, res){
  var data = req.body;
  console.log(data);
  res.send("{ 'code': 'success' }");
});

app.post('/android', function(req, res){
  var data = req.body;
  console.log(data);
  res.send("{ 'code': 'success' }");
});

app.post('/scba_', function(req, res){
  var data = req.body;
  var list = String(data['gatt']['hex']).split(" ");
  console.log(data);
  var hexPressure = list[2] + list[3];
  console.log(list);
  parseInt(hexPressure, 16);
  scbaInsert (data['device']['name'], data['device']['mac'], data['device']['rssi'], parseInt(hexPressure, 16), parseInt(list[5], 16), parseInt(list[5], 16), parseInt(list[5], 16), parseInt(data['gatt']['timestamp']/1000, 10));
  res.send("{ 'code': 'success' }");
})

app.post('/hrm', function(req, res){
  var data = req.body;
  console.log(data);
  watchInsert('heartrate', data['x'], 0, 0, parseInt(data['update']/1000));
  res.send("{ 'code': 'success' }");
})

app.post('/accel', function(req, res){
  var data = req.body;
  console.log(data);
  watchInsert('accelerometer', data['x'], data['y'], data['z'], data['update']/1000);
  res.send("{ 'code': 'success' }");
})

app.post('/gyro', function(req, res){
  var data = req.body;
  console.log(data);
  watchInsert('gyrometer', data['x'], data['y'], data['z'], data['update']/1000);
  res.send("{ 'code': 'success' }");
})

app.post('/orient', function(req, res){
  var data = req.body;
  console.log(data);
  res.send("{ 'code': 'success' }");
})

app.post('/magnetic', function(req, res){
  var data = req.body;
  console.log(data);
  res.send("{ 'code': 'success' }");
})

app.get('/json/scba', function(req, res){
  var timestamp = req.query["timestamp"];
  var limit = req.query["limit"];
  var sql = "SELECT * FROM scba WHERE ts > FROM_UNIXTIME(" + timestamp + ") order by ts desc";
  if(limit > 0) {
    sql += " limit " + limit;
  }
  db.query(sql, function (err, result) {
    if (err) throw err;
    if(result.length > 0) {
      console.log(result);
      res.send(JSON.stringify(result));
    }
  });
})

app.get('/json/watch', function(req, res){
  var timestamp = req.query["timestamp"];
  var limit = req.query["limit"];
  var sql = "SELECT * FROM watch WHERE ts > FROM_UNIXTIME(" + timestamp + ") order by ts desc";
  if(limit > 0) {
    sql += " limit " + limit;
  }
  db.query(sql, function (err, result) {
    if (err) throw err;
    if(result.length > 0) {
      console.log(result);
      res.send(JSON.stringify(result));
    }
  });
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

//setTimeout(cbReader, timeout, null);
*/

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
