const userModule = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const foundUser = await userModule.findByToken(refreshToken);
    if (foundUser === undefined || !foundUser[0]) return res.sendStatus(401); // Forbidden

    // Get User Roles
    const foundUserRoles = await userModel.getUserRoles(foundUser[0].id)
    // Destructure User Roles
    foundUser[0]["roles"] = {}
    for (role in foundUserRoles) {
        foundUser[0]['roles'][foundUserRoles[role]["role"]] = foundUserRoles[role]["role_id"]
    }
    // Evaluate JWT 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser[0].username !== decoded.username) return res.sendStatus(403); // Forbidden
            const roles = Object.values(foundUser[0].roles)
            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );
            res.json({ accessToken })
        }
    )
}

module.exports = {
    handleRefreshToken
}