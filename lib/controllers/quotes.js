const { Router } = require('express');
const fetch = require('cross-fetch');

module.exports = Router()
  .get('/', (req, res) => {

    const urls = [
      'https://programming-quotes-api.herokuapp.com/quotes/random', 
      'https://futuramaapi.herokuapp.com/api/quotes/1', 
      'https://api.quotable.io/random'
    ];

    function getQuotes(urls) {
      return Promise.all(urls.map((url) => fetch(url))).then((response) => {
        return Promise.all(response.map((item) => item.json()));
      });
    }

    function mungeQuotes(item) {
      if (item.en) return item.en;
      if (item.content) return item.content;
      if (item[0]) return item[0].quote;
    }

    getQuotes(urls)
      .then((quotes) => 
        quotes.map((data) => {
          return {
            author: data.author || data[0].character,
            content: mungeQuotes(data),
          };
        })
      )
      .then((mungedArray) => res.send(mungedArray));   
  });
