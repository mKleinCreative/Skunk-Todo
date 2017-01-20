
const express = require('express')
const router = express.Router()

const passport = require('passport')
const db = require('../config/database')


const loginRedirects = {
  successRedirect: '/users/login',
  failureRedirect: '/'
}

router.get( '/register', (req, res, next) => {
  res.render('register')
})

router.post( '/register', (req, res) => {
  const { email, password } = req.body

  db.createUser( email, password )
    .then( user => {
      req.login( user, error => {
        if( error ) {
          return next( error )
        }
        res.redirect('/login')
      })
    })
})

router.get( '/login', (req, res, next) => {
  console.log('$$$$ req.user::', req.user)
  res.render('landing', { user: req.user})
})

router.post('/login', passport.authenticate( 'local', loginRedirects ))

router.get( '/logout', (request, response) => {
  request.logout()
  response.redirect( '/' )
})


module.exports = router
