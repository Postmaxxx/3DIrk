const { Router } = require("express")
const User = require("../models/User")
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const router = Router()
const jwt = require('jsonwebtoken')

//api/outh/register
router.post('/register', 
    [
        check('email', 'Wrong email').isEmail(),
        check('password', 'Password should be at least 8 symbols').isLength({ min: 8 }),
        check('name', 'Name should be at least 2 symbols').isLength({ min: 2 }),
        check('phone', 'Phone should be at least 6 symbols').isLength({ min: 6 }).isMobilePhone(),
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Wrong data during registration"
            })
        }

        try {
            const {email, password, name, phone} = req.body

            const candidate = await User.findOne({ email })
            if( candidate) {
                return res.status(400).json({message : 'User already exists'})
            }

            const hashedPassord = await bcrypt.hash(password, process.env.salt)

            const user = new User({ email, password: hashedPassord, name, phone })
            await user.save()

            res.status(201).json({message: 'User created'})


        } catch (error) {
            res.status(500).json({ message: 'Something wrong with server, try again later'})
        }
    }
)







router.post('/login',
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Password must exists').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Wrong data during login"
            })
        }

        try {
            const {email, password } = req.body
            
            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: 'User not found'})
            }

            const passwordsSame = await bcrypt.compare(password, user.passowrd)

            if (!passwordsSame) {
                return res.status(400).json({ message: 'Password is incorrect'})
            }

            const token = jwt.sign(
                {userId: user.id},
                process.env.jwtSecret,
                { expiresIn: "1h"}
            )

            res.json({token, user: user.id})

        } catch (error) {
            res.status(500).json({ message: 'Something wrong with server, try again later'})
        }
    }
)

module.exports = router