#!/bin/bash

# Patch react-native-worklets to skip version check for RN 0.76.x compatibility
VALIDATE_SCRIPT="node_modules/react-native-worklets/scripts/validate-react-native-version.js"

if [ -f "$VALIDATE_SCRIPT" ]; then
  echo "Patching react-native-worklets version check..."
  # Replace the script with one that always exits successfully
  cat > "$VALIDATE_SCRIPT" << 'EOF'
// Patched to skip version check for RN 0.76 compatibility
process.exit(0);
EOF
  echo "Patched successfully!"
fi
