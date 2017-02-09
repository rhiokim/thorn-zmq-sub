const qs = require('qs')

const base = () => ({
  zone: '',
  ip: '',
  whitelisted: false,
  uri: '',
  imported_at: new Date(),
  server: '',
  content: '',
  var_name: '',
  country: '',
  date: '',
  id: ''
})

const stripSpecialChar = str => {
  /*
   * backslash issue
   * ..., "key": "value c:\\ ",
   */
  str = str.replace('\\', '\\\\')

  return str
}



const iterMatchingZone = (data = {}) => {
  let entry, i = 0
  let key = 'zone0'
  let res = []

  const keys = Object.keys(data)
  while(data.hasOwnProperty(key)) {
    entry = base()
    entry['zone'] = data[key]
    entry['var_name'] = data[`var_name${i}`]
    entry['id'] = data[`id${i}`]

    res.push(entry)
    i++
    key = `zone${i}`
  }
}

const parse = (str = '') => {
  const o = base()
  const res = {}

  const data = JSON.parse(stripSpecialChar(str))
  const naxsi = qs.parse(data.http_x_naxsi_sig)

  if (naxsi) {
    iterMatchingZone(naxsi)
  }
}

parse(`
{
  "http_x_naxsi_sig": "ip=192.168.99.1&server=192.168.99.100&uri=/&learning=1&vers=0.55&total_processed=3&total_blocked=3&block=1&cscore0=$XSS&score0=16&cscore1=$RFI&score1=8&zone0=ARGS&id0=1302&var_name0=ccccccccc&zone1=ARGS&id1=1303&var_name1=ccccccccc&zone2=ARGS&id2=1109&var_name2=ddddd"
}`
)

module.exports = parse
