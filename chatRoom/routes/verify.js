
const schema = {
    body: {
        type: `object`,
        properties: {
            token: {type: 'string'},
        },
        required: ['token']
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

async function user_verify(fastify, opts, next) {
    fastify.post('/api/v1/users/verify', async (req, rep) => {
            const token = fastify.jwt.verify(req.body.token)
            return rep.send({ token })
    })
}

module.exports = user_verify