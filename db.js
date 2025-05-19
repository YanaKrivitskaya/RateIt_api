const Sequelize = require("sequelize").Sequelize

module.exports = db = {};

initialize();

async function initialize(){
    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {            
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            dialect: "mysql",
            timezone: '+00:00',
        }
    );
    
    db.User = require('./auth/user.model')(sequelize);    
    db.UserToken = require('./auth/userToken.model')(sequelize);    
    db.Otp = require('./auth/otp.model')(sequelize);
    
    //relations
    db.User.hasMany(db.UserToken, {onDelete: 'CASCADE'});
    db.UserToken.belongsTo(db.User);   

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}