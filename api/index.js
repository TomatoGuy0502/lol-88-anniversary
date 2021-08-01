const axios = require('axios').default
const https = require('https')

const agent = new https.Agent({
  rejectUnauthorized: false
})

const getComments = async ({ id = 'tw_32775_newnews_32165', start = 0, size = 10, order = 2 } = {}) => {
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

const enterCode = async ({userToken = '', csrfToken = '', code = ''} = {}) => {
  const headers = {
    'Referer': `https://bargain.lol.garena.tw/?token=${userToken}`,
    'Token': userToken,
    'X-CSRFToken': csrfToken,
    'Content-Type': 'application/json'
  }
  const data = { code, confirm: true }

  return axios.post('https://bargain.lol.garena.tw/api/enter', data, { headers })
}

module.exports = {
  getComments,
  enterCode
}