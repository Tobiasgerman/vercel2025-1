    export const PGHOST="ep-dry-hill-ac0grk5v-pooler.sa-east-1.aws.neon.tech"
    export const PGUSER="neondb_owner"
    export const PGPASSWORD="npg_IFHtBqUfn1C9"
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
      
    


    