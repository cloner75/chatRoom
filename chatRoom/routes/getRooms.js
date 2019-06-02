const auth = require('../helpers/auth')


const schema = {
    querystring: {
        type: `object`,
        properties: {
            user_id: {type: 'string'},
            to: {type: 'string'}
        },
        required: ['to','user_id']
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


async function rooms_find(fastify, opts, next) {
    fastify.get('/api/v1/rooms/find',
        {
            schema,
            preHandler: (req, res,next) => {
                auth(req, res, next, fastify)
                next();
            }
        }, async (req, rep) => {
            const result = await fastify.DB['Rooms'].findOne(
                {
                    $or: [
                        {na: `room-${req.query.to}-${req.query.user_id}`},
                        {na: `room-${req.query.user_id}-${req.query.to}`}
                    ]
                }
            );
            return rep.send(result)
        })
}

module.exports = rooms_find