let {Event} = require('../models/event');

class EventController {

  async post(data) {
    try {
      let event = await Event.create(data);
    } catch(err) {
      throw err;
    }
  }

  async search(req, res) {
    const query = req.query || {};
    const skip = parseInt(query.page, 10) || 0;
    const limit = parseInt(query.limit, 10) || 10;

    let events = await Event.find(query).limit(limit).skip(skip);
    res.status(200).send(events || []);
  }
}

let singleton = new EventController();

module.exports = singleton;
