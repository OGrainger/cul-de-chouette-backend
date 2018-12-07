module.exports = {
    login: async (req, res) => {
        const {username, password} = req.allParams();

        const user = await User
            .findOne({username})
            .catch(error => res.serverError(error));

        if (!user) return res.forbidden();

        User.isValidPassword(password, user, (error, isValid) => {
            if (error) return res.serverError(error);
            if (!isValid) return res.forbidden();

            sails.log.info('User logged in', user);

            return res.json({
                xToken: TokenService.issue({id: user.id}),
                cookie: CryptographyService.encrypt(user.id)
            })
        })
    },
    register: async (req, res) => {
        const {username, password} = req.allParams();

        const checkedUser = await User
            .findOne({username})
            .catch(error => res.serverError(error));

        if (checkedUser) return res.conflict();

        const createdUser = await User.create({username, password}).fetch();

        sails.log.info('User logged in', createdUser);

        return res.json({
            xToken: TokenService.issue({id: createdUser.id}),
            cookie: CryptographyService.encrypt(createdUser.id)
        });
    }
};
