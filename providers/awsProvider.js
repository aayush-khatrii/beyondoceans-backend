export const awsS3CredProvider = {
  credentials: {
    accessKeyId: Bun.env.S3_AWS_ACCESSKEY,
    secretAccessKey: Bun.env.S3_AWS_SECRET_ACCESSKEY
  },
  region: Bun.env.AWS_REGION
}

export const awsDBCredProvider= {
  credentials: {
    accessKeyId: Bun.env.AWS_DB_ACCESSKEY,
    secretAccessKey: Bun.env.AWS_DB_SECRET_ACCESSKEY
  },
  region: Bun.env.AWS_REGION
}

export const awsSESCredProvider= {
  credentials: {
    accessKeyId: Bun.env.SES_AWS_ACCESSKEY,
    secretAccessKey: Bun.env.SES_AWS_SECRET_ACCESSKEY
  },
  region: Bun.env.AWS_REGION
} 