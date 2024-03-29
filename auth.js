const jwtSecret = "your_jwt_secret"; //This has to be the same key used in the JWTStrategy

const jwt = require("jsonwebtoken"),
  passport = require("passport");
const extractors = require("passport-jwt/lib/extract_jwt");

require("./passport"); //Your local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, //the username you're encoding in the JWT
    expiresIn: "7d", //the token will expire in 7 days
    algorithm: "HS256", //algorithm used to "sign" or encode the values of the JWT
  });
};

/**
 * Login the user
 * @param {string} user
 * @param {string} password
 * @returns {string} a valid token
 */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "There is a user or password not valid",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
