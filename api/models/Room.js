module.exports = {
    autosubscribe: ['destroy', 'update'],
    attributes: {
        name: { type: 'string', required: true},
        turn_count: { type: 'number', defaultsTo: 0 },
        status: { type: 'string', defaultsTo: 'CREATED' },
        players: {
            collection: 'Player',
            via: 'room'
        }
    },
};
