const bcrypt = require('bcrypt');
const saltRounds = 10;

const getHash = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function(err, hash) {
            if (err) reject(err);
            else {
                resolve(hash);
            };

        });
    });
}

const checkHash = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function(err, result) {
            if (err) reject(err);
            else {
                resolve(result);
            };
        });
    });
}


module.exports = {
    getHash,
    checkHash
}