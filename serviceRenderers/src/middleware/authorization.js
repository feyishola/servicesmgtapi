function Authorization(userTypeArr) {
  return (req, res, next) => {
    if (req.user.userType) {
      const category = "serviceProvider";
      if (userTypeArr.includes(category)) {
        return next();
      } else {
        return res
          .status(403)
          .json({ message: "Sorry you dont have permission to this route" });
      }
    } else {
      return res.status(400).json({ message: "Invalid entry" });
    }
  };
}

module.exports = Authorization;
