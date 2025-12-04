const sequelize = require('./sqlite');
const MemberModel = require('./Member');
const TournamentModel = require('./Tournament');

// Initialize models
const Member = MemberModel(sequelize);
const Tournament = TournamentModel(sequelize);

// Many-to-Many: Members <-> Tournaments
const MemberTournament = sequelize.define(
  'MemberTournament',
  {},
  {
    timestamps: false
  }
);

Member.belongsToMany(Tournament, { through: MemberTournament });
Tournament.belongsToMany(Member, { through: MemberTournament });

const initDb = async () => {
  try {
    console.log('Connecting to DB (SQLite)...');
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync models to DB (creates tables if they do not exist)
    await sequelize.sync();
    console.log('Database models synchronized.');
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

module.exports = {
  sequelize,
  Member,
  Tournament,
  MemberTournament,
  initDb
};
