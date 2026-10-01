'use strict';

const tableName = 'components_shared_contact_settings';
const urlColumns = [
  'clinic_phone_href',
  'administrator_phone_href',
  'telegram_href',
  'max_href',
  'whatsapp_href',
  'email_href',
  'footer_email_href',
  'footer_whatsapp_href',
];

module.exports = {
  async up(knex) {
    if (
      knex.client.config.client !== 'pg' ||
      !(await knex.schema.hasTable(tableName))
    ) {
      return;
    }

    for (const column of urlColumns) {
      if (await knex.schema.hasColumn(tableName, column)) {
        await knex.raw('alter table ?? alter column ?? type text', [tableName, column]);
      }
    }
  },

  async down(knex) {
    if (
      knex.client.config.client !== 'pg' ||
      !(await knex.schema.hasTable(tableName))
    ) {
      return;
    }

    for (const column of urlColumns) {
      if (await knex.schema.hasColumn(tableName, column)) {
        await knex.raw('alter table ?? alter column ?? type varchar(255)', [tableName, column]);
      }
    }
  },
};
