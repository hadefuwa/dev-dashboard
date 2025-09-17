#!/bin/bash

# Raspberry Pi Kiosk Browser Script
# Launches Chromium in full kiosk mode for dashboard display

# Configuration
DASHBOARD_URL="https://hadefuwa.github.io/dev-dashboard/"
LOG_FILE="/home/pi/kiosk.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_message "🚀 Starting dashboard kiosk mode..."

# Wait for network connectivity
log_message "⏳ Waiting for network connectivity..."
while ! ping -c 1 google.com &> /dev/null; do
    log_message "No network connection, waiting 5 seconds..."
    sleep 5
done
log_message "✅ Network connectivity confirmed"

# Wait for X server to be ready
log_message "⏳ Waiting for X server..."
while ! xset q &>/dev/null; do
    log_message "X server not ready, waiting 2 seconds..."
    sleep 2
done
log_message "✅ X server ready"

# Kill any existing browser processes
log_message "🧹 Cleaning up existing browser processes..."
pkill -f chromium-browser 2>/dev/null || true
pkill -f firefox 2>/dev/null || true
sleep 2

# Hide mouse cursor after 1 second of inactivity
log_message "🖱️ Setting up cursor auto-hide..."
unclutter -display :0 -idle 1 -root &

# Disable screen blanking and power management
log_message "🖥️ Disabling screen blanking..."
xset -display :0 s off
xset -display :0 -dpms
xset -display :0 s noblank

# Set up display
log_message "📺 Configuring display..."
export DISPLAY=:0
xrandr --output HDMI-1 --auto 2>/dev/null || xrandr --output HDMI-A-1 --auto 2>/dev/null || true

# Launch Chromium in kiosk mode
log_message "🌐 Launching Chromium in kiosk mode..."
log_message "📍 URL: $DASHBOARD_URL"

# Chromium kiosk flags for optimal dashboard display
/usr/bin/chromium-browser \
    --display=:0 \
    --kiosk \
    --no-sandbox \
    --disable-infobars \
    --disable-extensions \
    --disable-plugins \
    --disable-translate \
    --disable-notifications \
    --disable-features=TranslateUI \
    --disable-ipc-flooding-protection \
    --disable-backgrounding-occluded-windows \
    --disable-background-timer-throttling \
    --disable-renderer-backgrounding \
    --disable-field-trial-config \
    --disable-back-forward-cache \
    --disable-features=VizDisplayCompositor \
    --enable-features=OverlayScrollbar \
    --start-fullscreen \
    --no-first-run \
    --fast \
    --fast-start \
    --disable-default-apps \
    --disable-popup-blocking \
    --disable-prompt-on-repost \
    --no-message-box \
    --disable-hang-monitor \
    --disable-logging \
    --silent-debugger-extension-api \
    --disable-web-security \
    --allow-running-insecure-content \
    --autoplay-policy=no-user-gesture-required \
    --disable-session-crashed-bubble \
    --disable-restore-session-state \
    --disable-new-avatar-menu \
    --disable-new-profile-management \
    --incognito \
    --window-position=0,0 \
    --window-size=1920,1080 \
    --app="$DASHBOARD_URL" \
    >> "$LOG_FILE" 2>&1 &

CHROMIUM_PID=$!
log_message "✅ Chromium started with PID: $CHROMIUM_PID"

# Monitor the browser process and restart if it crashes
while true; do
    if ! kill -0 $CHROMIUM_PID 2>/dev/null; then
        log_message "❌ Chromium crashed, restarting in 5 seconds..."
        sleep 5

        # Kill any remaining processes
        pkill -f chromium-browser 2>/dev/null || true
        sleep 2

        # Restart Chromium
        log_message "🔄 Restarting Chromium..."
        /usr/bin/chromium-browser \
            --display=:0 \
            --kiosk \
            --no-sandbox \
            --disable-infobars \
            --disable-extensions \
            --disable-plugins \
            --disable-translate \
            --disable-notifications \
            --disable-features=TranslateUI \
            --disable-ipc-flooding-protection \
            --disable-backgrounding-occluded-windows \
            --disable-background-timer-throttling \
            --disable-renderer-backgrounding \
            --disable-field-trial-config \
            --disable-back-forward-cache \
            --disable-features=VizDisplayCompositor \
            --enable-features=OverlayScrollbar \
            --start-fullscreen \
            --no-first-run \
            --fast \
            --fast-start \
            --disable-default-apps \
            --disable-popup-blocking \
            --disable-prompt-on-repost \
            --no-message-box \
            --disable-hang-monitor \
            --disable-logging \
            --silent-debugger-extension-api \
            --disable-web-security \
            --allow-running-insecure-content \
            --autoplay-policy=no-user-gesture-required \
            --disable-session-crashed-bubble \
            --disable-restore-session-state \
            --disable-new-avatar-menu \
            --disable-new-profile-management \
            --incognito \
            --window-position=0,0 \
            --window-size=1920,1080 \
            --app="$DASHBOARD_URL" \
            >> "$LOG_FILE" 2>&1 &

        CHROMIUM_PID=$!
        log_message "✅ Chromium restarted with PID: $CHROMIUM_PID"
    fi

    sleep 10
done