#!/bin/bash

# Environment variable should be passed from Docker
echo "Starting the database backup script with a delay of 24 hours between runs."

# Loop indefinitely
while true; do
    echo "$(date) - Initiating database backup."

    # Replace this command with your actual backup command
    /usr/local/bin/dbBackup.sh

    # Check if the backup was successful
    if [ $? -ne 0 ]; then
        echo "$(date) - Database backup failed." >&2
    else
        echo "$(date) - Database backup completed successfully."
    fi

    # Sleep for 24 hours
    sleep 86400
done
