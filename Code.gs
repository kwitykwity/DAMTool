/**
 * KWITYKWITY DAM TOOL - Google Apps Script Backend
 * ================================================
 * This script syncs Google Drive images with a Google Sheet and tags them using Google Cloud Vision API
 * NOW WITH TRUE TWO-WAY SYNC - removes deleted files from the sheet
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

const CONFIG = {
  // SECURITY: API credentials should be stored in Script Properties
  // Run setupConfig() function to set these values securely
  // See README.md for instructions
  
  VISION_API_KEY: '',  // Get from Google Cloud Console
  DRIVE_FOLDER_ID: '', // Get from Drive folder URL
  
  // Non-sensitive config
  SHEET_NAME: 'Assets',
  SUPPORTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']
};

// ============================================
// WEB APP HANDLERS
// ============================================

/**
 * Serves the HTML frontend or handles API requests
 */
function doGet(e) {
  try {
    // Log for debugging
    Logger.log('doGet called with params: ' + JSON.stringify(e));
    
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || '';
    
    Logger.log('Action: ' + action);
    
    // API endpoint: get all assets
    if (action === 'get_assets') {
      const assets = getAllAssets();
      Logger.log('Returning ' + assets.length + ' assets');
      return ContentService.createTextOutput(JSON.stringify(assets))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // API endpoint: sync assets
    if (action === 'sync') {
      const result = syncFromInterface();
      Logger.log('Sync result: ' + JSON.stringify(result));
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default: serve HTML interface
    Logger.log('Serving HTML interface');
    return HtmlService.createHtmlOutputFromFile('DAMTool')
      .setTitle('Kwitykwity DAM Tool')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString(),
      stack: error.stack
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles POST requests from the frontend
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'demo_run') {
      const result = syncAndTagNewestAsset();
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// MAIN WORKFLOW FUNCTION
// ============================================

/**
 * Main function: Syncs Drive folder and tags the newest asset
 */
function syncAndTagNewestAsset() {
  try {
    // Validate configuration
    if (CONFIG.VISION_API_KEY === '') {
      return {
        ok: false,
        error: 'Please configure your Google Cloud Vision API key in Code.gs',
        help: 'Edit Code.gs line 14 and replace YOUR_GOOGLE_CLOUD_VISION_API_KEY with your actual API key'
      };
    }
    
    if (CONFIG.DRIVE_FOLDER_ID === 'YOUR_DRIVE_FOLDER_ID') {
      return {
        ok: false,
        error: 'Please configure your Drive folder ID in Code.gs',
        help: 'Edit Code.gs line 17 and replace YOUR_DRIVE_FOLDER_ID with your actual folder ID from the Drive URL'
      };
    }
    
    // Get or create the sheet
    const sheet = getOrCreateSheet();
    
    // Sync Drive folder and find newest asset
    const newestAsset = syncDriveFolder(sheet);
    
    if (!newestAsset) {
      return {
        ok: true,
        message: 'No new assets found in Drive folder',
        assetCount: sheet.getLastRow() - 1
      };
    }
    
    // Generate AI tags for the newest asset
    const tags = generateAITags(newestAsset.id);
    
    // Update the sheet with the tags
    updateAssetTags(sheet, newestAsset.id, tags);
    
    return {
      ok: true,
      asset: {
        name: newestAsset.name,
        id: newestAsset.id,
        url: newestAsset.url,
        created: newestAsset.created,
        tags: tags
      },
      totalAssets: sheet.getLastRow() - 1
    };
    
  } catch (error) {
    Logger.log('Error in syncAndTagNewestAsset: ' + error);
    return {
      ok: false,
      error: error.toString()
    };
  }
}

// ============================================
// SHEET MANAGEMENT
// ============================================

/**
 * Gets or creates the Assets sheet
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    
    // Create header row
    const headers = ['File ID', 'File Name', 'File URL', 'Created Date', 'File Size', 'MIME Type', 'AI Tags', 'Last Updated'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#b36cff')
      .setFontColor('#ffffff');
    
    // Set column widths
    sheet.setColumnWidth(1, 200); // File ID
    sheet.setColumnWidth(2, 250); // File Name
    sheet.setColumnWidth(3, 300); // File URL
    sheet.setColumnWidth(4, 150); // Created Date
    sheet.setColumnWidth(5, 100); // File Size
    sheet.setColumnWidth(6, 120); // MIME Type
    sheet.setColumnWidth(7, 400); // AI Tags
    sheet.setColumnWidth(8, 150); // Last Updated
    
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

// ============================================
// DRIVE SYNC (WITH DELETION SUPPORT)
// ============================================

/**
 * Syncs the Drive folder and returns the newest asset
 * NOW REMOVES files from sheet that no longer exist in Drive
 */
function syncDriveFolder(sheet) {
  try {
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    
    // Get all current file IDs from Drive
    const driveFileIds = new Set();
    const files = folder.getFiles();
    
    let newestAsset = null;
    let newestDate = null;
    
    // Build set of all file IDs currently in Drive
    while (files.hasNext()) {
      const file = files.next();
      const mimeType = file.getMimeType();
      
      // Only track supported image types
      if (!CONFIG.SUPPORTED_TYPES.includes(mimeType)) {
        continue;
      }
      
      const fileId = file.getId();
      driveFileIds.add(fileId);
      
      const created = file.getDateCreated();
      
      // Track the newest file
      if (!newestDate || created > newestDate) {
        newestDate = created;
        newestAsset = {
          id: fileId,
          name: file.getName(),
          url: file.getUrl(),
          created: created,
          size: file.getSize(),
          mimeType: mimeType
        };
      }
    }
    
    // Get existing file IDs from sheet
    const existingIds = new Map(); // Map of fileId -> row number
    if (sheet.getLastRow() > 1) {
      const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
      data.forEach((row, index) => {
        if (row[0]) {
          existingIds.set(row[0], index + 2); // +2 because: 0-indexed array + header row
        }
      });
    }
    
    // ADD/UPDATE: Process files from Drive
    const filesIterator = folder.getFiles();
    while (filesIterator.hasNext()) {
      const file = filesIterator.next();
      const mimeType = file.getMimeType();
      
      if (!CONFIG.SUPPORTED_TYPES.includes(mimeType)) {
        continue;
      }
      
      const fileId = file.getId();
      
      if (!existingIds.has(fileId)) {
        // NEW file - add to sheet
        const rowData = [
          fileId,
          file.getName(),
          file.getUrl(),
          file.getDateCreated(),
          formatFileSize(file.getSize()),
          mimeType,
          '', // AI Tags (to be filled)
          new Date()
        ];
        sheet.appendRow(rowData);
      } else {
        // EXISTING file - update metadata (optional)
        const rowNum = existingIds.get(fileId);
        sheet.getRange(rowNum, 2).setValue(file.getName()); // Update name in case it changed
        sheet.getRange(rowNum, 8).setValue(new Date()); // Update timestamp
      }
    }
    
    // DELETE: Remove rows for files no longer in Drive
    const rowsToDelete = [];
    existingIds.forEach((rowNum, fileId) => {
      if (!driveFileIds.has(fileId)) {
        rowsToDelete.push(rowNum);
      }
    });
    
    // Delete rows in reverse order (bottom to top) to avoid shifting issues
    rowsToDelete.sort((a, b) => b - a);
    rowsToDelete.forEach(rowNum => {
      sheet.deleteRow(rowNum);
    });
    
    return newestAsset;
    
  } catch (error) {
    throw new Error('Error syncing Drive folder: ' + error.toString());
  }
}

// ============================================
// AI TAGGING WITH GOOGLE CLOUD VISION
// ============================================

/**
 * Generates AI tags for an image using Google Cloud Vision API
 */
function generateAITags(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    
    // Get image as base64
    const blob = file.getBlob();
    const base64Image = Utilities.base64Encode(blob.getBytes());
    
    // Prepare Cloud Vision API request
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${CONFIG.VISION_API_KEY}`;
    
    const requestBody = {
      requests: [{
        image: {
          content: base64Image
        },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'IMAGE_PROPERTIES', maxResults: 5 },
          { type: 'SAFE_SEARCH_DETECTION' }
        ]
      }]
    };
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(requestBody),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(visionUrl, options);
    const result = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() !== 200) {
      throw new Error('Vision API error: ' + JSON.stringify(result));
    }
    
    // Extract labels
    const labels = result.responses[0].labelAnnotations || [];
    const tagList = labels.map(label => `${label.description} (${Math.round(label.score * 100)}%)`);
    
    // Extract dominant colors
    const colors = result.responses[0].imagePropertiesAnnotation?.dominantColors?.colors || [];
    const colorTags = colors.slice(0, 3).map(c => {
      const rgb = c.color;
      return `Color: RGB(${Math.round(rgb.red || 0)}, ${Math.round(rgb.green || 0)}, ${Math.round(rgb.blue || 0)})`;
    });
    
    return [...tagList, ...colorTags].join(', ');
    
  } catch (error) {
    Logger.log('Error generating AI tags: ' + error);
    return 'Error generating tags: ' + error.toString();
  }
}

/**
 * Updates the AI tags for a specific asset
 */
function updateAssetTags(sheet, fileId, tags) {
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === fileId) {
      sheet.getRange(i + 1, 7).setValue(tags); // Column 7 is AI Tags
      sheet.getRange(i + 1, 8).setValue(new Date()); // Update timestamp
      break;
    }
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Formats file size in human-readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// MENU FUNCTIONS
// ============================================

/**
 * Creates custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎨 DAM Tool')
    .addItem('🔄 Sync All Assets', 'manualSyncAll')
    .addItem('🏷️ Tag All Assets', 'tagAllAssets')
    .addItem('🗑️ Clean Deleted Files', 'cleanDeletedFiles')
    .addItem('⚙️ Open Web App', 'openWebApp')
    .addToUi();
}

/**
 * Manually sync all assets from Drive (includes deleting removed files)
 */
function manualSyncAll() {
  const sheet = getOrCreateSheet();
  const result = syncDriveFolder(sheet);
  
  const totalAssets = sheet.getLastRow() - 1;
  SpreadsheetApp.getUi().alert(`✅ Drive sync complete!\n\nTotal assets: ${totalAssets}`);
}

/**
 * Clean deleted files - removes rows for files no longer in Drive
 */
function cleanDeletedFiles() {
  const sheet = getOrCreateSheet();
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  
  // Get all file IDs currently in Drive
  const driveFileIds = new Set();
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    if (CONFIG.SUPPORTED_TYPES.includes(file.getMimeType())) {
      driveFileIds.add(file.getId());
    }
  }
  
  // Check each row in sheet
  const data = sheet.getDataRange().getValues();
  const rowsToDelete = [];
  
  for (let i = 1; i < data.length; i++) { // Start at 1 to skip header
    const fileId = data[i][0];
    if (fileId && !driveFileIds.has(fileId)) {
      rowsToDelete.push(i + 1); // +1 because sheet rows are 1-indexed
    }
  }
  
  // Delete in reverse order
  rowsToDelete.sort((a, b) => b - a);
  rowsToDelete.forEach(rowNum => {
    sheet.deleteRow(rowNum);
  });
  
  SpreadsheetApp.getUi().alert(`✅ Cleanup complete!\n\nRemoved ${rowsToDelete.length} deleted files from the sheet.`);
}

/**
 * Tag all assets that don't have tags yet
 */
function tagAllAssets() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  let tagged = 0;
  
  for (let i = 1; i < data.length; i++) {
    const fileId = data[i][0];
    const existingTags = data[i][6];
    
    if (!existingTags || existingTags === '') {
      try {
        const tags = generateAITags(fileId);
        updateAssetTags(sheet, fileId, tags);
        tagged++;
        
        // Add delay to avoid API rate limits
        Utilities.sleep(1000);
      } catch (error) {
        Logger.log(`Error tagging file ${fileId}: ${error}`);
        // Continue with next file
      }
    }
  }
  
  SpreadsheetApp.getUi().alert(`✅ Tagged ${tagged} assets!`);
}

/**
 * Opens the web app URL
 */
function openWebApp() {
  const url = ScriptApp.getService().getUrl();
  const html = `<p><a href="${url}" target="_blank">Click here to open the web app</a></p>`;
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(html).setWidth(400).setHeight(100),
    'DAM Tool Web App'
  );
}

// ============================================
// WEB INTERFACE FUNCTIONS
// ============================================

/**
 * Get all assets for the web interface
 */
function getAllAssets() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  const assets = [];
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    assets.push({
      fileId: row[0],
      name: row[1],
      url: row[2],
      created: row[3],
      size: row[4],
      mimeType: row[5],
      tags: row[6],
      lastUpdated: row[7]
    });
  }
  
  return assets;
}

/**
 * Sync assets from the web interface
 */
function syncFromInterface() {
  try {
    const sheet = getOrCreateSheet();
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const files = folder.getFiles();
    const driveFileIds = new Set();
    
    const existingData = sheet.getDataRange().getValues();
    const existingIds = new Map();
    for (let i = 1; i < existingData.length; i++) {
      existingIds.set(existingData[i][0], i + 1);
    }

    while (files.hasNext()) {
      const file = files.next();
      if (!CONFIG.SUPPORTED_TYPES.includes(file.getMimeType())) continue;
      driveFileIds.add(file.getId());
      
      if (!existingIds.has(file.getId())) {
        sheet.appendRow([
          file.getId(), 
          file.getName(), 
          file.getUrl(), 
          file.getDateCreated(), 
          formatFileSize(file.getSize()), 
          file.getMimeType(), 
          '', // AI Tags placeholder
          new Date()
        ]);
      }
    }

    // Cleanup deleted files
    const rowsToDelete = [];
    existingIds.forEach((rowNum, id) => {
      if (!driveFileIds.has(id)) rowsToDelete.push(rowNum);
    });
    rowsToDelete.sort((a, b) => b - a).forEach(r => sheet.deleteRow(r));
    
    return { 
      success: true, 
      count: driveFileIds.size 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.toString() 
    };
  }
}

