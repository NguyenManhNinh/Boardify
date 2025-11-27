# API Trello - Security Setup Guide

## ⚠️ Important Security Notes

This project contains sensitive configuration. Follow these steps before running:

### 1. Environment Variables Setup

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your actual values
nano .env
```

**Required Environment Variables:**

| Variable        | Description                   | Example                                                                                     |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| `MONGODB_URI`   | MongoDB connection string     | `mongodb+srv://user:pass@cluster.mongodb.net`                                               |
| `DATABASE_NAME` | Database name                 | `trello_db`                                                                                 |
| `APP_HOST`      | Server host                   | `localhost` or `0.0.0.0`                                                                    |
| `APP_PORT`      | Server port                   | `8017`                                                                                      |
| `JWT_SECRET`    | JWT signing secret (CRITICAL) | Use output from: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `AUTHOR`        | Developer name                | Your name                                                                                   |
| `BUILD_MODE`    | Build environment             | `dev`, `test`, or `production`                                                              |

### 2. Generate Secure JWT Secret

```bash
# Generate a strong random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it into `.env` as `JWT_SECRET` value.

### 3. Security Checklist

- [ ] Never commit `.env` file to Git
- [ ] `.env` is in `.gitignore` ✅
- [ ] Generated unique JWT_SECRET for this instance
- [ ] MongoDB URI contains secure credentials
- [ ] Use strong MongoDB password (20+ characters)
- [ ] All `.env*` files are listed in `.gitignore`

### 4. .gitignore Coverage

The `.gitignore` file protects:

- `.env` and all environment files
- Private keys (`*.key`, `*.pem`)
- AWS credentials
- SSH keys
- Node modules
- Build artifacts
- Logs

### 5. Production Deployment

Before deploying to production:

1. Generate new JWT_SECRET in production environment
2. Use separate MongoDB user/password for production
3. Set `BUILD_MODE=production`
4. Ensure all `.env` files are properly excluded
5. Use environment-specific `.env.production` if available

## ❌ What NOT to Do

- ❌ Do NOT commit `.env` file
- ❌ Do NOT push real credentials to Git
- ❌ Do NOT use same JWT_SECRET across environments
- ❌ Do NOT use weak passwords for MongoDB
- ❌ Do NOT disable `.env` protection in `.gitignore`

## ✅ Git Commands Before First Commit

```bash
# Verify .env is ignored
git status

# Should NOT show .env files in output

# Add all files EXCEPT .env
git add .
git commit -m "Initial commit: API Trello with security setup"
```
