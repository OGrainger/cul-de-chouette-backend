const Helpers = require('./../algorithm/Helpers');
const Combinaisons = require('./../algorithm/Combinaisons');
module.exports = {

    sub: async (req, res) => {
        if (!req.isSocket) {
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
        sails.log.info(`Socket subbed to room ${room.name} (ROOM ID: ${room.id})`);

        return res.ok(room);
    },

    newPlayer: async (req, res) => {
        if (!req.isSocket) {
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
            player.isPlayersTurn = true;
        }

        let maxOrder = 0;
        room.players.forEach(p => {
            if (p.order >= maxOrder) {
                maxOrder = p.order;
            }
        });
        player.order = maxOrder + 1;

        let saved = await Player.create(player).fetch();
        sails.sockets.broadcast(socketRoomName, 'NEW_PLAYER', saved);
        sails.log.info(`Player ${saved.username} (PLAYER ID : ${saved.id}) joined room ${room.name} (ROOM ID: ${room.id})`);

        if (room.players && room.players.length === 1) {
            sails.log.info(`Room ${room.name} (ID: ${room.id}) has enough players to start !`);
        }

        res.ok(saved);
    },
    removePlayer: async (req, res) => {
        if (!req.isSocket) {
            sails.log.error('Bad request');
            return res.badRequest();
        }
        let roomId = req.params.roomId;
        let playerId = req.params.playerId;


        let socketRoomName = `room-${roomId}`;
        let room = await Room.findOne({id: roomId});
        room.players = await Player.find({room: room.id});

        if (!room) {
            return res.notFound();
        }
        if (!room.players.some(p => p.id === Number(playerId))) {
            return res.badRequest({errorCode: 'PLAYER_NOT_IN_ROOM_ERROR'})
        }

        let deleted = await Player.archiveOne({id: playerId});

        if (deleted) {
            // Update order of each next players
            room.players.forEach(async p => {
                if (p.order > deleted.order) {
                    await Player.updateOne({id: p.id}, {order: p.order - 1});
                    p.order = p.order - 1;
                }
            });

            // Update who's turn it is
            let newPlayersTurn;
            if (deleted.isPlayersTurn) {
                newPlayersTurn = Helpers.findNewRole(deleted, room.players);
                if (newPlayersTurn) {
                    newPlayersTurn = await Player.updateOne({id: newPlayersTurn.id}, {isPlayersTurn: true});
                    // If new turn's is the first player, increment turn
                    if (newPlayersTurn.order === 1) {
                        await Room.updateOne({id: roomId}, {turnCount: room.turnCount + 1});
                        sails.log.info(`Room ${room.name} is now at turn ${room.turnCount} (ROOM ID: ${room.id})`);
                    }
                }
            }

            sails.sockets.broadcast(socketRoomName, 'PLAYER_LEFT', {
                playerDeleted: deleted,
                newPlayersTurn
            });
            sails.log.info(`Player ${deleted.username} (PLAYER ID: ${deleted.id}) left room ${room.name} (ROOM ID: ${room.id})`);
            res.ok();
        } else {
            res.badRequest();
        }
    },

    playerAction: async (req, res) => {
        if (!req.isSocket) {
            sails.log.error('Bad request');
            return res.badRequest();
        }
        let roomId = req.params.roomId;
        let playerId = req.params.playerId;


        let socketRoomName = `room-${roomId}`;
        let room = await Room.findOne({id: roomId});
        room.players = await Player.find({room: room.id});

        if (!room) {
            return res.notFound();
        }
        if (!room.players.some(p => p.id === Number(playerId))) {
            return res.badRequest({errorCode: 'PLAYER_NOT_IN_ROOM_ERROR'})
        }

        let player = room.players.find(p => p.id === Number(playerId));

        // ------
        let payload = req.body;

        if (payload.action === 'THROW_CHOUETTES') {
            let chouettes = Combinaisons.LanceChouettes();
            await Player.updateOne({id: player.id}, {chouette1: chouettes.chouette1, chouette2: chouettes.chouette2});
            sails.sockets.broadcast(socketRoomName, 'PLAYER_ACTION', {
                action: 'THROW_CHOUETTES',
                payload: chouettes,
                player
            });
            sails.log.info(`Player ${player.username} (PLAYER ID: ${player.id}) throw his Chouettes, giving ${chouettes.chouette1} and ${chouettes.chouette2} (Room ${room.name} ID: ${room.id})`);
            res.ok(chouettes)
        } else if (payload.action === 'THROW_CUL') {
            let cul = Combinaisons.LanceCul();
            sails.log.info(`Player ${player.username} (PLAYER ID: ${player.id}) throw his Cul, giving ${cul} (Room ${room.name} ID: ${room.id})`);
            let results = Combinaisons.Calc(player.chouette1, player.chouette2, cul);
            sails.log.info(`Player ${player.username} (PLAYER ID: ${player.id}) has ${results.combinaison} ! (Room ${room.name} ID: ${room.id})`);

            let newScore = player.score + results.score;
            if (newScore >= 343) {
                sails.log.info(`Player ${player.username} (PLAYER ID: ${player.id}) WON !!! (Room ${room.name} ID: ${room.id})`);
                sails.sockets.broadcast(socketRoomName, 'PLAYER_WON', {
                    player
                });
                res.ok();
            } else {
                await Player.updateOne({id: player.id}, {score: newScore, cul: cul, isPlayersTurn: false});
                let newPlayersTurn = Helpers.findNewRole(player, room.players);
                await Player.updateOne({id: newPlayersTurn.id}, {isPlayersTurn: true});
                if (newPlayersTurn.order === 1) {
                    await Room.updateOne({id: roomId}, {turnCount: room.turnCount + 1});
                    sails.log.info(`Room ${room.name} is now at turn ${room.turnCount} (ROOM ID: ${room.id})`);
                }

                sails.sockets.broadcast(socketRoomName, 'PLAYER_ACTION', {
                    action: 'THROW_CUL',
                    payload: {
                        cul,
                        score: newScore,
                        combinaison: results.combinaison,
                        newPlayersTurn
                    },
                    player,
                });
                res.ok({
                    combinaison: results.combinaison
                });
            }
        }
    }

};