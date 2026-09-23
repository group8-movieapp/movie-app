import jwt from 'jsonwebtoken'

const { verify } = jwt

const auth = (req, _res, next) => {
    const [scheme, token] = req.get('authorization')?.split(' ') || []
    if (scheme !== 'Bearer' || !token) {
        const error = new Error('Authentication required')
        error.status = 401
        return next(error)
    }
    try {
        req.user = verify(token, process.env.JWT_SECRET)
        return next()
    } catch {
        const error = new Error('Invalid or exipired')
        error.status = 401
        return next(error)
    }
}

export { auth } 
