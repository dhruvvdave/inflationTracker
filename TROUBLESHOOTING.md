# Troubleshooting Guide

Common issues and solutions for setting up InflationLens.

## Database Connection Issues

### Error: "ECONNREFUSED" or "Connection refused"

**Cause:** The database server is not running.

**Solutions:**

1. **If using Docker:**
   ```bash
   docker-compose up -d
   docker-compose ps  # Verify it's running
   ```

2. **If using local PostgreSQL:**
   ```bash
   # macOS
   brew services start postgresql@15
   brew services list  # Verify it's running
   
   # Linux
   sudo systemctl start postgresql
   sudo systemctl status postgresql
   ```

3. **If using Supabase:**
   - Check your Supabase project status at [supabase.com](https://supabase.com)
   - Ensure you're using the correct connection string from Settings → Database

### Error: "User 'postgres' was denied access on the database" or "authentication failed"

**Cause:** Incorrect credentials or insufficient permissions.

**Solutions:**

1. **Check your DATABASE_URL in .env:**
   - Ensure username and password are correct
   - Password should not contain special characters that need URL encoding

2. **For local PostgreSQL, grant proper permissions:**
   ```bash
   # Connect to the database
   psql inflationlens
   
   # Grant all privileges
   GRANT ALL PRIVILEGES ON DATABASE inflationlens TO postgres;
   GRANT ALL ON SCHEMA public TO postgres;
   GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
   GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
   ```

3. **Create a new user with proper permissions:**
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Create user and database
   CREATE USER inflationuser WITH PASSWORD 'yourpassword';
   CREATE DATABASE inflationlens OWNER inflationuser;
   GRANT ALL PRIVILEGES ON DATABASE inflationlens TO inflationuser;
   
   # Update your .env
   DATABASE_URL="postgresql://inflationuser:yourpassword@localhost:5432/inflationlens"
   ```

### Error: "database 'inflationlens' does not exist"

**Cause:** Database hasn't been created yet.

**Solutions:**

1. **Using local PostgreSQL:**
   ```bash
   createdb inflationlens
   ```

2. **Using psql:**
   ```bash
   psql postgres
   CREATE DATABASE inflationlens;
   \q
   ```

3. **Using Docker:**
   ```bash
   # Database is created automatically with docker-compose
   docker-compose up -d
   ```

4. **Using Supabase:**
   - Database is created automatically with your project
   - Use the database name from your Supabase connection string (usually "postgres")

### Error: "Port 5432 is already in use"

**Cause:** Another PostgreSQL instance is already running on port 5432.

**Solutions:**

1. **Stop the conflicting service:**
   ```bash
   # macOS
   brew services stop postgresql@15
   
   # Linux
   sudo systemctl stop postgresql
   ```

2. **Or use a different port in docker-compose.yml:**
   ```yaml
   ports:
     - "5433:5432"  # Use port 5433 on host
   ```
   
   Then update your DATABASE_URL:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/inflationlens"
   ```

3. **Find what's using the port:**
   ```bash
   # macOS/Linux
   lsof -i :5432
   
   # Kill the process if needed
   kill -9 <PID>
   ```

## Prisma Migration Issues

### Error: "Prisma schema file not found"

**Solution:**
```bash
# You're probably in the wrong directory
cd /path/to/inflationTracker
ls prisma/schema.prisma  # Verify schema exists
```

### Error: "Migration failed" or "Schema is out of sync"

**Solutions:**

1. **Reset the database (⚠️ This will delete all data):**
   ```bash
   npx prisma migrate reset --force
   npx prisma generate
   npx prisma migrate dev
   ```

2. **Or create a new migration:**
   ```bash
   npx prisma migrate dev --name fix-schema
   ```

### Error: "Prisma Client did not initialize yet"

**Solution:**
```bash
# Generate Prisma Client
npx prisma generate

# Then restart your dev server
npm run dev
```

## FRED API Issues

### Error: "FRED API key is required"

**Solution:**
1. Get a free API key from [https://fred.stlouisfed.org/docs/api/api_key.html](https://fred.stlouisfed.org/docs/api/api_key.html)
2. Add it to your `.env` file:
   ```
   FRED_API_KEY="your_api_key_here"
   ```

### Error: "FRED API rate limit exceeded"

**Solution:**
- Wait a few minutes and try again
- FRED API has a rate limit of 120 requests per minute
- If running `npm run refresh:cpi`, wait between runs

## Build and Runtime Issues

### Error: "Cannot find module '@prisma/client'"

**Solution:**
```bash
npm install
npx prisma generate
```

### Error: "Module not found" or other TypeScript errors

**Solution:**
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
npm run dev
```

### Error: "Port 3000 is already in use"

**Solution:**
```bash
# Find and kill the process using port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

## Environment Variable Issues

### Error: "Cannot read environment variable"

**Solutions:**

1. **Ensure .env file exists:**
   ```bash
   cp .env.example .env
   # Then edit .env with your values
   ```

2. **Restart your dev server after changing .env:**
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

3. **For client-side variables, use NEXT_PUBLIC_ prefix:**
   ```
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

## Getting Help

If you're still experiencing issues:

1. **Check the logs:**
   ```bash
   # Docker logs
   docker-compose logs postgres
   
   # Application logs
   npm run dev  # Check console output
   ```

2. **Verify your setup:**
   ```bash
   npm run setup:db
   ```

3. **Test database connection:**
   ```bash
   curl http://localhost:3000/api/health
   ```

4. **Open an issue on GitHub:**
   - Include error messages
   - Include your OS and Node.js version
   - Include relevant logs (remove sensitive data like passwords!)

## Quick Setup Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL running (Docker, local, or Supabase)
- [ ] `.env` file created with DATABASE_URL
- [ ] Ran `npm install`
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma migrate dev`
- [ ] FRED_API_KEY added to `.env`
- [ ] Ran `npm run refresh:cpi`
- [ ] App starts with `npm run dev`
- [ ] Can access http://localhost:3000

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Supabase Documentation](https://supabase.com/docs)
