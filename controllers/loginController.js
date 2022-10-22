const bcrypt = require('bcrypt');
const userModel = require('../models/user');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()

const handleLogin = async (req, res) => {
    // Destructure request body
    const { username, password } = req.body;
    // Validate login data
    if (!username || !password) return res.sendStatus(400);
    // Query username
    const foundUser = await userModel.findByUserName(username);
    // Evaluate username
    if (!foundUser[0]) return res.sendStatus(401);
    // Evaluate passowrd
    const match = await bcrypt.compare(password, foundUser[0].password)
    if (match) {
        // Get User Roles
        const foundUserRoles = await userModel.getUserRoles(foundUser[0].id)
        // Destructure User Roles
        foundUser[0]["roles"] = {}
        for (role in foundUserRoles) {
            foundUser[0]['roles'][foundUserRoles[role]["role"]] = foundUserRoles[role]["role_id"]
        }
        const roles = Object.values(foundUser[0].roles)
        // Create JWTs
        const accessToken = jwt.sign(
            {
                "userInfo": {
                    "username": foundUser[0].username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        )
        const refreshToken = jwt.sign(
            { "username": foundUser[0].username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1m' }
        )

        await userModel.refreshToken(foundUser[0].id, refreshToken)

        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    handleLogin
}