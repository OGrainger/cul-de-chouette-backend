module.exports = {
    subToAll: async function(req, res) {
        if( ! req.isSocket) {
            return res.badRequest();
        }

        sails.sockets.join(req.socket, 'all_rooms');
        sails.sockets.broadcast('all_rooms', 'NEW_USER', {});
        sails.log.info('User subbed to ALL_ROOMS');

        Room.find({status: 'CREATED'}).exec(function(err, allAvailableRooms){
            if (err) {
                return res.serverError(err);
            }

            // Now we'll subscribe our client socket to each of these records.
            Room.subscribe(req, _.pluck(allAvailableRooms, 'id'));
            return res.ok();

        });
    },
    subToOne: function(req, res) {
        console.log('ATTEMPT');
        console.log(req.isSocket);
        if( ! req.isSocket) {
            return res.badRequest();
        }

        sails.sockets.join(req.socket, 'all_rooms');
        sails.sockets.broadcast('all_rooms', 'hello', { socketCode: 'JOINED'}, req);
        sails.log.info('Socket subbed for all rooms');

        return res.ok();
    },
};