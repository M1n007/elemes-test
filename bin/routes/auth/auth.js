const express = require('express');
const router = express.Router();
const domain = require('./domain');
const validatePayload = require('../../helpers/schema');
const basicAuth = require('../../auth/basic_auth_helper');
const jwtHelper = require('../../auth/jwt_helper');


router.get('/', jwtHelper.verifyTokenBasic, async (req, res, next) => {

   const isAdmin = await jwtHelper.isAdmin(req);
   if (isAdmin) {
      const validate = validatePayload.validatePayload(req.query, validatePayload.getUser)
      if (!validate.err) {
         const getAllUser = await domain.getAllUser(validate.data)
         res.status(getAllUser.status).send(getAllUser.result)
      } else {
         res.status(400).send(validate.data)
      }
   } else {
      res.status(401).send('Unauthorized')
   }

});

router.get('/analythic', jwtHelper.verifyTokenBasic, async (req, res, next) => {

   const isAdmin = await jwtHelper.isAdmin(req);
   if (isAdmin) {
      const analythic = await domain.analythic()
      res.status(analythic.status).send(analythic.result)
   } else {
      res.status(401).send('Unauthorized')
   }

});

router.put('/:userId', jwtHelper.verifyTokenBasic, async (req, res, next) => {
   const payload = {
      userId: req.params.userId,
      ...req.body
   }
   const validate = validatePayload.validatePayload(payload, validatePayload.updateUser)
   if (!validate.err) {
      const updateUser = await domain.updateUser(validate.data)
      res.status(updateUser.status).send(updateUser.result)
   } else {
      res.status(400).send(validate.data)
   }
})

router.get('/:userId', jwtHelper.verifyTokenBasic, async (req, res, next) => {
   const validate = validatePayload.validatePayload(req.params, validatePayload.getOneUser)
   if (!validate.err) {
      const getDetailUser = await domain.getDetailUser(validate.data)
      res.status(getDetailUser.status).send(getDetailUser.result)
   } else {
      res.status(400).send(validate.data)
   }
})

router.post('/register', basicAuth.isAuthenticated, async (req, res, next) => {
   const validate = validatePayload.validatePayload(req.body, validatePayload.registers)
   if (!validate.err) {
      const register = await domain.register(req.body)
      res.status(register.status).send(register.result)
   } else {
      res.status(400).send(validate.data)
   }
})

router.post('/auth', basicAuth.isAuthenticated, async (req, res, next) => {
   const validate = validatePayload.validatePayload(req.body, validatePayload.signIn)
   if (!validate.err) {
      const sigIn = await domain.sigIn(req.body)
      res.status(sigIn.status).send(sigIn.result)
   } else {
      res.status(400).send(validate.data)
   }
})

router.delete('/:userId', jwtHelper.verifyTokenBasic, async (req, res, next) => {
   const isAdmin = await jwtHelper.isAdmin(req);
   if (isAdmin) {
      const validate = validatePayload.validatePayload(req.params, validatePayload.getOneUser)
      if (!validate.err) {
         const deleteUser = await domain.deleteUser(validate.data)
         res.status(deleteUser.status).send(deleteUser.result)
      } else {
         res.status(400).send(validate.data)
      }
   } else {
      res.status(401).send('Unauthorized')
   }
})

module.exports = router;