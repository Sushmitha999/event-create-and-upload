require('dotenv').config();

dbPassword = process.env.DBURL;
module.exports = {
    mongoURI: dbPassword
};
