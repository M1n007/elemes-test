const express = require('express');
const router = express.Router();
const domain = require('./domain');
const validatePayload = require('../../helpers/schema');
const basicAuth = require('../../auth/basic_auth_helper');
const jwtHelper = require('../../auth/jwt_helper');

router.post('/', jwtHelper.verifyTokenBasic, async (req, res, next) => {
   const isAdmin = await jwtHelper.isAdmin(req);

   const payload = {
      ...req.body,
      userId: req.user.userId
   };

   if (isAdmin) {
      const validate = validatePayload.validatePayload(payload, validatePayload.addCategory)
      if (!validate.err) {
         const addCategory = await domain.addCategory(payload)
         res.status(addCategory.status).send(addCategory.result)
      } else {
         res.status(400).send(validate.data)
      }
   } else {
      res.status(401).send('Unauthorized')
   }
});


router.get('/', basicAuth.isAuthenticated, async (req, res, next) => {

   const validate = validatePayload.validatePayload(req.query, validatePayload.getCategory)
   if (!validate.err) {
      const getAllCategory = await domain.getAllCategory(validate.data)
      res.status(getAllCategory.status).send(getAllCategory.result)
   } else {
      res.status(400).send(validate.data)
   }

});

router.delete('/:categoryId', jwtHelper.verifyTokenBasic, async (req, res, next) => {
   const isAdmin = await jwtHelper.isAdmin(req);
   if (isAdmin) {
      const validate = validatePayload.validatePayload(req.params, validatePayload.deleteCategory)
      if (!validate.err) {
         const deleteCategory = await domain.deleteCategory(validate.data)
         res.status(deleteCategory.status).send(deleteCategory.result)
      } else {
         res.status(400).send(validate.data)
      }
   } else {
      res.status(401).send('Unauthorized')
   }
})


module.exports = router;