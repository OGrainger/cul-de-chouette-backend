/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {

    if (await User.count() > 0) {
      return;
    }

    await User.createEach([
      { username: 'oscar', password: '1234', },
      { username: 'clem', password: '1234', },
    ]);

    await Room.create({ name: 'Salle 1'});
};
