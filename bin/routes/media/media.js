const express = require('express');
const router = express.Router();
const domain = require('./domain');
const validatePayload = require('../../helpers/schema');
const jwtHelper = require('../../auth/jwt_helper');

router.post('/', jwtHelper.verifyTokenBasic, async (req, res, next) => {
   let payload = {
       ...req.body,
       ...req.files,
       ...req.query
   }

   const validate = validatePayload.validatePayload(payload, validatePayload.mediaValidate)
   if (!validate.err) {
       const uploadMedia = await domain.uploadMedia(validate.data)
       res.status(uploadMedia.status).send(uploadMedia.result)
   } else {
       res.status(400).send(validate.data)
   }
});


module.exports = router;