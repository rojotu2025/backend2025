const config = {
  database: process.env.DATABASE_NAME,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  params: {
    dialect: 'sqlite',
    storage: 'task-db.sqlite',
    define: {
      underscored: true
    },
    operatorsAliases: false
  }
};

module.exports = config