const isRoleAccess = (...roles) => {
    return async (req, res, next) => {
        if (!roles.includes(req?.userAuth?.role)) 
            next(new Error("Access Denied, Check your role."));
        else next();
      };
}

module.exports = isRoleAccess;