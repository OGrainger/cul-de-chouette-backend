module.exports = {

    sub: function(req, res) {
        if( ! req.isSocket) {
            return res.badRequest();
        }
        console.log(req);
        //sails.sockets.join(req.socket, 'all_rooms');
        //sails.sockets.broadcast('all_rooms', 'hello', { socketCode: 'JOINED'}, req);
        //sails.log.info('Socket subbed for all rooms');

        return res.ok();
    },
};