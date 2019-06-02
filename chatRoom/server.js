const fastify = require('fastify')({logger: false}),
    path = require('path'),
    AutoLoad = require('fastify-autoload'),
    io = require('socket.io')('8000'),
    multer = require('fastify-multer'),
    socketChat = require('./helpers/socket'),
    TOTP = require('otp.js').totp;

//redis client
// redis = require("redis");


// fastify.decorate('client',redis.createClient({detect_buffers: true}))


fastify.register(multer.contentParser)
fastify.register(require('fastify-formbody'))
fastify.use(require('cors')())
fastify.use(require('dns-prefetch-control')())
fastify.use(require('frameguard')())
fastify.use(require('hide-powered-by')())
fastify.use(require('hsts')())
fastify.use(require('ienoopen')())
fastify.use(require('x-xss-protection')())

// set jwt secret
fastify.register(require('fastify-jwt'), {
    secret: 'iCarwMe1Aa5O8yW6ZOYVPPVHTGKBhJaLKHhewi1KjPvo4RY4zhV7aazHfXtiZ8Bb'
});

// set autoload routes
fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: {foo: 'bar'}
})


fastify.decorate('GenerateOTP', () => {
    return TOTP.gen({string: 'iCarwMe1Aa5O8yW6ZOYVPPVHTGKBhJaLKHhewi1KjPvo4RY4zhV7aazHfXtiZ8Bb'}, {time: 3 * 60})
})

fastify.decorate('VerifyOTP', (code) => {
    let t = TOTP.gen({string: 'iCarwMe1Aa5O8yW6ZOYVPPVHTGKBhJaLKHhewi1KjPvo4RY4zhV7aazHfXtiZ8Bb'}, {time: 3 * 60})
    if (t === code)
        return true
    else
        return false
})


// decorate database file for schema and models
fastify.decorate(`DB`, require('./helpers/database/index'))

//
// fastify.register(require('fastify-static'), {
//     root: path.join(__dirname, 'clients'),
//     prefix: '/', // optional: default '/'
// })
//


/*start server*/
const start = async () => {
    try {
        await fastify.listen(1337, '0.0.0.0');
        console.log('Api Is Run Port 1337')
        await socketChat(io, fastify);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1)
    }
};
start();
