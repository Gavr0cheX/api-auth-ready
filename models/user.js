const checkHash = require('../util/bcrypt').checkHash;
const db = require('../admin/database')

class User {
    constructor(username, phone, password, fullname) {
        this.username = username;
        this.phone = phone;
        this.password = password;
        this.fullname = fullname;
        this.role = 2001;
    }

    static getAllUsers () {
        let sql = `SELECT * FROM users`
        return db.query(sql)
    }

    static findByUserName(username) {
        let sql = `SELECT * FROM users WHERE username = '${username}' LIMIT 1`
        return db.query(sql)
    }

    static findById(id) {
        let sql = `SELECT * FROM users WHERE id = '${id}' LIMIT 1`;
        return db.query(sql);
    }

    static addRoleToUser(uid, role_id) {
        let sql = `INSERT INTO user_roles (
            uid,
            role_id
        ) VALUES (
            '${uid}',
            '${role_id}'
        )`
        return db.query(sql);
    } 

    static async getUserRoles(id) {
        let sql = `SELECT ref_roles.role , user_roles.role_id FROM user_roles INNER JOIN ref_roles ON user_roles.role_id = ref_roles.id WHERE user_roles.uid = '${id}'`;
        let result = Object.values(JSON.parse(JSON.stringify(await db.query(sql))))
        return result
    }

    static getRolesList() {
        let sql = `select * from ref_roles`
        let result = Object.values(JSON.parse(JSON.stringify(db.query(sql).then(val => val))))
        return result
    }

    static findByToken(token) {
        let sql = `SELECT * FROM users WHERE refreshToken = '${token}' LIMIT 1`
        return db.query(sql)
    }

    static refreshToken(id, refreshToken) {
        let sql = `UPDATE users SET refreshToken = '${refreshToken}' WHERE id = '${id}'`
        return db.query(sql)
    }

    createUser() {
        let sql = `
            INSERT INTO users (
                username, 
                phone, 
                password, 
                fullname
                ) 
                VALUES (
                    '${this.username}',
                    '${this.phone}',
                    '${this.password}',
                    '${this.fullname}'
                )
        `;
        return db.query(sql);
    }
}

module.exports = User