/**
 * Restrict route access to given roles.
 * Use after auth middleware (req.user must exist).
 * @param {string[]} allowedRoles - e.g. ['admin'], ['instructor', 'admin'], ['student']
 */
const roleCheck = (allowedRoles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: 'Not authorized.' });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied. Insufficient role.' });
  }
  next();
};

module.exports = { roleCheck };
