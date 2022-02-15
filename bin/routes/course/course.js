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
      const validate = validatePayload.validatePayload(payload, validatePayload.addCourse)
      if (!validate.err) {
         const addCourse = await domain.addCourse(payload)
         res.status(addCourse.status).send(addCourse.result)
      } else {
         res.status(400).send(validate.data)
      }
   } else {
      res.status(401).send('Unauthorized')
   }
});


router.get('/', basicAuth.isAuthenticated, async (req, res, next) => {

   const validate = validatePayload.validatePayload(req.query, validatePayload.getCourse)
   if (!validate.err) {
      const getAllCourse = await domain.getAllCourse(validate.data)
      res.status(getAllCourse.status).send(getAllCourse.result)
   } else {
      res.status(400).send(validate.data)
   }

});

router.get('/:slug', basicAuth.isAuthenticated, async (req, res, next) => {

   const validate = validatePayload.validatePayload(req.params, validatePayload.detailCourse)
   if (!validate.err) {
      const getDetailCourse = await domain.getDetailCourse(validate.data)
      res.status(getDetailCourse.status).send(getDetailCourse.result)
   } else {
      res.status(400).send(validate.data)
   }

});

router.delete('/:slug', jwtHelper.verifyTokenBasic, async (req, res, next) => {
   const isAdmin = await jwtHelper.isAdmin(req);
   if (isAdmin) {
      const validate = validatePayload.validatePayload(req.params, validatePayload.detailCourse)
      if (!validate.err) {
         const deleteCourse = await domain.deleteCourse(validate.data)
         res.status(deleteCourse.status).send(deleteCourse.result)
      } else {
         res.status(400).send(validate.data)
      }
   } else {
      res.status(401).send('Unauthorized')
   }
})


module.exports = router;