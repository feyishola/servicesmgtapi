// Allows the request through only when the signed-in user's type is in `userTypeArr`
function Authorization(userTypeArr) {
  return (req, res, next) => {
    if (userTypeArr.includes(req.user?.userType)) return next();
    return res
      .status(403)
      .json({ response: false, payload: "You don't have permission to do that" });
  };
}

module.exports = Authorization;
