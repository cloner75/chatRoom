const
    path = require(`path`),
    multer = require('fastify-multer'),
    upload = multer({dest: path.join(__dirname, `../CDN`)}),
    fs = require(`fs`);

const schema = {
    params: {
        type: `object`,
        properties: {
            na: {type: 'string'}
        },
        required: ['na']
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


/*Start Route And Controller ChargersCreate */


async function route_cdnDownload(fastify, options) {
    fastify.get('/CDN/:na', {
        schema
    }, (req, rep) => {
        fs.readFile(path.join(__dirname, `../CDN`) + '/' + req.params.na, async (err, fileBuffer) => {
            if (err) {
                return rep.status(500).send({ERR: 'File Not Found'})
            }
            const file = await fastify.DB['Files'].findOne({na: req.params.na});
            rep.type(file.mi)
            rep.status(200).send(err || fileBuffer)
        })
    })
}

module.exports = route_cdnDownload