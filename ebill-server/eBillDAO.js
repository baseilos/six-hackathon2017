const mongodb = require('mongodb');
const assert = require('assert');

function EBillDAO(database) {

  this.database = database;
  this.collection = this.database.collection("ebill");

  this.save = function(ebill) {
    return this.collection.insertOne(ebill); // returns a promise
  }

  this.load = function(uuid) {
    const query = { "uuid" : uuid };

    return this.collection.findOne(query); // returns a promise
  }

  this.loadAll = function() {
    return this.collection.find().sort({'dueDate': 1});
  }

  this.update = function(uuid, properties) {
    const query = { "uuid" : uuid };
    const update = { "$set" : properties};

    return this.collection.updateOne(query, update); // returns a promise
  }
}

module.exports = EBillDAO;
