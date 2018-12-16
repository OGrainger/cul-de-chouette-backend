module.exports = {
    findNewRole: (player, players) => {
        let newPlayerRole = players.find(p => player.order + 1 === p.order);
        if (!newPlayerRole) {
            return players.find(p => p.order === 1);
        }
        return newPlayerRole;
    }
};
