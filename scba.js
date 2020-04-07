const request = require('request')
const moment = require('moment')

const TIMEOUT = 3000;
const TIMERAP = 5
const TIMERLV = 50

var counter = 0;
var apr = 155;
var lvp = 3;
var lvt = 3;
var lvb = 3;


function postData () {
  var url = 'http://debian.tric.kr:4000/scba';
  var elm = ['10', '02', '00', '9b', '03', '03', '03', '10', '03'];

  counter += 1;

  if((counter % TIMERAP) == 0) {
    if(apr > 0) apr -= 1;
  }
  if((counter % TIMERLV) == 0) {
    if(lvp > 0) lvp -= 1;
    if(lvt > 0) lvt -= 1;
    if(lvb > 0) lvb -= 1;
  }

  var hp = parseInt(apr/256, 10);
  var lp = parseInt(apr%256, 10);
  elm[2] = hp.toString(16);
  elm[3] = lp.toString(16);
  elm[4] = lvp.toString(16);
  elm[5] = lvt.toString(16);
  elm[6] = lvb.toString(16);
  //var hxp = elm[2] + elm[3]
  //var lvp = elm[4];
  //var lvt = elm[5];
  //var lvb = elm[6];

  var hex = elm.join(' ');

  request.post(url, {
    json: { 
      device: { name: 'SanCheong PASS', mac: 'BB:A0:50:C2:82:D2', rssi: -70 }, 
      gatt: { service: 'Notify', hex: hex, 
        characteristic: '0003cdd1-0000-1000-8000-00805f9b0131', 
        update: moment().unix()*1000 },
      uuid: 'Simulator_55902ffb-f30f-4b82-a673-ee8edf2dc631'
      }
  }, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console.log(body)
  })
  setTimeout(postData, TIMEOUT);
}

setTimeout(postData, TIMEOUT);
