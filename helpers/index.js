function tryCatchWrapper(endpointFn) {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

function createNotFoundHttpError() {
  const err = new Error("Not found");
  err.status = 404;
  return err;
}

module.exports = {
  tryCatchWrapper,
  createNotFoundHttpError,
};
