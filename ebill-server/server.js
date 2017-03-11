const express = require("express");
const assert = require('assert');
const bodyParser = require("body-parser");
const uuid = require('uuid/v4');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const moment = require('moment');
const EBillDAO = require("./ebillDAO");

function validateProperty(ebill, property) {
  if (!ebill[property]) {
    throw Error(property + " is required");
  }
}

function validateProperties(ebill) {
  validateProperty(ebill, "senderIdentification");
  validateProperty(ebill, "receiverBankAccount");
  validateProperty(ebill, "text");
  validateProperty(ebill, "amount");
  validateProperty(ebill, "currency");
  validateProperty(ebill, "dueDate");
}

MongoClient.connect('mongodb://localhost:27017/ebill', function(error, db) {
  assert.equal(error, null);
  console.log("Application successfully connected to database.");

  const ebillDAO = new EBillDAO(db);

  const app = express()
        .use(bodyParser.json())
        .post("/ebill", (request, response) => {
          var ebill = request.body;
          try {
            validateProperties(ebill);
            ebill.uuid = uuid();
            ebill.status = "open";
            ebill.openTime = moment().format("DD.MM.YYYY HH:mm:ss");

            ebillDAO.save(ebill)
                    .then(() => {
                      response.send({uuid: ebill.uuid});
                    }, (error) => {
                      console.error("Error while inserting an ebill: " + error);
                      response.status(500).send(error);
                    })

          } catch (ex) {
            response.status(500).send(ex.toString());
          }
        })
        .get("/ebill", (request, response) => {
          ebillDAO.loadAll()
                  .toArray() // if 'toArray' is called without arguments, it returns a promise
                  .then((documents) => {
                    response.send(documents);
                  })
        })
        .get("/ebill/:id", (request, response) => {
          ebillId = request.params["id"];

          ebillDAO.load(ebillId)
                  .then((result) => {
                    if (result != null) {
                      response.send(JSON.stringify(result));
                    } else {
                      response.send(`An ebill with uuid '${ebillId}' could not be found.`);
                    }
                  }, (error) => {
                    console.error("Error while loading a document: " + error);
                    response.send(`An ebill with uuid '${ebillId}' could not be loaded.`)
                  });
        })
        .post("/ebill/:id/pay", (request, response) => {
          const uuid = request.params["id"];
          const properties = { "status" : "paid", "paidTime" : moment().format("DD.MM.YYYY HH:mm:ss")};
          ebillDAO.update(uuid, properties)
                  .then(() => {
                    return ebillDAO.load(uuid);
                  })
                  .then((ebill) => {
                    response.send(ebill);
                  })
        })
        .post("/ebill/:id/reject", (request, response) => {
          const uuid = request.params["id"];
          const properties = { "status" : "rejected", "rejectedTime" : moment().format("DD.MM.YYYY HH:mm:ss")};
          ebillDAO.update(uuid, properties)
                  .then(() => {
                    return ebillDAO.load(uuid);
                  })
                  .then((ebill) => {
                    response.send(ebill);
                  })
        });

  app.listen(3000, () => {
    console.log("Server listening on port 3000 ...");
  });
});
