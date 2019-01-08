const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');

class Jushuitan {

  constructor(args = {}) {
    const defaultConfig = {
      url: 'http://c.sursung.com/api/open/query.aspx',
      qmUrl: 'http://a1q40taq0j.api.taobao.com/router/qmtest',
      partnerid: 'ywv5jGT8ge6Pvlq3FZSPol345asd',
      patrnerkey: 'ywv5jGT8ge6Pvlq3FZSPol2323',
      token: '181ee8952a88f5a57db52587472c3798',
      target_app_key: '23060081'
    };
    this.config = Object.assign({}, defaultConfig, args);
  }

  query(method, form) {
    const { url } = this.config;
    const ts = Math.floor((new Date).getTime() / 1000);
    const sign = this.sign({
      method,
      ts
    });
    const qs = {
      partnerid: this.config.partnerid,
      token: this.config.token,
      method,
      ts,
      sign
    };
    const requestUrl = this.config.url + '?' + querystring.stringify(qs);
    return new Promise((resolve, reject) => {
      axios.post(requestUrl, form).then(res => {
        resolve(res.data);
      })
      .catch(reject);
    });
  }

  sign({ method, ts }) {
    const {
      partnerid,
      token,
      patrnerkey
    } = this.config;

    const signStr = [ method, partnerid, 'token',
      token, 'ts', ts, patrnerkey ].join('');

    const md5 = crypto.createHash('md5');
    return md5.update(signStr).digest('hex');
  }
}

module.exports = Jushuitan;