const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Event = require('../models/Event');
const User = require('../models/User');
var fs = require('fs');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async(req, res) =>{
  const events = await Event.find().sort({ dateTime: 'desc' })
  res.render('dashboard', {
    user: req.user,
    events: events
  })}
);

// Get unique event names
router.get('/new', ensureAuthenticated, async(req, res) => {
  const event_names = await Event.distinct("name")
  const users = await User.find()
  res.render('new', { 
    user: req.user,
    event_names: event_names,
    event: new Event(),
    users: users
  })
});

// Add an event
router.post('/', async (req, res, next) => {
  req.event = new Event()
  next()
  req.flash(
    'success_msg',
    'You have successfully created a new event'
  );
}, saveEventAndRedirect('new'))

// Edit an event
router.get('/edit/:id', async (req, res) => {
  const event_names = await Event.distinct("name")
  const event = await Event.findById(req.params.id)
  const users = await User.find()
  eventCoordinators = []
  arr = event.coordinators
  for(i=0;i<users.length;i++){
    if(arr.includes(users[i].email)){
      eventCoordinators[i]=true
    }
    else{
      eventCoordinators[i]=false
    }
  }
  arr2 = event.sponser
  eventSponser = []
  for(i=0;i<3;i++){
    eventSponser[i]=false
  }
  if(arr2.includes("Ullas")){
      eventSponser[0]=true
  }
  if(arr2.includes("Purdue University")){
      eventSponser[1]=true
  }    
  if(arr2.includes("S.O.S")){
    eventSponser[2]=true
  }
  var myfiles=[];
  var dir = './public/'+`${event.id}`;

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    }
  var arrayOfFiles = fs.readdirSync('./public/'+`${event.id}`);
  arrayOfFiles.forEach( function (file) {
    myfiles.push(file);
});

  res.render('edit', { 
    event: event,
    event_names: event_names,
    curr_event: event.name,
    eventclass : event.eventClass,
    eventCoordinates: eventCoordinators,
    users: users,
    files : myfiles
  })
})

// Update the event
router.put('/:id', async (req, res, next) => {
  req.event = await Event.findById(req.params.id)
  var myfiles=[];
  var arrayOfFiles = fs.readdirSync('./public/'+`${req.path}`);
  arrayOfFiles.forEach( function (file) {
    myfiles.push(file);
  });
  for(i=0;i<myfiles.length;i++){
    if(req.body[myfiles[i]]){
      fs.unlinkSync('./public/'+`${req.path}`+'/'+myfiles[i]);
    }
  }
  next()
}, saveEventAndRedirect('edit'))


function saveEventAndRedirect(path) {
  return async (req, res) => {
    let event = req.event
    let users = await User.find()
    if(req.body['newChecked']){
      event.name = req.body.newEvent
    }
    else{
      event.name = req.body.name
    }
    event.coordinators = []
    for(i=0;i<users.length;i++){
      if(req.body[users[i].name]){
        event.coordinators.push(users[i].email)
      }
    }
    event.dateTime = req.body.dateTime
    event.location = req.body.location
    event.eventClass = req.body.eventClass
    event.description = req.body.description
    let sponser1 = req.body['sponser1']
    let sponser2 = req.body['sponser2']
    let sponser3 = req.body['sponser3']
    event.sponser = []
    if(sponser1)
    {
      event.sponser.push("Ullas")
    }
    if(sponser2)
    {
      event.sponser.push("Purdue University")
    }
    if(sponser3)
    {
      event.sponser.push("S.O.S")
    }
    try {
      event = await event.save()
        req.flash(
    'success_msg',
    'You have successfully created a new event'
  ); 
  var dir = './public/'+`${event.id}`;

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    }
      res.redirect(`/`)
    } catch (e) {
      res.render('error_mes')
    }
  }
}

module.exports = router;
