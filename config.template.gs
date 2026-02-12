/**
 * CONFIGURATION TEMPLATE
 * ======================
 * DO NOT commit your actual API keys to GitHub!
 * 
 * This is a template file. To use:
 * 1. Copy this to config.local.gs (which is gitignored)
 * 2. Fill in your actual values
 * 3. Run setupConfig() in Apps Script to store securely
 */

function setupConfig() {
  const scriptProps = PropertiesService.getScriptProperties();
  
  scriptProps.setProperties({
    // Replace with your actual Google Cloud Vision API Key
    // Get from: https://console.cloud.google.com/apis/credentials
    'VISION_API_KEY': 'YOUR_API_KEY_HERE',
    
    // Replace with your Google Drive folder ID
    // Get from: Drive folder URL after /folders/
    'DRIVE_FOLDER_ID': 'YOUR_FOLDER_ID_HERE'
  });
  
  Logger.log('✅ Configuration saved!');
  Logger.log('⚠️ Delete this function after running it');
}
