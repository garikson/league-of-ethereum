export default eth => function getTransactionSuccess(txHash, callback) {
  const cb = callback || function cb() {};
  const timeout = 270000;
  let count = 0;
  return new Promise((resolve, reject) => {
    const txInterval = setInterval(() => {
      eth.getTransactionReceipt(txHash, (err, result) => {
        if (err) {
          clearInterval(txInterval);
          cb(err, null);
          reject(err);
        }

        if (!err && result) {
          clearInterval(txInterval);
          cb(null, result);
          resolve(result);
        }
      });

      if (count >= timeout) {
        clearInterval(txInterval);
        const errMessage = `Receipt timeout waiting for tx hash: ${txHash}`;
        cb(errMessage, null);
        reject(errMessage);
      }
      count += 7000;
    }, 7000);
  });
};
