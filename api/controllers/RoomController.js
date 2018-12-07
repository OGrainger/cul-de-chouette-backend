module.exports = {
    sub: function(req, res) {
        console.log('ATTEMPT');
        if( ! req.isSocket) {
            return res.badRequest();
        }

        sails.sockets.join(req.socket, 'game1');
        sails.sockets.broadcast('game1', 'hello', { howdy: 'hi there!'}, req);
        console.log('OK');
        sails.log.info('OK');

        return res.ok();
    }
};