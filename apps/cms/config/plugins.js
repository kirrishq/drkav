const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

module.exports = ({ env }) => {
  const uploadConfig = {
    security: {
      allowedTypes: allowedMediaTypes,
      deniedTypes: deniedExecutableTypes,
    },
  };

  if (env('UPLOAD_PROVIDER', 'local') === 'aws-s3') {
    Object.assign(uploadConfig, {
      provider: 'aws-s3',
      providerOptions: {
        baseUrl: env('S3_PUBLIC_URL'),
        rootPath: env('S3_ROOT_PATH', ''),
        s3Options: {
          credentials: {
            accessKeyId: env('S3_ACCESS_KEY_ID'),
            secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
          },
          endpoint: env('S3_ENDPOINT'),
          forcePathStyle: env.bool('S3_FORCE_PATH_STYLE', true),
          region: env('S3_REGION', 'ru1'),
          params: {
            Bucket: env('S3_BUCKET'),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    });
  }

  return {
    'users-permissions': {
      config: {
        jwtManagement: 'refresh',
        sessions: {
          httpOnly: true,
        },
      },
    },
    upload: {
      config: uploadConfig,
    },
  };
};
