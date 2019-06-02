async function startSocket(io, fastify) {
    io.on('connection', function (socket) {
        console.log('Connect');
        socket.on('create-room', async function (data) {
            const token = fastify.jwt.verify(data.token),
                //if not verify
                rooms = await fastify.DB['Rooms'].findOne(
                    {
                        $or: [{na: `room-${data.to}-${token.user_id}`},
                            {na: `room-${token.user_id}-${data.to}`}
                        ]
                    })
            let roomName = ``, message = ``, roomId

            if (rooms) {
                roomName = rooms.na , message = `Welcome To Room Unique Room `
                roomId = rooms._id
            } else {
                roomName = `room-${token.user_id}-${data.to}`, message = `Welcome To Room New Room `
                const result = await fastify.DB['Rooms'].create({na: roomName, uid: token.user_id, to: data.to})
                roomId = result._id

            }

            //set user in room
            const checkMe = await fastify.DB['Onlines'].findOne({uid: token.user_id, rid: roomId});
            if (checkMe)
                fastify.DB['Onlines'].updateOne({uid: token.user_id, rid: roomId}, {$set: {sid: socket.id}});
            else
                fastify.DB['Onlines'].create({uid: token.user_id, rid: roomId, sid: socket.id, st: 1});
            //update message to read status
            await fastify.DB['Chats'].updateMany({uid: data.to, rid: roomId}, {$set: {st: 2}});
            //get history chats


            /* start redis */
            // fastify.client.get(roomName, async function (err, result) {
            //     if (err) throw err;
            //     let chats = result
            //     if (result === null) {
            //         chats = await fastify.DB['Chats'].find({rid: roomId}).populate('uid', 'na', null, {sort: {'ca': 1}}).exec();
            //         fastify.client.set(roomName, JSON.stringify(chats));
            //     }
            // });
            //

            const chats = await fastify.DB['Chats'].find({rid: roomId}).populate('uid', 'na', null, {sort: {'ca': 1}}).exec();


            socket.join(roomName).emit(`connect-${roomName}`, {
                message: message,
                data: chats,
                switch: 1
            });
            io.emit(`connect-${roomName}`, {
                switch: 3,
                user: token.user_id,
            })
            //create online user
            socket.on(`connect-${roomName}`, async function (msg) {
                // check user online or offline
                const checkTo = await fastify.DB['Onlines'].findOne({uid: data.to, rid: roomId});
                let st = 1; //offline
                if (checkTo) {
                    st = 2 //online
                }

                if (msg.co.trim().length > 0) {
                    fastify.DB['Chats'].create({
                        rid: roomId,
                        uid: token.user_id,
                        ty: msg.ty,
                        co: msg.co,
                        st: st,
                    })

                    io.emit(`connect-${roomName}`, {
                        data: msg.co,
                        ty: msg.ty,
                        switch: 0,
                        user: token.user,
                        st: st
                    })
                }
            })
        })

        socket.on('disconnect', async function () {
            await fastify.DB['Onlines'].deleteOne({sid: socket.id})
            console.log('Disconnected', socket.id);
        });
    });

}

module.exports = startSocket;