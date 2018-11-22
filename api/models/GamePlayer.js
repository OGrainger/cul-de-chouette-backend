module.exports = {
    attributes: {
        username: { type: 'string', required: true },
        score: { type: 'number', required: true },
        civet: { type: 'number', defaultsTo: 0 },
        grelotine: { type: 'boolean', defaultsTo: false },
        connected: { type: 'boolean', required: true },
        game: { model: 'game' }
    },
};
