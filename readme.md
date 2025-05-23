## 📘 Project Setup Guide

This guide will help you set up and run the project using Docker. Please follow the steps below carefully.

---

### (If running for the first time then follow step 1 and 2. Otherwise, skip them and just start the application)

---

## 🗃️ Step 1: Load Database Backup into PostgreSQL

To restore the initial database from a backup file into the PostgreSQL container, run:

```
docker compose up postgres
```

(After DB is created, press CTRL+C)

💡 This step ensures the application has access to the required database schema and seed data.

---

## 🔧 Step 2: Index Table Data with Sphinx

Before running the full application, you must index the data using Sphinx:
```
docker compose run sphinx indexer build -c /opt/sphinx/conf/sphinx_mushaf.conf --all
```
This command indexes all the necessary tables for full-text search functionality.

Once done, run this to clean up orphan containers and stop the temporary ones:
```
docker compose down --remove-orphans
```
---

## 🚀 Starting the Application

You can start all services using one of the following options:

### ▶️ Option 1: Run in the foreground (with terminal logs)
```
docker compose up --build
```
This option builds and runs all services, showing logs in the terminal.

### 🛡️ Option 2: Run in detached mode (background)
```
docker compose up -d
```
This will start all services in the background, allowing your terminal to be used for other tasks.

---

## 🔁 Reindexing After Changes to Sphinx Config

If you've made changes to the Sphinx configuration file, reindex with the rotate flag to apply updates without downtime:
```
docker compose run sphinx indexer build -c /opt/sphinx/conf/sphinx_mushaf.conf --rotate --all
```
This ensures Sphinx indexes are updated and rotated correctly.

---

## 💾 Create Latest Backup

To create a backup of the current database state:
```
docker exec -i postgres pg_dump -U postgres -d QCMS > ./postgres/backup/qcms_backup.sql
```
---

## ✅ Summary

| Task                                | Command                                                                                                  |
|-------------------------------------|----------------------------------------------------------------------------------------------------------|
| Index Sphinx data (initial)         | docker compose run sphinx indexer build -c /opt/sphinx/conf/sphinx_mushaf.conf --all                       |
| Restore PostgreSQL backup           | docker compose run --rm postgres psql -U postgres -d QCMS -f /backup/qcms_server_backup.sql               |
| Run services (foreground)           | docker compose up --build                                                                                 |
| Run services (background)           | docker compose up -d                                                                                      |
| Reindex after Sphinx config change  | docker compose run sphinx indexer build -c /opt/sphinx/conf/sphinx_mushaf.conf --rotate --all              |

---
