'use strict'

const Questions = require('../models/index').questions

async function home (req, h) {
  let data
  try {
    data = await Questions.getLast(10)
  } catch (e) {
    console.error(e)
  }
  return h.view('index', {
    title: 'Home',
    user: req.state.user,
    questions: data
  })
}

function register (req, h) {
  if (req.state.user) {
    return h.redirect('/')
  }
  return h.view('register', {
    title: 'Register',
    user: req.state.user
  })
}

function login (req, h) {
  if (req.state.user) {
    return h.redirect('/')
  }
  return h.view('login', {
    title: 'Login',
    user: req.state.user
  })
}

function notFound (req, h) {
  return h.view('404', {}, { layout: 'error-layout' }).code(404)
}

function fileNotFound (req, h) {
  const response = req.response
  if (response.isBoom && response.output.statusCode === 404) {
    return h.view('404', {}, { layout: 'error-layout' }).code(404)
  }
  return h.continue
}

function ask (req, h) {
  if (!req.state.user) {
    return h.redirect('/login')
  }
  return h.view('ask', {
    title: 'Crear pregunta',
    user: req.state.user
  })
}

module.exports = {
  home,
  register,
  login,
  ask,
  notFound,
  fileNotFound
}
