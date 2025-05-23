#!/bin/bash

function show_menu() {
    clear
    echo "📘 QCMS Docker Management Menu"
    echo "============================="
    echo "0. Exit"
    echo "1. 🗃️  Initialize PostgreSQL (First-Time Setup)"
    echo "2. 🔧 Index Data with Sphinx (First-Time Setup)"
    echo "3. 🚀 Start Application (Foreground)"
    echo "4. 🛡️  Start Application (Background)"
    echo "5. 🔄 Reindex Sphinx (After Config Changes)"
    echo "6. 💾 Create Database Backup"
    echo "7. 💾 Clean docker containers"
    echo "============================="
}

function initialize_postgresql() {
    echo "Restoring PostgreSQL backup and starting DB for the first time..."
    docker compose up -d postgres
    docker compose wait --timeout=60 postgres
    sleep 10  # Extra time for init scripts
    docker compose down
    echo "✅ PostgreSQL initialized! (Press Enter to continue...)"
    read -r
}

function index_sphinx() {
    echo "Building Sphinx indexes..."
    if MSYS_NO_PATHCONV=1 docker compose run sphinx indexer build -c /opt/sphinx/conf/sphinx_mushaf.conf --all && docker compose down --remove-orphans; then
        echo "✅ Sphinx indexing complete!"
    else
        echo "❌ Sphinx indexing failed! Check if 'sphinx_mushaf.conf' exists in ./sphinx/conf/"
    fi
    read -p "Press Enter to continue..." -r
}

function start_app_foreground() {
    docker compose down --remove-orphans
    echo "Starting all services in foreground (logs visible)..."
    docker compose up --build
}

function start_app_background() {
    docker compose down --remove-orphans
    echo "Starting all services in background..."
    docker compose up -d
    echo "✅ Services running in detached mode. Use 'docker compose logs' to view logs."
    echo "Press Enter to continue..."
    read -r
}

function reindex_sphinx() {
    docker compose down --remove-orphans
    echo "Reindexing Sphinx (rotate mode)..."
    docker compose run sphinx indexer build -c /opt/sphinx/conf/sphinx_mushaf.conf --rotate --all
    echo "✅ Reindexing complete! (Press Enter to continue...)"
    read -r
}

function create_backup() {
    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_path="./postgres/backup/qcms_backup_$timestamp.sql"
    mkdir -p "./postgres/backup"  # Ensure backup directory exists

    echo "Creating database backup at $backup_path..."

    # Check if PostgreSQL container is running
    if ! docker compose ps postgres | grep -q "running"; then
        echo "Starting PostgreSQL container temporarily..."
        docker compose up -d postgres
        docker compose wait --timeout=30 postgres
        started_temp=true
    fi

    # Perform backup (only if PostgreSQL is reachable)
    if docker compose ps postgres | grep -q "running"; then
        if docker exec -i postgres pg_isready -U postgres && docker exec -i postgres pg_dump -U postgres -d QCMS > "$backup_path"; then
            echo "✅ Backup saved to $backup_path"
        else
            echo "❌ Failed to create backup (PostgreSQL not ready or dump failed)"
            rm -f "$backup_path" 2>/dev/null  # Cleanup partial backup
        fi
    else
        echo "❌ PostgreSQL container is not running and could not be started."
    fi

    # Stop temporary container if we started it
    if [ "$started_temp" = true ]; then
        docker compose stop postgres
    fi

    read -p "Press Enter to continue..."
}

function clean_container() {
    docker compose down --remove-orphans -v
}

# Main loop
while true; do
    show_menu
    read -p "Select an option (0-7): " choice
    case $choice in
        0) echo "Exiting..."; exit 0 ;;
        1) initialize_postgresql ;;
        2) index_sphinx ;;
        3) start_app_foreground ;;
        4) start_app_background ;;
        5) reindex_sphinx ;;
        6) create_backup ;;
        7) clean_container ;;
        *) echo "Invalid option!"; sleep 1 ;;
    esac
done