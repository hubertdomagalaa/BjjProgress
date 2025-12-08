/**
 * Patch react-native-worklets to skip version check AND new architecture check
 * for RN 0.76.x compatibility. This runs via postinstall.
 */

const fs = require('fs');
const path = require('path');

// Patch 1: Version validation script
const validateScriptPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-worklets',
  'scripts',
  'validate-react-native-version.js'
);

// Patch 2: Ruby utils file (contains both checks)
const rubyUtilsPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-worklets',
  'scripts',
  'worklets_utils.rb'
);

try {
  if (fs.existsSync(validateScriptPath)) {
    fs.writeFileSync(validateScriptPath, '// Patched for RN 0.76 compatibility\nprocess.exit(0);\n');
    console.log('[patch-worklets] Patched version check');
  }
  
  if (fs.existsSync(rubyUtilsPath)) {
    let content = fs.readFileSync(rubyUtilsPath, 'utf8');
    // Replace the new architecture assertion to do nothing
    content = content.replace(
      /def worklets_assert_new_architecture_enabled\(new_arch_enabled\)[\s\S]*?^end/m,
      'def worklets_assert_new_architecture_enabled(new_arch_enabled)\n  # Patched: skip check\nend'
    );
    // Also replace version assertion
    content = content.replace(
      /def worklets_assert_minimal_react_native_version\(config\)[\s\S]*?^end/m,
      'def worklets_assert_minimal_react_native_version(config)\n  # Patched: skip check\nend'
    );
    fs.writeFileSync(rubyUtilsPath, content);
    console.log('[patch-worklets] Patched Ruby utils');
  }
  
  console.log('[patch-worklets] Successfully patched react-native-worklets');
} catch (error) {
  console.log('[patch-worklets] Error:', error.message);
}

// Patch 3: Remove nested react-native from react-native-appwrite (causes syntax errors)
const nestedRNPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-appwrite',
  'node_modules',
  'react-native'
);

try {
  if (fs.existsSync(nestedRNPath)) {
    fs.rmSync(nestedRNPath, { recursive: true, force: true });
    console.log('[patch-worklets] Removed nested react-native from react-native-appwrite');
  }
} catch (error) {
  console.log('[patch-worklets] Could not remove nested RN:', error.message);
}
