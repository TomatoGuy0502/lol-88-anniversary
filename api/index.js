const axios = require('axios').default
const https = require('https')

const agent = new https.Agent({
  rejectUnauthorized: false
})

const getComments = async ({
  id = 'tw_32775_newnews_32165',
  start = 0,
  size = 10,
  order = 2
} = {}) => {
  if (size > 50) size = 50
  if (start < 0) start = 0

  return axios({
    method: 'post',
    url: 'https://commenttw.garenanow.com/api/comments/get/',
    httpsAgent: agent,
    data: {
      obj_id: id,
      root_id: 0,
      size,
      order,
      start
    }
  })
}

const enterCode = async ({
  userToken = '',
  code = '',
  csrfToken = ''
} = {}) => {
  const headers = {
    Referer: `https://bargain.lol.garena.tw/?token=${userToken}`,
    Token: userToken,
    'Content-Type': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) LeagueOfLegendsClient/11.15.388.2387 (CEF 74) Safari/537.36'
  }
  const data = { code, confirm: false }
  if (csrfToken) {
    headers.Cookie = `csrftoken=${csrfToken};`
    data.confirm = true
  }

  return axios.post('https://bargain.lol.garena.tw/api/enter', data, {
    headers
  })
}

module.exports = {
  getComments,
  enterCode
}
