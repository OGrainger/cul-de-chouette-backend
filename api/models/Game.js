module.exports = {
    attributes: {
        player_count: { type: 'number', required: true },
        turn_count: { type: 'number', required: true },
        status: { type: 'string', defaultsTo: 'CREATED' },
        players: {
            collection: 'GamePlayer',
            via: 'game'
        }
    },
};
