"use strict";

// Strapi core APIs use CommonJS factories in generated JavaScript files.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::price-item.price-item");
