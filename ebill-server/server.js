const express = require("express");
const app = express();
const assert = require('assert');
const bodyParser = require("body-parser");
const path = require('path');
const uuid = require('uuid/v4');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const moment = require('moment');
const EBillDAO = require("./eBillDAO");

const actionEnum = {
  PAY : "pay",
  REJECT : "reject"
}

const statusEnum = {
  OPEN : "open",
  PAID : "paid",
  REJECTED : "rejected"
}

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

function validateAction(ebill) {
  return ebill.status === statusEnum.OPEN;
}

function sendEBill(response, ebill, uuid) {
  if (ebill != null) {
    response.send(ebill);
  } else {
    response.send(`An ebill with uuid '${uuid}' could not be found.`);
  }
}

MongoClient.connect("mongodb://NortonCommander86:SIXHackathon2017@ds123930.mlab.com:23930/heroku_fc1fxdlx", function(error, db) {

  assert.equal(error, null);
  console.log("Application successfully connected to database.");

  const ebillDAO = new EBillDAO(db);

  app.use(express.static(path.join(__dirname, "../ebill-client")));
  app.use(bodyParser.json());
  app.set('port', (process.env.PORT || 5000));

  app.get("/api/ebill", (request, response) => {
    ebillDAO.loadAll()
            .toArray() // if 'toArray' is called without arguments, it returns a promise
            .then((documents) => {
              response.send(documents);
            })
  });

  app.get("/api/ebill/:id", (request, response) => {
    const ebillId = request.params["id"];

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

  app.post("/api/ebill", (request, response) => {
    const ebill = request.body;
    try {
      validateProperties(ebill);
      ebill.uuid = uuid();
      ebill.status = statusEnum.OPEN;
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

  app.post("/api/ebill/:id/pay", (request, response) => {
    const uuid = request.params["id"];
    const status = statusEnum.PAID;
    const paidTime = moment().format("DD.MM.YYYY HH:mm:ss");
    let ebill = null;

    ebillDAO.load(uuid)
            .then((result) => {
              ebill = result;
              if (result == null) {
                response.send(`An ebill with uuid '${uuid}' could not be found.`);
                return; // we need to call return here, otherwise another response would be sent and it would lead to a warning
              } else if (validateAction(ebill)) {
                ebillDAO.update(uuid, { "status" : status, "paidTime" : paidTime})
                        .then(() => {
                          ebill.status = status;
                          ebill.paidTime = paidTime;
                        });
              }

              sendEBill(response, ebill, uuid);
            }, (error) => {
              console.error("Error while loading a document: " + error);
              response.send(`An ebill with uuid '${uuid}' could not be loaded.`)
            });
  });

  app.post("/api/ebill/:id/reject", (request, response) => {
    const uuid = request.params["id"];
    const status = statusEnum.REJECTED;
    const rejectedTime = moment().format("DD.MM.YYYY HH:mm:ss");
    let ebill = null;

    ebillDAO.load(uuid)
            .then((result) => {
              ebill = result;
              if (result == null) {
                response.send(`An ebill with uuid '${uuid}' could not be found.`);
                return; // we need to call return here, otherwise another response would be sent and it would lead to a warning
              } else if (validateAction(ebill)) {
                ebillDAO.update(uuid, { "status" : status, "rejectedTime" : rejectedTime})
                        .then(() => {
                          ebill.status = status;
                          ebill.rejectedTime = rejectedTime;
                        })
              }

              sendEBill(response, ebill, uuid);
            }, (error) => {
              console.error("Error while loading a document: " + error);
              response.send(`An ebill with uuid '${uuid}' could not be loaded.`)
            });
  });

  app.get("/", (request, response) => {
    response.send(path.join(__dirname, "../ebill-client/index.html"))
  })

  app.listen(app.get('port'), () => console.log(`Server listening on the port ${app.get('port')} ...`));
});
