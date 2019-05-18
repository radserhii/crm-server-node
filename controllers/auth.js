const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/User');

module.exports.login = async (req, res) => {
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        const isCheckPassword = bcrypt.compareSync(req.body.password, candidate.password);
        if (isCheckPassword) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id,
            }, keys.jwt, {expiresIn: 60 * 60});
            res.status(200).json({token: `Bearer ${token}`});
        } else {
            res.status(401).json({message: 'Password not check'});
        }
    } else {
        res.status(404).json({message: 'User not found'});
    }
};

module.exports.register = async (req, res) => {
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        res.status(409).json({message: 'Email exist'});
    } else {
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt),
        });

        try {
            await user.save();
            res.status(201).json({message: 'User created'});
        } catch (e) {

        }
    }
};
