var express = require('express');
var request = require('request');
var moment  = require('moment');
var mysql   = require('mysql');
var crypto  = require('crypto');
var aes256  = require('aes256');
var fs      = require('fs');

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

db.connect(function(err){
  if(err) {
    console.error("[mysql] Connection (" + err + ")");
    process.exit();
  }
});

db.query("set time_zone='+9:00'", function (err, result) {
  if (err) {
    console.log("[mysql] Timezone (" + err + ")");
    process.exit();
  }
});

const websocket = require('ws')
const wss = new websocket.Server({ port: 4001 });

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static('./node_modules/admin-lte'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

//var key = 'hancomhancomhancomhancomhancomha';
//var encrypted = aes256.encrypt(key, 'password');
const iv = Buffer.alloc(16, 0);  
const cipher = crypto.createCipheriv('aes-256-cbc', 'hancomhancomhancomhancomhancomha', iv);
let result = cipher.update('password', 'utf8', 'base64');
result += cipher.final('base64');
console.log('암호화된 암호: ', result);

const decipher = crypto.createDecipheriv('aes-256-cbc', 'hancomhancomhancomhancomhancomha', iv);
let result2 = decipher.update(result, 'base64', 'utf8');
result2 += decipher.final('utf8');
console.log('복호화된 평문: ',result2);

server.listen(port, () => { console.log('Server listening at port %d', port); });

app.get('/', function(req, res){
  res.render('index');
})

app.get('/ws', function(req, res){
  res.render('ws');
})

app.get('/spark', function(req, res){
  res.render('spark');
})

app.get('/scba', function(req, res){
  var uuid = req.query.uuid;
  res.render('scba', {uuid: uuid});
})

app.get('/users', function(req, res){
  var id = req.params.id;
  var sql = "SELECT * FROM users";
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.get('/users/:id', function(req, res){
  var id = req.params.id;
  var sql = "SELECT * FROM users WHERE id = '" + id + "'";
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.delete('/users/:id', function(req, res){
  var id = req.params.id;
  var sql = "DELETE FROM users WHERE id = '" + id + "'";
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
      res.send({'code': 0});
    }
    res.send({'code': 1});
  });
})

app.get('/watch', function(req, res){
  var uuid = req.params.uuid;
  var sql = "SELECT * FROM (SELECT * FROM watch WHERE (uuid, ts) IN (SELECT uuid, max(ts)as ts FROM watch GROUP BY uuid) ORDER BY ts DESC) t GROUP BY t.ts"
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})


app.get('/watch/:uuid', function(req, res){
  var uuid = req.params.uuid;
  var sql = "SELECT * FROM watch WHERE uuid = '" + uuid + "' order by ts desc limit 1";
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.get('/watch/:uuid/:type', function(req, res){
  var uuid = req.params.uuid;
  var type = req.params.type;
  var sql = "SELECT * FROM watch WHERE uuid = '" + uuid + "' AND name ='" + type + "' order by ts desc limit 1";
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.get('/android', function(req, res){
  var uuid = req.params.uuid;
  var sql = "SELECT * FROM (SELECT * FROM android WHERE (uuid, ts) IN (SELECT uuid, max(ts)as ts FROM android GROUP BY uuid) ORDER BY ts DESC) t GROUP BY t.ts"
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})


app.get('/android/:uuid', function(req, res){
  var uuid = req.params.uuid;
  var sql = "SELECT * FROM android WHERE uuid = '" + uuid + "' order by ts desc limit 1";
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.get('/android/:uuid/:type', function(req, res){
  var uuid = req.params.uuid;
  var type = req.params.type;
  var sql = "SELECT * FROM android WHERE uuid = '" + uuid + "' AND name ='" + type + "' order by ts desc limit 1";
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

function scbaInsert (uuid, name, mac, rssi, pressure, lv1, lv2, lv3, timestamp) {
  var sql = "INSERT INTO scba (uuid, name, mac, rssi, pressure, lv_pressure, lv_temperature, lv_battery, ts) " +
            "values('" + uuid + "', '" + name + "', " + "'" + mac + "', " + rssi + ", " + pressure + ", " + lv1 + ", " + lv2 + ", " + lv3 + ", FROM_UNIXTIME(" + timestamp + "))";
  db.query(sql, function (err, result) {
    if (err) console.error("[mysql] Insert (" + err + ") : " + sql);
  });
}


function watchInsert (uuid, name, v1, v2, v3, timestamp) {
  var sql = "INSERT INTO watch (uuid, name, v1, v2, v3, ts) " +
            "values('" + uuid + "', '" + name + "', " + parseFloat(v1) + ", " + parseFloat(v2) + ", " + parseFloat(v3) + ", FROM_UNIXTIME(" + timestamp + "))";
  db.query(sql, function (err, result) {
    if (err) console.log("[mysql] error - " + sql);
  });
}

function androidInsert (uuid, name, v1, v2, v3, timestamp) {
  var sql = "INSERT INTO android (uuid, name, v1, v2, v3, ts) " +
            "values('" + uuid + "', '" + name + "', " + parseFloat(v1) + ", " + parseFloat(v2) + ", " + parseFloat(v3) + ", FROM_UNIXTIME(" + timestamp + "))";
  db.query(sql, function (err, result) {
    if (err) console.log("[mysql] error - " + sql);
  });
}

function userInsert (id, passwd, username, uuid) {
  var sql = "INSERT INTO users (id, passwd, username, uuid) " +
            "values('" + id + "', '" + passwd + "', '" + username + "', '" + uuid + "')";
  db.query(sql, function (err, result) {
    if (err) console.log("[mysql] error - " + sql);
  });
}

app.post('/login', function(req, res) {
  var data = req.body;
  console.log(data);
  var id     = data.id;
  var passwd = data.passwd;
  var uuid   = data.uuid;
  console.log(id);
  console.log(passwd);
  console.log(uuid);

  var sql = "SELECT * FROM users WHERE id = '" + id + "'";
  console.log(sql);
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      console.log(result);
      console.log(result[0].passwd);
      if(result[0].passwd == passwd) res.send({'code': 1});
      else               res.send({'code': 0});
    }
    else res.send({'code': 0});
  });

  //var hash = crypto.createHash('sha512').update('password').digest('hex');
  //if(hash == passwd) res.send({'code': 1});
  //else               res.send({'code': 0});
});

app.post('/signup', function(req, res) {
  var data = req.body;
  console.log(data);
  var id       = data.id;
  var passwd   = data.passwd;
  var username = data.username;
  var uuid     = data.uuid;
  console.log(id);
  console.log(passwd);
  console.log(username);
  console.log(uuid);
  userInsert (id, passwd, username, uuid);
  res.send({'code': 1});
});

app.post('/scba', function(req, res) {
  var data = req.body;
  var list = String(data['gatt']['hex']).split(" ");
  var hexPressure = list[2] + list[3];
  parseInt(hexPressure, 16);
  scbaInsert (data["uuid"], data['device']['name'], data['device']['mac'], data['device']['rssi'], parseInt(hexPressure, 16), parseInt(list[4], 16), parseInt(list[5], 16), parseInt(list[6], 16), parseInt(data['gatt']['update']/1000, 10));
  res.send("{ 'code': 'success' }");
});

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

app.post('/watch', function(req, res){
  var data = req.body;
  console.log(data);
  if (typeof data["hrm"] !== 'undefined' && isEmptyObject(data["hrm"]) == false) {
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
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
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
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.get('/json/teams', function(req, res){
  //var sql = "SELECT uuid, date_format(ts, '%Y/%m/%d %H:%i:%s') as ts, (NOW()-ts) as audit FROM scba WHERE (uuid, ts) IN (SELECT uuid, MAX(ts) AS ts FROM scba GROUP BY uuid) ORDER BY ts DESC";
  var sql = "SELECT uuid, date_format(ts, '%Y/%m/%d %H:%i:%s') as ts, (NOW()-ts) as audit FROM (SELECT * FROM scba WHERE (uuid, ts) IN (SELECT uuid, max(ts)as ts FROM scba GROUP BY uuid) ORDER BY ts DESC) t GROUP BY t.ts";
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.get('/json/location', function(req, res){
  var uuid = req.query["uuid"];
  var sql = "SELECT * FROM android WHERE name = 'gps' AND uuid = '" + uuid + "' ORDER BY ts DESC LIMIT 1";
  db.query(sql, function (err, result) {
    if (err) {
      console.error("[mysql] Query (" + err + ")");
      console.error("[mysql] * " + sql);
    }
    else if(result.length > 0) {
      res.send(JSON.stringify(result));
    }
    else res.send("");
  });
})

app.get('/json/comment', function(req, res){
  var text = req.query["text"];
  console.log (text);
  wsSendAll (text);
  res.send('Sent.');
})

app.get('/json/rtsp', function(req, res){
  var text = req.query["text"];
  fs.writeFile('rtsp.site', text, function (err) {
    if (err) return console.log(err);
  });
})

app.get('/rtsp', function(req, res){
  fs.readFile('rtsp.site', function (err, data) {
    if (err) return console.log(err);
    console.log(data.toString());
    res.send('{ "stream": "' + data.toString() + '", "timestamp": ' + moment().unix() + ' }');
  });
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
