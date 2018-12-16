module.exports = {
    autosubscribe: ['destroy', 'update'],
    attributes: {
        name: { type: 'string', required: true},
        turnCount: { type: 'number', defaultsTo: 1 },
        status: { type: 'string', defaultsTo: 'ACTIVE' },
        players: {
            collection: 'Player',
            via: 'room'
        }
    },
};
