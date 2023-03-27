module.exports = (() => {
  const success = true;
  return {
    error(req, res, error) {
      res.status(200).send({ success: false, error });
    },

    getAll(req, res, data) {
      const result = {
        success: true,
        data,
      };
      res.status(200).send(result);
    },

    get(req, res, data) {
      const result = {
        success: true,
        data,
      };
      res.status(200).send(result);
    },

    post(req, res, data) {
      const result = {
        success,
        data,
        message: 'Successfully Created',
      };

      res.status(200).send(result);
    },

    put(req, res, data) {
      const result = {
        success,
        data: {
          updateId: data || '',
          message: 'Updated Successfully',
        },
      };
      res.status(200).send(result);
    },

    healthcheck(req, res) {
      const result = {
        success,
      };
      res.status(200).send(result);
    },
  };
})();
