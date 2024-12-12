#!/bin/bash

# Define the project path
PROJECT_PATH="/home/svc_mwc/mwc_stratum_pool"

# Create the project directory
echo "Creating project directory at $PROJECT_PATH..."
mkdir -p "$PROJECT_PATH"

# Create subdirectories for organization
echo "Creating subdirectories..."
mkdir -p "$PROJECT_PATH/config"
mkdir -p "$PROJECT_PATH/scripts"
mkdir -p "$PROJECT_PATH/logs"
mkdir -p "$PROJECT_PATH/src"

# Add placeholder files
echo "Creating placeholder files..."

# Placeholder config file
cat <<EOL > "$PROJECT_PATH/config/pool_config.toml"
# MWC Stratum Pool Configuration File
[pool]
name = "MWC Stratum Pool"
description = "A placeholder configuration for MWC Stratum Pool"

[network]
address = "127.0.0.1"
port = 3333

EOL

# Placeholder restart script
cat <<EOL > "$PROJECT_PATH/scripts/restart_script.sh"
#!/bin/bash
# Restart script for MWC Stratum Pool

echo "Stopping existing pool processes..."
pkill -f mwc_pool || echo "No existing processes found."

echo "Starting the pool..."
cd $PROJECT_PATH/src
./mwc_pool --config ../config/pool_config.toml >> ../logs/pool.log 2>&1 &

echo "MWC Stratum Pool restarted."
EOL
chmod +x "$PROJECT_PATH/scripts/restart_script.sh"

# Placeholder log file
touch "$PROJECT_PATH/logs/pool.log"

# Placeholder source code file
cat <<EOL > "$PROJECT_PATH/src/mwc_pool"
#!/bin/bash
# Placeholder for the MWC Pool executable
echo "This is a placeholder for the MWC Pool source code."
EOL
chmod +x "$PROJECT_PATH/src/mwc_pool"

# Final message
echo "Project directory structure created at $PROJECT_PATH."
echo "Modify placeholder files as needed."
