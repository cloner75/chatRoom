const path = require(`path`),
    multer = require('fastify-multer'),
    auth = require('../helpers/auth'),
    upload = multer({dest: path.join(__dirname, `../CDN`)}),
    jwt = require('jsonwebtoken');





/*Start Route And Controller ChargersCreate */


async function route_CDNCreate(fastify, options) {
    fastify.post('/CDN/Upload', {
        preHandler: [upload.single('file'),
            (req, res,next) => {
                    auth(req, res, next, fastify)
                    next();
                }
        ]
    }, async (req, rep) => {
        let data = [];
        // data['uid'] = jwt.decode(req.headers['authorization']).uid;
        data['fn'] = req.file.fieldname;
        data['or'] = req.file.originalname;
        data['en'] = req.file.encoding;
        data['mi'] = req.file.mimetype;
        data['de'] = req.file.destination;
        data['na'] = req.file.filename;
        data['pa'] = req.file.path;
        data['si'] = req.file.size;
        let res = await fastify.DB['Files'].create(Object.assign({}, data))
        return rep.send(res.na);
    })
}

module.exports = route_CDNCreate