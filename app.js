var express = require('express');
var request = require('request');
var moment  = require('moment');
var mysql   = require('mysql');

var app = express();
var path = require('path');
var server = require('http').createServer(app);
var port = process.env.PORT || 4000;

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'sqladmin',
  password : 'admin',
  database : 'scba'
});

db.connect();

const websocket = require('ws')
const wss = new websocket.Server({ port: 4001 });

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static('./node_modules/admin-lte'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

server.listen(port, () => { console.log('Server listening at port %d', port); });

app.get('/', function(req, res){
  console.log(req.path);
  res.render('index');
})

app.get('/ws', function(req, res){
  console.log(req.path);
  res.render('ws');
})

app.get('/spark', function(req, res){
  console.log(req.path);
  res.render('spark');
})

app.get('/scba', function(req, res){
  var uuid = req.query.uuid;
  res.render('scba', {uuid: uuid});
})

function scbaInsert (uuid, name, mac, rssi, pressure, lv1, lv2, lv3, timestamp) {
  var sql = "INSERT INTO scba (uuid, name, mac, rssi, pressure, lv_pressure, lv_temperature, lv_battery, ts) " +
            "values('" + uuid + "', '" + name + "', " + "'" + mac + "', " + rssi + ", " + pressure + ", " + lv1 + ", " + lv2 + ", " + lv3 + ", FROM_UNIXTIME(" + timestamp + "))";
  db.query(sql, function (err, result) {
    if (err) console.log("[mysql] error");
  });
}


function watchInsert (uuid, name, v1, v2, v3, timestamp) {
  var sql = "INSERT INTO watch (uuid, name, v1, v2, v3, ts) " +
            "values('" + uuid + "', '" + name + "', " + parseFloat(v1) + ", " + parseFloat(v2) + ", " + parseFloat(v3) + ", FROM_UNIXTIME(" + timestamp + "))";
  db.query(sql, function (err, result) {
    if (err) console.log("[mysql] error");
  });
}

function androidInsert (uuid, name, v1, v2, v3, timestamp) {
  var sql = "INSERT INTO android (uuid, name, v1, v2, v3, ts) " +
            "values('" + uuid + "', '" + name + "', " + parseFloat(v1) + ", " + parseFloat(v2) + ", " + parseFloat(v3) + ", FROM_UNIXTIME(" + timestamp + "))";
  db.query(sql, function (err, result) {
    if (err) console.log("[mysql] error");
  });
}

app.post('/scba', function(req, res) {
  var data = req.body;
  var list = String(data['gatt']['hex']).split(" ");
  console.log(data);
  var hexPressure = list[2] + list[3];
  console.log(list);
  parseInt(hexPressure, 16);
  scbaInsert (data["uuid"], data['device']['name'], data['device']['mac'], data['device']['rssi'], parseInt(hexPressure, 16), parseInt(list[4], 16), parseInt(list[5], 16), parseInt(list[6], 16), parseInt(data['gatt']['update']/1000, 10));
  res.send("{ 'code': 'success' }");
});

app.post('/watch', function(req, res){
  console.log('/watch');
  var data = req.body;
  console.log(data);
  if (typeof data["hrm"] !== 'undefined' && data['hrm']['x'] > 0) {
    watchInsert(data['uuid'], 'hrm', data['hrm']['x'], 0, 0, parseInt(data['update']/1000));
  }
  if (typeof data["accel"] !== 'undefined') {
    watchInsert(data['uuid'], 'accel', data['accel']['x'], data['accel']['y'], data['accel']['z'], data['update']/1000);
  }
  if (typeof data["gyro"] !== 'undefined') {
    watchInsert(data['uuid'], 'gyro', data['gyro']['x'], data['gyro']['y'], data['gyro']['z'], data['update']/1000);
  }
  if (typeof data["pressure"] !== 'undefined') {
    watchInsert(data['uuid'], 'pressure', data['pressure']['x'], data['pressure']['y'], data['pressure']['z'], data['update']/1000);
  }
  if (typeof data["light"] !== 'undefined') {
    watchInsert(data['uuid'], 'light', data['light']['x'], 0, 0, data['update']/1000);
  }
  res.send("{ 'code': 'success' }");
});

app.post('/android', function(req, res){
  console.log('/android');
  var data = req.body;
  console.log(data);
  if (typeof data["accel"] !== 'undefined') {
    androidInsert(data['uuid'], 'accel', data['accel']['x'], data['accel']['y'], data['accel']['z'], data['update']/1000);
  }
  if (typeof data["gyro"] !== 'undefined') {
    androidInsert(data['uuid'], 'gyro', data['gyro']['x'], data['gyro']['y'], data['gyro']['z'], data['update']/1000);
  }
  if (typeof data["vector"] !== 'undefined') {
    androidInsert(data['uuid'], 'vector', data['vector']['x'], data['vector']['y'], data['vector']['z'], data['update']/1000);
  }
  if (typeof data["gps"] !== 'undefined') {
    androidInsert(data['uuid'], 'gps', data['gps']['x'], data['gps']['y'], 0, data['update']/1000);
  }
  res.send("{ 'code': 'success' }");
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// JSON
//
app.get('/json/scba', function(req, res){
  var uuid = req.query["uuid"];
  var timestamp = req.query["timestamp"];
  var limit = req.query["limit"];
  var sql = "SELECT * FROM scba WHERE uuid = '" + uuid + "' AND ts > FROM_UNIXTIME(" + timestamp + ") order by ts desc";
  if(limit > 0) {
    sql += " limit " + limit;
  }
  db.query(sql, function (err, result) {
    if (err) throw err;
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.get('/json/watch', function(req, res){
  var uuid = req.query["uuid"];
  var timestamp = req.query["timestamp"];
  var limit = req.query["limit"];
  var sql = "SELECT * FROM watch WHERE uuid = '" + uuid + "' AND ts > FROM_UNIXTIME(" + timestamp + ") order by ts desc";
  if(limit > 0) {
    sql += " limit " + limit;
  }
  db.query(sql, function (err, result) {
    if (err) throw err;
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.get('/json/teams', function(req, res){
  var sql = "SELECT uuid, date_format(ts, '%Y/%m/%d %H:%i:%s') as ts, (NOW()-ts) as audit FROM scba WHERE (uuid, ts) IN (SELECT uuid, MAX(ts) AS ts FROM scba GROUP BY uuid) ORDER BY ts DESC";
  db.query(sql, function (err, result) {
    if (err) throw err;
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.get('/json/location', function(req, res){
  var uuid = req.query["uuid"];
  var sql = "SELECT * FROM android WHERE name = 'gps' AND uuid = '" + uuid + "' ORDER BY ts DESC LIMIT 1";
  db.query(sql, function (err, result) {
    if (err) throw err;
    if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.get('/json/comment', function(req, res){
  var text = req.query["text"];
  wsSendAll (text);
  res.send('Sent.');
})

app.get('/rtsp', function(req, res){
  var data = req.body;
  res.send('{ "stream": "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov", "timestamp": ' + moment().unix() + ' }');
  //res.send('{ "stream": "rtsp://freja.hiof.no:1935/rtplive/definst/hessdalen03.stream", "timestamp": ' + moment().unix() + ' }');
})

app.get('/google', function(req, res){
  var data = req.body;
  res.render('google');
})

/*
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
  //ws.send('Hello! Message From Server!!')

  ws.on('message', message => {
    console.log(`Received message => ${message}`)
    wsSendAll (message);
  })

  ws.on('close', function close() {
    console.log('disconnected');
  });
})
