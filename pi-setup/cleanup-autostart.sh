#!/bin/bash

# Raspberry Pi Autostart Cleanup Script
# This script removes common autostart configurations

echo "🧹 Cleaning up existing autostart configurations..."

# Stop and disable common services that might auto-launch applications
echo "Stopping and disabling common autostart services..."

# Common services to check and disable
services=(
    "chromium-browser"
    "firefox"
    "kiosk"
    "dashboard"
    "autostart"
    "display-manager"
)

for service in "${services[@]}"; do
    if systemctl is-active --quiet "$service"; then
        echo "Stopping $service..."
        sudo systemctl stop "$service" 2>/dev/null || true
    fi
    if systemctl is-enabled --quiet "$service" 2>/dev/null; then
        echo "Disabling $service..."
        sudo systemctl disable "$service" 2>/dev/null || true
    fi
done

# Remove autostart desktop files
echo "Removing desktop autostart files..."
autostart_dirs=(
    "/home/pi/.config/autostart"
    "/etc/xdg/autostart"
    "/home/pi/.config/lxsession/LXDE-pi/autostart"
)

for dir in "${autostart_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "Checking $dir..."
        # Backup existing files before removing
        if [ "$(ls -A $dir 2>/dev/null)" ]; then
            backup_dir="/home/pi/autostart-backup-$(date +%Y%m%d_%H%M%S)"
            echo "Backing up existing autostart files to $backup_dir"
            mkdir -p "$backup_dir"
            cp -r "$dir" "$backup_dir/"

            # Remove browser/kiosk related autostart files
            find "$dir" -name "*browser*" -delete 2>/dev/null || true
            find "$dir" -name "*chromium*" -delete 2>/dev/null || true
            find "$dir" -name "*firefox*" -delete 2>/dev/null || true
            find "$dir" -name "*kiosk*" -delete 2>/dev/null || true
            find "$dir" -name "*dashboard*" -delete 2>/dev/null || true
        fi
    fi
done

# Check and clean rc.local
echo "Checking /etc/rc.local..."
if [ -f "/etc/rc.local" ]; then
    # Backup rc.local
    sudo cp /etc/rc.local /etc/rc.local.backup.$(date +%Y%m%d_%H%M%S)

    # Remove browser launch commands (but keep the file structure)
    sudo sed -i '/chromium/d' /etc/rc.local
    sudo sed -i '/firefox/d' /etc/rc.local
    sudo sed -i '/browser/d' /etc/rc.local
    sudo sed -i '/kiosk/d' /etc/rc.local
    echo "Cleaned rc.local (backup created)"
fi

# Check and clean .bashrc and .profile
echo "Checking user shell startup files..."
for file in "/home/pi/.bashrc" "/home/pi/.profile" "/home/pi/.bash_profile"; do
    if [ -f "$file" ]; then
        # Backup
        cp "$file" "$file.backup.$(date +%Y%m%d_%H%M%S)"

        # Remove browser launch commands
        sed -i '/chromium/d' "$file"
        sed -i '/firefox/d' "$file"
        sed -i '/browser/d' "$file"
        sed -i '/kiosk/d' "$file"
        echo "Cleaned $file (backup created)"
    fi
done

# Check crontab
echo "Checking crontab for autostart entries..."
if crontab -l >/dev/null 2>&1; then
    crontab -l > /home/pi/crontab.backup.$(date +%Y%m%d_%H%M%S)
    (crontab -l | grep -v -i 'chromium\|firefox\|browser\|kiosk') | crontab -
    echo "Cleaned crontab (backup created)"
fi

# Remove any kiosk-related scripts
echo "Removing existing kiosk scripts..."
find /home/pi -name "*kiosk*" -type f -delete 2>/dev/null || true
find /usr/local/bin -name "*kiosk*" -type f -delete 2>/dev/null || true

echo "✅ Cleanup complete!"
echo "📁 Backups created in /home/pi/ with timestamp"
echo "🔄 Reboot recommended before setting up new autostart"