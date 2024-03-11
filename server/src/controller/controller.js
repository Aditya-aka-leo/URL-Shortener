const url_design = require("../models/model");
const getClient = require("../utils/redis");
const { connectDB } = require("../utils/mongo");
const { create_token_range, hash_gen, range } = require("../utils/ZooKeeper");
const mongoose = require("mongoose");
const post_url = async (req, res) => {
  let rd_client;

  if (range.curr < range.end - 1 && range.curr != 0) {
    range.curr++;
  } else {
    await create_token_range();
    range.curr++;
  }
  try {
    rd_client = await getClient.getClient();
    await url_design
      .findOne({ original_url: req.body.original_url })
      .then(async (url_exsist) => {
        if (url_exsist) {
          let new_url = "bitly_clone.com/" + url_exsist.hashed_key;
          res.json(new_url);
        } else {
          hash = hash_gen(range.cur);
          await url_design
            .create({
              hashed_key: hash,
              original_url: req.body.original_url,
              CreatedAt: new Date(),
            })
            .then((url) => {
              rd_client.set(
                url.hashed_key.toString(),
                url.original_url.toString(),
                84600
              );
              let new_url = "bitly_clone.com/" + url.hashed_key;
              res.json(new_url);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log("There was some problem searching in DB", err);
      });
  } catch (err) {
    console.log("Error during connection setup:", err);
  }
};

const get_url = async (req, res) => {
  let rd_client, mongo_client;
  try {
    rd_client = await getClient.getClient();

    mongo_client = await connectDB();

    await rd_client
      .get(req.params.identifier)
      .then(async (redis_data) => {
        if (redis_data != null) {
          console.log("it came from redis cache");
          let new_url = "http://" + redis_data;
          res.redirect(new_url);
        } else {
          await url_design
            .findOne({ hashed_key: req.params.identifier })
            .then(async (url_exsist) => {
              if (url_exsist) {
                let new_url = "http://" + url_exsist.original_url;
                res.redirect(new_url);
              } else res.status(202);
            })
            .catch((err) => {
              console.log("the error is getting data from redis");
            });
        }
      })
      .catch((err) => {
        console.log("error reading data from redis");
        res.json(202);
      });
  } catch (err) {
    console.log("error building the connection from redis");
  }
};

module.exports = { post_url, get_url };
