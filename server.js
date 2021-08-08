const fastify = require('fastify')({ logger: true })
const path = require('path')

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public')
})

fastify.get('/', function (req, reply) {
  return reply.sendFile('index.html') 
})

fastify.register(require('./routes/invitationCode'), { prefix: '/api' })

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
