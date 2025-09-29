    export const PGHOST="ep-noisy-violet-adntz7hq-pooler.c-2.us-east-1.aws.neon.tech"
    export const PGUSER="neondb_owner"
    export const PGPASSWORD="npg_ceWf0YDSg2ar"
    export const PGDATABASE="neondb"


    export const config = {
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT || 5432,
        ssl: {
          rejectUnauthorized: false
        }
      };
      
    


    