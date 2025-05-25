#!/bin/bash

function show_menu() {
    clear
    echo "📘 QCMS Docker Management Menu"
    echo "============================="
    echo "0. Exit"
    echo "1. 🏗️  Build (Initialize PostgreSQL & Index Sphinx)"
    echo "2. 🚀 Start Application (Foreground)"
    echo "3. 💾 Create Database Backup"
    echo "4. 🔄 Reindex Sphinx"
    echo "5. 🧹 Clean Docker Containers"
    echo "============================="
}

function initialize_postgresql() {
    echo "Restoring PostgreSQL backup and starting DB for the first time..."
    # Start postgres in detached mode and wait for it to be ready
    docker compose up -d postgres
    
    # Wait for PostgreSQL to become ready
    echo -n "Waiting for PostgreSQL to be ready"
    for i in {1..30}; do
        if docker compose exec postgres pg_isready -U postgres >/dev/null 2>&1; then
            echo -e "\nPostgreSQL is ready!"
            return 0
        fi
        sleep 2
        echo -n "."
    done
    echo -e "\nTimed out waiting for PostgreSQL!"
    return 1
}

function index_sphinx() {
    echo "Building Sphinx indexes..."
    if MSYS_NO_PATHCONV=1 docker compose run --rm sphinx indexer build -c /opt/sphinx/conf/sphinx_mushaf.conf --all; then
        echo "✅ Sphinx indexing complete!"
    else
        echo "❌ Sphinx indexing failed! Check if 'sphinx_mushaf.conf' exists in ./sphinx/conf/"
    fi
    read -p "Press Enter to continue..." -r
}

function build_all() {
    clean_container
    if initialize_postgresql; then
        # Give a little extra time for init scripts to complete
        sleep 5
        
        # Stop postgres container before indexing
        docker compose stop postgres
        
        index_sphinx
    else
        echo "❌ PostgreSQL initialization failed!"
        read -p "Press Enter to continue..." -r
    fi
}

function start_app_foreground() {
    clean_container
    echo "Starting all services in foreground (logs visible)..."
    docker compose up --build
}

function reindex_sphinx() {
    clean_container
    echo "Reindexing Sphinx (rotate mode)..."
    if MSYS_NO_PATHCONV=1 docker compose run --rm sphinx indexer build -c /opt/sphinx/conf/sphinx_mushaf.conf --rotate --all; then
        echo "✅ Reindexing complete!"
    else
        echo "❌ Reindexing failed!"
    fi
    read -p "Press Enter to continue..." -r
}

function create_backup() {
    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_path="./postgres/backup/qcms_backup_$timestamp.sql"
    mkdir -p "./postgres/backup"
    local started_temp=false

    echo "Creating database backup at $backup_path..."

    # Check if PostgreSQL container is running
    if ! docker compose ps postgres | grep -q "running"; then
        echo "Starting PostgreSQL container temporarily..."
        docker compose up -d postgres
        started_temp=true
        
        # Wait for PostgreSQL to become ready (alternative method)
        echo "Waiting for PostgreSQL to become ready..."
        for i in {1..30}; do
            if docker compose exec postgres pg_isready -U postgres >/dev/null 2>&1; then
                break
            fi
            sleep 2
            echo -n "."
        done
    fi

    # Perform backup
    if docker compose exec postgres pg_isready -U postgres >/dev/null 2>&1; then
        if docker compose exec postgres pg_dump -U postgres -d QCMS > "$backup_path"; then
            echo "✅ Backup saved to $backup_path"
        else
            echo "❌ Failed to create backup (dump failed)"
            rm -f "$backup_path" 2>/dev/null
        fi
    else
        echo "❌ PostgreSQL is not ready after 60 seconds"
    fi

    # Stop temporary container if we started it
    if [ "$started_temp" = true ]; then
        docker compose stop postgres
    fi

    read -p "Press Enter to continue..." -r
}

function clean_container() {
    docker compose down --remove-orphans -v
}

# Main loop
while true; do
    show_menu
    read -p "Select an option (0-5): " choice
    case $choice in
        0) echo "Exiting..."; clean_container; exit 0 ;;
        1) build_all ;;
        2) start_app_foreground ;;
        3) create_backup ;;
        4) reindex_sphinx ;;
        5) clean_container ;;
        *) echo "Invalid option!"; sleep 1 ;;
    esac
done