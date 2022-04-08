const { Router } = require('express');
const Quote = require('../models/Quote');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/', authenticate, (req, res, next) => {

    const quotesOne = Quote.getQuotesOne();
    const quotesTwo = Quote.getQuotesTwo();
    const quotesThree = Quote.getQuotesThree();

    Promise.all([quotesOne, quotesTwo, quotesThree])
      .then((quotesRes) => {
        const allQuotes = quotesRes.map((quotesRes) => quotesRes);
        return allQuotes;
      })
      .then((quotes) => res.send(quotes))
      .catch((error) => next(error));
  });
