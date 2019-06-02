

async function auth(req, res, next, fastify) {
    if (!req.headers[`authorization`])
        return res.status(401).send({ERR: `Authorization is required`})

    fastify.jwt.verify(req.headers[`authorization`],async function (err, decode) {
        if (err) {
            return res.status(401).send({ERR: `Authorization is not true`})
        } else {
            const checkUser = await fastify.DB['Users'].findOne({_id: decode.user_id});
            if (checkUser)
                next()
            else
                return res.status(401).send({ERR: `User Expire`})
        }
    })
}

module.exports = auth