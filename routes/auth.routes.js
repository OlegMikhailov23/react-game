const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('login', 'Login must be at least 3 characters')
            .isLength({min: 3}),
        check('password', 'Password should be min. 6 characters ')
            .isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data!'
                })
            }

            const {login, password} = req.body;
            const candidate = await User.findOne({login});

            if (candidate) {
                return res.status(400).json({message: 'You know, and we already have one'})
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({login, password: hashedPassword})

            await user.save()

            res.status(201).json({message: 'User has been created'});

        } catch (e) {
            res.status(500).json({message: 'Oops, something goes wrong, try again later'});
        }
    })

// /api/auth/login

router.post(
    '/login',
    [
        check('login', 'Login must be at least 3 characters')
            .isLength({min: 3}),
        check('password', 'Please, еnter password')
            .exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid login data!'
                })
            }

            const {login, password} = req.body;

            const user = await User.findOne({login})

            if (!user) {
                return res.status(400).json({message: 'Invalid password or login :('})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: 'Invalid password or login :('})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );

            res.json({ token, userId: user.id })


        } catch (e) {
            res.status(500).json({message: 'Oops, something goes wrong, try again later'});
        }
    })

module.exports = router
