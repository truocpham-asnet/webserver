// import the necessary modules
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function() {

  // define schema
  var LinkedinScrapedSchema = new Schema({

    url: String,

    linkedinID: String,

    // timestamp
    createdAt: Date
  });

  mongoose.model('DBLinkedInScraped', LinkedinScrapedSchema);
};
