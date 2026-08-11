'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::blog-article.blog-article');
