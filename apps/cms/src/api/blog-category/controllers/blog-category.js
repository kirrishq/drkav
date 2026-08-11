'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog-category.blog-category');
