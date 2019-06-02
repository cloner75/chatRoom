const Hash = require('object-hash');

const schema = {
    body:
        {
            type: 'object',
            properties: {
                na: {type: 'string',},
                se: {type: 'string'},
                ci: {type: 'string'},
                cs: {type: 'string'},
                em: {type: 'string'},
            },
            required: ['na', 'se', 'cs', 'em','ci'],
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


/*Start Route And Controller UserCreate */


async function user_register(fastify, options) {
    fastify.post('/api/v1/users/register', {
        schema,
    }, async (req, rep) => {
        if (req.body.se !== req.body.cs || req.body.se.length < 8) {
            const err = Error();
            err.status = 400;
            err.message = 'check password and Re-password and password lengh must 8 character'
            throw err;
        }
        const checkUser = await  fastify.DB['Users'].findOne({em:req.body.em})
        if(checkUser){
            const err = Error();
            err.status = 500;
            err.message =   `Email ${req.body.em} Already Exists`
            throw err;
        }
        const data = {
            ty: 0,
            st: 1,
            em: req.body.em,
            ci: req.body.ci,
            na: req.body.na.toLowerCase(),
            se: Hash.sha1(req.body.se),
        }
        const res = await fastify.DB['Users'].create(data)
        return rep.status(200).send(res)
    })
}

module.exports = user_register

