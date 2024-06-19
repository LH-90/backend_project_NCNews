# Northcoders News API

## Description

This project aims to build an API that mimics the functionality of a backend service similar to Reddit. It includes various RESTful API endpoints for fetching, adding, updating and deleting data. Built using JavaScript, it interfaces with a PostgreSQL database named nc_news containing 4 tables: topics, articles, comments and users. 

https://backend-project-nc-news-avuk.onrender.com/api

## Getting started

Once you've cloned the repo, you will need to create two .env files in order to successfully connect to the two databases locally: 

- `.env.development`: add `PGDATABASE=nc_news`
- `.env.test`: add `PGDATABASE=nc_news_test`

Then, install the dependencies:
- node.js
- postgreSQL
- express
- jest
- supertest
- pg-format
- husky

Run the tests to ensure everything is working correctly.


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
