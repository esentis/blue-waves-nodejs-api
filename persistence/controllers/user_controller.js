const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
var User = require('../models/User.js');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, async (req, res, next) => {

    if (!req.body.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!req.body.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    var userByUsername = await User.find({ username: req.body.username });
    var userByEmail = await User.find({ email: req.body.email });

    if (userByEmail || userByUsername) {
        return res.status(404).json({
            errors: "User already exists"
        });
    }

    var finalUser = new User({
        username: req.body.username,
        email: req.body.email
    })

    finalUser.setPassword(req.body.password);

    await finalUser.save(function (err, finalUser) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).json({ user: finalUser.toAuthJSON() });
        }

    });

});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {

    if (!req.body.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!req.body.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if (err) {
            return res.json(err);
        } else if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({ user: user.toAuthJSON() });
        } else {
            return res.json(info);
        }
    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return User.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }

            return res.json({ user: user.toAuthJSON() });
        });
});

module.exports = router;