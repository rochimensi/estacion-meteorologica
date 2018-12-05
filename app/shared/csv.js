let csv = require("fast-csv");
let path = require("path");
let fs = require("fs");
let config = require( "../config");
let logger = require( '../utils/logger');

class CSVService {

  createCsv(rows) {
    let timestamp = new Date();
    let filename = path.join(__dirname, "../public/reports", timestamp.getTime() + ".csv");

    let csvStream = csv.createWriteStream({headers: true});
    let writableStream = fs.createWriteStream(filename);
    csvStream.pipe(writableStream);

    rows.forEach(row => csvStream.write(row));
    csvStream.end();

    return new Promise((resolve, reject) => {
      writableStream.on("error", reject);

      writableStream.on("finish", function () {
        resolve(filename);
      });
    });
  }

}

let singleton = new CSVService();

module.exports = singleton;
