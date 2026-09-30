'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::media-publication.media-publication');
