const userModel = require('../models/user');

const handleGetAllUsers = async (req, res) => {
    const foundUsers = await userModel.getAllUsers()
    res.json(foundUsers)
}

const handleGetUserById = async (req, res) => {
    const foundUser = await userModel.findById(req.params.id)
    if (foundUser === undefined || !foundUser[0]) {
        return res.status(400).json({"message" : `User ID ${req.params.id} not found`})
    }
    // Get User Roles
    const foundUserRoles = await userModel.getUserRoles(foundUser[0].id)
    // Destructure User Roles
    foundUser[0]["roles"] = {}
    for (role in foundUserRoles) {
        foundUser[0]['roles'][foundUserRoles[role]["role"]] = foundUserRoles[role]["role_id"]
    }
    res.json(foundUser)
} 

module.exports = {
    handleGetAllUsers,
    handleGetUserById
}