module.exports = {
    autosubscribe: ['destroy', 'update'],
    attributes: {
        //user: { model: 'user' },
        username: { type: 'string', required: true},
        isPlayersTurn: { type: 'boolean', defaultsTo: false },
        order: { type: 'number', defaultsTo: 0 },
        chouette1: { type: 'number' },
        chouette2: { type: 'number' },
        cul: { type: 'number' },
        score: { type: 'number', defaultsTo: 0 },
        civets: { type: 'number', defaultsTo: 0 },
        grelotine: { type: 'boolean', defaultsTo: false },
        connected: { type: 'boolean', defaultsTo: true },
        room: { model: 'room' }
    }
 };
