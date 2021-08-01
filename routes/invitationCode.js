const { getComments, enterCode } = require('../api')

const opts = {
  schema: {
    querystring: {
      order: { type: 'number', default: 2 },
      size: { type: 'number', default: 10 },
      start: { type: 'number', default: 0 }
    }
  }
}

async function routes (fastify, options) {
  fastify.get('/invitation-code', opts, async (request, reply) => {
    const { order, size, start } = request.query

    try {
      // 可能最新的留言內沒有邀請碼，所以多抓一點留言，
      const { data } = await getComments({ id: 'tw_32775_newnews_32165', order, size: size + 3, start })
      if (data.error) {
        throw data.error
      }

      const comment = data.comment_list
        .map(comment => comment.extra_data.content)
        .join(' ')
      const code = comment.match(/LOL[A-Z0-9]{10}/g).slice(0, size)

      return { code }
    } catch (error) {
      return { statusCode: 500, body: error.toString() }
    }
  })

  fastify.post('/enter-code', async (request, reply) => {
    try {
      const { userToken, csrfToken, code } = request.body
      const { data } = await enterCode({ userToken, csrfToken, code })

      return { data }
    } catch (error) {
      return { statusCode: 500, body: error.toString() }
    }
  })
}

module.exports = routes
