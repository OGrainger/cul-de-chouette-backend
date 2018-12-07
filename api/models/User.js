const bcrypt = require('bcryptjs');

module.exports = {
    attributes: {
        username: { type: 'string', required: true },
        password: { type: 'string', required: true },
        players: {
            collection: 'Player',
            via: 'user'
        }
    },

    beforeCreate: (user, next) => {
        bcrypt.genSalt(10, (error, salt) => {
            if (error) return next(error);

            bcrypt.hash(user.password, salt, (error, hash) => {
                if (error) return next(error);

                user.password = hash;
                next()
            })
        })
    },

    isValidPassword: (password, user, callback) => {
        bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) return callback(error);

            if (isMatch) {
                callback(null, true)
            } else callback(new Error('Passwords doesn\'t match'), false)
        })
    }
 };
