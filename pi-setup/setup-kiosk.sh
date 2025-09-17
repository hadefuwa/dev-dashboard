#!/bin/bash

# Raspberry Pi Dashboard Kiosk Setup Script
# This script sets up your Pi to auto-launch the dashboard in kiosk mode

set -e

echo "🔧 Setting up Raspberry Pi Dashboard Kiosk..."

# Ensure we're running as pi user
if [ "$USER" != "pi" ]; then
    echo "❌ This script must be run as the 'pi' user"
    echo "Please run: su - pi"
    exit 1
fi

# Update system packages
echo "📦 Updating system packages..."
sudo apt update
sudo apt install -y chromium-browser unclutter xdotool

# Clean up existing autostart configurations
echo "🧹 Running cleanup script..."
bash cleanup-autostart.sh

# Copy kiosk script to home directory
echo "📋 Installing kiosk browser script..."
cp kiosk-browser.sh /home/pi/
chmod +x /home/pi/kiosk-browser.sh

# Set up systemd service (primary method)
echo "⚙️ Setting up systemd service..."
sudo cp dashboard-kiosk.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable dashboard-kiosk.service

# Set up desktop autostart (backup method)
echo "🖥️ Setting up desktop autostart..."
mkdir -p /home/pi/.config/autostart
cp dashboard-kiosk.desktop /home/pi/.config/autostart/

# Install unclutter for cursor hiding
echo "🖱️ Installing cursor management..."
sudo apt install -y unclutter

# Configure boot options for optimal kiosk performance
echo "⚡ Optimizing boot configuration..."
sudo tee -a /boot/config.txt > /dev/null << EOF

# Dashboard Kiosk Optimizations
# Disable overscan for full screen
disable_overscan=1

# Set GPU memory split
gpu_mem=128

# Disable rainbow splash
disable_splash=1

# Reduce boot delay
boot_delay=0
EOF

# Configure cmdline.txt for faster boot
if ! grep -q "quiet" /boot/cmdline.txt; then
    sudo sed -i 's/$/ quiet splash loglevel=3 logo.nologo vt.global_cursor_default=0/' /boot/cmdline.txt
fi

# Set up WiFi power management off (prevents disconnections)
echo "📶 Disabling WiFi power management..."
sudo tee /etc/systemd/system/disable-wifi-powersave.service > /dev/null << EOF
[Unit]
Description=Disable WiFi Power Save
After=multi-user.target

[Service]
Type=oneshot
ExecStart=/sbin/iw dev wlan0 set power_save off
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable disable-wifi-powersave.service

# Create a simple control script for manual management
echo "🔧 Creating control script..."
cat > /home/pi/kiosk-control.sh << 'EOF'
#!/bin/bash

case "$1" in
    start)
        echo "Starting dashboard kiosk..."
        sudo systemctl start dashboard-kiosk.service
        ;;
    stop)
        echo "Stopping dashboard kiosk..."
        sudo systemctl stop dashboard-kiosk.service
        pkill -f chromium-browser 2>/dev/null || true
        ;;
    restart)
        echo "Restarting dashboard kiosk..."
        sudo systemctl restart dashboard-kiosk.service
        ;;
    status)
        sudo systemctl status dashboard-kiosk.service
        ;;
    logs)
        echo "=== Service Logs ==="
        sudo journalctl -u dashboard-kiosk.service -f
        ;;
    app-logs)
        echo "=== Application Logs ==="
        tail -f /home/pi/kiosk.log
        ;;
    disable)
        echo "Disabling kiosk autostart..."
        sudo systemctl disable dashboard-kiosk.service
        rm -f /home/pi/.config/autostart/dashboard-kiosk.desktop
        ;;
    enable)
        echo "Enabling kiosk autostart..."
        sudo systemctl enable dashboard-kiosk.service
        cp dashboard-kiosk.desktop /home/pi/.config/autostart/
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|app-logs|enable|disable}"
        echo ""
        echo "Commands:"
        echo "  start     - Start the kiosk mode"
        echo "  stop      - Stop the kiosk mode"
        echo "  restart   - Restart the kiosk mode"
        echo "  status    - Show service status"
        echo "  logs      - Show service logs (live)"
        echo "  app-logs  - Show application logs (live)"
        echo "  enable    - Enable autostart on boot"
        echo "  disable   - Disable autostart on boot"
        exit 1
        ;;
esac
EOF

chmod +x /home/pi/kiosk-control.sh

# Final configuration
echo "🎯 Final configuration..."

# Ensure correct permissions
chown -R pi:pi /home/pi/.config
chown pi:pi /home/pi/kiosk-browser.sh
chown pi:pi /home/pi/kiosk-control.sh

echo ""
echo "✅ Dashboard Kiosk Setup Complete!"
echo ""
echo "📋 What was configured:"
echo "   • Cleaned up existing autostart configurations"
echo "   • Installed kiosk browser script"
echo "   • Set up systemd service for reliable autostart"
echo "   • Configured desktop autostart as backup"
echo "   • Optimized boot configuration"
echo "   • Disabled WiFi power saving"
echo "   • Created control script for management"
echo ""
echo "🎮 Control Commands:"
echo "   ./kiosk-control.sh start     - Start kiosk mode"
echo "   ./kiosk-control.sh stop      - Stop kiosk mode"
echo "   ./kiosk-control.sh restart   - Restart kiosk mode"
echo "   ./kiosk-control.sh status    - Check status"
echo "   ./kiosk-control.sh logs      - View live logs"
echo ""
echo "🌐 Dashboard URL: https://hadefuwa.github.io/dev-dashboard/"
echo ""
echo "🔄 Please reboot your Pi to start the dashboard:"
echo "   sudo reboot"
echo ""
echo "📄 Logs will be available at:"
echo "   /home/pi/kiosk.log (application logs)"
echo "   sudo journalctl -u dashboard-kiosk.service (service logs)"