export const adminMw = (roles) => (req, res, next) => {
  const userRole = req.loggedUser?.role; 
  if (!roles.includes(userRole)) {
    return res.status(403).json({ message: "Forbidden: insufficient permissions" });
  }
  next();
};