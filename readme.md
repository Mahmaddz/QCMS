# 📘 QCMS Docker Setup Guide

This guide helps you set up, run, manage, and maintain the QCMS application using Docker. The project supports PostgreSQL as its database and Sphinx for full-text search indexing.

---

## 🧭 Menu Summary

This project comes with a management script to perform the following actions easily:

| Option | Description                                        |
|--------|----------------------------------------------------|
| 0      | Exit                                               |
| 1      | 🏗️  Build (Initialize PostgreSQL & Index Sphinx)   |
| 2      | 🚀 Start Application (Foreground)                  |
| 3      | 💾 Create Database Backup                           |
| 4      | 🔄 Reindex Sphinx                                   |
| 5      | 🧹 Clean Docker Containers                          |

---

## ⚙️ Prerequisites

- Docker
- Docker Compose
- Bash-compatible terminal
- (Optional) Make the script executable:
  ```bash
  chmod +x script.sh
  ```

### 🏗️ Step 1: Build the Project (Option 1)
This step prepares the system for first-time setup:
```
./qcms-setup.sh
```

Then select: 
```
Option 1: 🏗️  Build (Initialize PostgreSQL & Index Sphinx)
```

This performs the following:

1. Starts PostgreSQL container.

2. Waits until it's ready.

3. Restores the DB from backup (mounted at ./postgres/backup/).

4. Indexes tables using Sphinx.

5. Stops temporary containers.

### 🚀 Step 2: Start the Application (Option 2)
Run the following to start your app with logs:
```bash
Option 2: 🚀 Start Application (Foreground)
```
or manually 
```
docker compose up --build
```
To run in detached (background) mode:
```
docker compose up -d
```

---
---

### 💾 Option 3: Create a Database Backup
You can take a backup of the current PostgreSQL database:
```
Option 3: 💾 Create Database Backup
```
This generates a backup file at: ./postgres/backup/qcms_backup_<timestamp>.sql

### 🔄 Option 4: Reindex Sphinx (After Changes)
If you’ve modified the Sphinx config or want to refresh indexes:
```
Option 4: 🔄 Reindex Sphinx
```

### 🧹 Option 5: Clean Docker Containers
To stop and remove all containers, volumes, and orphans:
```
Option 5: 🧹 Clean Docker Containers
```

## ✅ Command Summary

| Task                               | Command                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Index Sphinx data (initial)        | `docker compose run --rm sphinx indexer build -c /opt/sphinx/conf/sphinx_mushaf.conf --all`          |
| Restore PostgreSQL backup          | `docker compose run --rm postgres psql -U postgres -d QCMS -f /backup/qcms_server_backup.sql`        |
| Run services (foreground)          | `docker compose up --build`                                                                          |
| Run services (background)          | `docker compose up -d`                                                                               |
| Reindex after Sphinx config change | `docker compose run --rm sphinx indexer build -c /opt/sphinx/conf/sphinx_mushaf.conf --rotate --all` |
| Create latest backup               | `docker exec -i postgres pg_dump -U postgres -d QCMS > ./postgres/backup/qcms_backup.sql`            |
| Clean Docker environment           | `docker compose down --remove-orphans -v`                                                            |

### ✅ macOS Compatibility:

macOS is a Unix-based operating system that includes a built-in **Bash-compatible terminal** (`Terminal.app`). Shell scripts (`.sh` files) are fully supported.

### 🛠️ How to Run `.sh` on macOS:

1. **Open Terminal.**
2. **Navigate to the folder** where your script is located:

   ```bash
   cd /path/to/qcms-setup.sh
   ```
3. **Make the script executable (if not already):**

   ```bash
   chmod +x qcms-setup.sh
   ```
4. **Run it:**

   ```bash
   ./qcms-setup.sh
   ```

### 🔄 If You Get a Shell Error:

* macOS versions later than Catalina use **zsh** by default. Bash scripts still run fine under `zsh`, but if you face issues:

  * Either **run the script using bash explicitly**:

    ```bash
    bash qcms-setup.sh
    ```

