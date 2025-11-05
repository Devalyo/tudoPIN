
function logger(req, res, next) {
  const logDetails = {
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    ip: req.ip || req.socket?.remoteAddress,
  };

  if (req.body && Object.keys(req.body).length > 0) {
    const cleanBody = { ...req.body };
    delete cleanBody.password;
    delete cleanBody.confirmPassword;
    logDetails.payload = cleanBody;
  }

  const originalSend = res.send;
  res.send = function (body) {
    logDetails.statusCode = res.statusCode;
    console.log(JSON.stringify(logDetails));
    return originalSend.apply(this, arguments);
  };

  next();
}

export {logger};
