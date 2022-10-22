const bcrypt = require('bcrypt');
const userModel = require('../models/user')


const handleNewUser = async (req, res) => {
    const { username, phone, password, fullname } = req.body;
    if (!username || !phone || !password || !fullname) return res.sendStatus(400);
    // Check for dublicate userName or Phone
    const duplicate = await userModel.findByUserName(username);
    if (duplicate.length > 0) return res.sendStatus(409); //Conflict
    try {
        //encrypt the password
        const hashedPWD = await bcrypt.hash(password, 10);
        //store the new user
        let newUser = new userModel(username, phone, hashedPWD, fullname);
        newUser = await newUser.createUser()
        createdUser = await userModel.findByUserName(username);
        await userModel.addRoleToUser(createdUser[0].id, 2001)
        res.status(200).json({ 'message': `user: ${username} created successfuly` });
    } catch (err) {
        res.sendStatus(500);
    }

}

module.exports = {
    handleNewUser
}