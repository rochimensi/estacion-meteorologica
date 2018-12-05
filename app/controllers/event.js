let {Event} = require('../models/event');
let CSVService = require('../shared/csv');

class EventController {

  async post(data) {
    try {
      let event = await Event.create(data);
    } catch(err) {
      throw err;
    }
  }

  async search(req, res) {
    let search = {};
    const skip = parseInt(req.query.page, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;

    if(req.query.from) {
      search.createdAt = {$gte: new Date(req.query.from)};
    }

    if(req.query.to) {
      search.createdAt = {$lte: new Date(req.query.to)};
    }

    let events = await Event.find(search).skip(skip).limit(limit);
    res.status(200).send(events || []);
  }

  async getReport(req, res) {
    let search = {};
    if(req.query.from) {
      search.createdAt = {$gte: new Date(req.query.from)};
    }

    if(req.query.to) {
      search.createdAt = {$lte: new Date(req.query.to)};
    }

    let events = await Event.find(search).lean();

    CSVService.createCsv(events)
      .then(function(fileName) {
        res.status(200).send(fileName);
      })
  }
}

let singleton = new EventController();

module.exports = singleton;
