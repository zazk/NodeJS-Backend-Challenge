module.exports = function(req, res, next) {
  const tokenRecived = req.headers.authorization;
  if (tokenRecived === process.env.API_AUTH_TOKEN) {
    next();
  } else if (tokenRecived) {
    res.status(400).json({
      error: `Token '${tokenRecived}' is not valid`
    });
  } else {
    res.status(403).json({
      error: `Header 'Authorization' is required`
    });
  }
};
