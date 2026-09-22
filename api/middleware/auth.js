import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: 'Access token missing' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' })
      }
      // Varmistetaan, että req.user.userId on aina olemassa, olipa tokenissa id tai userId
      req.user = {
        ...user,
        userId: user.userId || user.id
      }
      next()
    })
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

export { auth }