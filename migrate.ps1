$env:DATABASE_URL='postgresql://neondb_owner:npg_nCEx5Svmjyk1@ep-spring-credit-a1e35kwi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
Write-Output "y" | npx drizzle-kit push
