const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.token, "secrethany");
        req.userData = decoded;
    } catch {
        return res.status(401).json({
            message: 'Auth faild'
        });
    }
}