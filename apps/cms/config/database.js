const path = require('path');
const fs = require('fs');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  if (client === 'postgres') {
    const sslEnabled = env.bool('DATABASE_SSL', true);
    const sslCaPath = env('DATABASE_SSL_CA_PATH', '');
    const sslRejectUnauthorized = env.bool(
      'DATABASE_SSL_REJECT_UNAUTHORIZED',
      Boolean(sslCaPath),
    );

    if (sslEnabled && sslRejectUnauthorized && !sslCaPath) {
      throw new Error(
        'DATABASE_SSL_CA_PATH is required when DATABASE_SSL_REJECT_UNAUTHORIZED=true.',
      );
    }

    return {
      connection: {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: sslEnabled
            ? {
                rejectUnauthorized: sslRejectUnauthorized,
                ...(sslCaPath
                  ? { ca: fs.readFileSync(sslCaPath, 'utf8') }
                  : {}),
              }
            : false,
        },
        pool: {
          min: env.int('DATABASE_POOL_MIN', 2),
          max: env.int('DATABASE_POOL_MAX', 10),
        },
      },
    };
  }

  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(
          __dirname,
          '..',
          env('DATABASE_FILENAME', '.tmp/data.db'),
        ),
      },
      useNullAsDefault: true,
    },
  };
};
