const bcrypt = require('bcryptjs');

module.exports = {
    autosubscribe: ['destroy', 'update'],
    attributes: {
        user: { model: 'user' },
        is_game_master: {type: 'boolean', defaultsTo: false},
        score: { type: 'number', defaultsTo: 0 },
        civets: { type: 'number', defaultsTo: 0 },
        grelotine: { type: 'boolean', defaultsTo: false },
        connected: { type: 'boolean', defaultsTo: true },
        room: { model: 'room' }
    }
 };
