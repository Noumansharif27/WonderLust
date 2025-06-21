function asyncWrap(fn) {
  return function (req, res, next) {
    fn().catch(next);
  };
}

module.exports = asyncWrap;
