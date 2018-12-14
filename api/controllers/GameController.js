module.exports = {

    sub: async (req, res) => {
        if( ! req.isSocket) {
            return res.badRequest();
        }
        let id = req.params.roomId;
        let socketRoomName = `room-${id}`;

        let room = await Room.findOne({id});

        if (!room) {
            return res.notFound();
        }

        room.players = await Player.find({room: room.id});
        sails.sockets.join(req.socket, socketRoomName);
        sails.sockets.broadcast(socketRoomName, 'NEW_SUB', {}, req);
        sails.log.info(`Socket subbed to room ${room.name} (ID: ${room.id})`);

        return res.ok(room);
    },

    newPlayer: async (req, res) => {
        if( ! req.isSocket) {
            return res.badRequest();
        }
        let id = req.params.roomId;
        let socketRoomName = `room-${id}`;
        let room = await Room.findOne({id});
        room.players = await Player.find({room: room.id});
        if (!room) {
            return res.notFound();
        }

        let player = req.body;
        player.room = room.id;

        // if first to join
        if (!room.players.length) {
            player.isGameMaster = true;
            player.isPlayersTurn = true;
        }


        let saved = await Player.create(player).fetch();
        sails.sockets.broadcast(socketRoomName, 'NEW_PLAYER', saved);
        sails.log.info(`New player joined room ${room.name} (ID: ${room.id}) - username : ${saved.username}`);

        if (room.players && room.players.length === 1) {
            let updatedRoom = await Room.updateOne({id: room.id}).set({status: 'IN_PROGRESS'});
            updatedRoom.players = await Player.find({room: room.id});
            sails.sockets.broadcast(socketRoomName, 'UPDATED_ROOM', updatedRoom);
            sails.log.info(`Room ${room.name} (ID: ${room.id}) has enough players to start !`);
        }

        res.ok(saved);
    },
};