const auth = require('../helpers/auth/index');

const schema = {
    querystring: {
        type: `object`,
        properties: {
            _id: {type: 'string'}
        },
    },
    response: {
        '500': {
            type: `object`,
            properties: {
                ERR: {type: `number`}
            }
        },
        '400': {
            type: `object`,
            properties: {
                ERR: {type: `string`}
            }
        },
        '401': {
            type: `object`,
            properties: {
                ERR: {type: `string`}
            }
        },
        '403': {
            type: `object`,
            properties: {
                ERR: {type: `string`}
            }
        },
    }
}


async function user_register(fastify, opts, next) {
    fastify.get('/api/v1/users/find',
        {
            schema,
            preHandler: (req, res,next) => {
                auth(req, res, next, fastify)
                next();
            }
        }, async (req, rep) => {
        const result = await fastify.DB['Users'].find();
        return rep.send(result)
    })
}

module.exports = user_register