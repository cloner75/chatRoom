const hash = require('object-hash')

const schema = {
    body:
        {
            type: 'object',
            properties: {
                em: {type: 'string',},
                se: {type: 'string'},
            },
            required: ['se', 'em'],
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

async function user_login(fastify, opts, next) {
    fastify.post('/api/v1/users/login',{schema}, async (req, rep) => {

        const result = await fastify.DB['Users'].findOne({em:req.body.em,se:hash(req.body.se)})
        if(result){
            const otp =  fastify.GenerateOTP()
            // return rep.send(otp);
            const token = fastify.jwt.sign({ user_id:result._id,email:result.em,user:result.na })
            return rep.send({ token })
        }else
        {
            return rep.send({error:'user not exists'})
        }
    })
}

module.exports = user_login