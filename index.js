const zmq = require('zeromq')
const uuidV1 = require('uuid/v1')
const qs = require('querystring')

const mode = process.env.ZMQ_MODE || 'sub'
const host = process.env.ZMQ_HOST || '127.0.0.1'
const port = process.env.ZMQ_PORT || 5556

const elastic_client = require('./libs/client')
const parse = require('./libs/parse')
const sock = zmq.socket(mode)

const parseNaxsi = str => {

  try {
    log = parse(str)
  } catch (e) {
    console.log('json format error')
    console.log(str)
    return {}
  }

  const naxsi_sig = log.http_x_naxsi_sig

  if (naxsi_sig) {
    log.naxsi_sig = qs.parse(naxsi_sig)
    delete log.http_x_naxsi_sig
  }

  console.log(log)
  return log
}

const create = buf => {
  parse(buf.toString())
  // elastic_client.create({
  //   index: 'naxsi',
  //   type: 'access',
  //   id: uuidV1(),
  //   body: parseNaxsi(buf.toString())
  // }, (err, res, status) => {
  //   // console.log(buf.toString())
  //   console.log(err, res, status)
  // })
}

sock.bindSync(`tcp://${host}:${port}`);

sock.subscribe('')
sock.on('message', msg => create(msg))

console.log(`ZMQ_PORT=${port} ZMQ_HOST=${host} ZMQ_MODE=${mode} npm start`)
