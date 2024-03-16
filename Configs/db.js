const { Sequelize } = require('sequelize');

// Connect to the PostgreSQL database
exports.sequelize = new Sequelize('postgres://raj:GYK8RjXCcb5icaI6hRqrJpWdSnHKX288@dpg-cnjg6b6v3ddc738c9h5g-a.singapore-postgres.render.com/whiteboard_0jdp', {
  dialect: 'postgres',
  logging: false,
  ssl: true,
  debug: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
