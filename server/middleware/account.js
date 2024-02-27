const jwt = require('jsonwebtoken')

const account_middleware = async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.send({ success: false, message: 'Access denied, Please check if token has send' })
    }
    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (_id) {
            req.accountId = _id
            next();
        }
        else {
            return res.send({ success: false, message: 'Cannot find _id' })
        }
    }
    catch (err) {
        return res.send({ success: false, message: err.message })
    }
}

module.exports = account_middleware