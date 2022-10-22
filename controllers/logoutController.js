const userModel = require('../models/user');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No Content
    const refreshToken = cookies.jwt;

    // Evaluate refresh token
    const foundUser = await userModel.findByToken(refreshToken);
    if (foundUser == undefined || !foundUser[0])  {
        res.clearCookie('jwt', {httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000});
        return res.sendStatus(403);
    }

    // Delete refresh token from db
    await userModel.refreshToken(foundUser[0].id,null);

    res.clearCookie('jwt', {httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000});
    res.sendStatus(204);
}

module.exports = {
    handleLogout
}