/**
 * KWITYKWITY DAM TOOL - Google Apps Script Backend
 * ================================================
 * This script syncs Google Drive images with a Google Sheet and tags them using Google Cloud Vision API
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

const CONFIG = {
  VISION_API_KEY: '',
  DRIVE_FOLDER_ID: '',
  SPREADSHEET_ID: '',
  SHEET_NAME: 'Assets',
  SUPPORTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']
};

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = params.action || '';
    
    if (action === 'get_assets') {
      return ContentService.createTextOutput(JSON.stringify(getAllAssets()))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'sync') {
      return ContentService.createTextOutput(JSON.stringify(syncFromInterface()))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return HtmlService.createHtmlOutputFromFile('DAMTool')
      .setTitle('Kwitykwity DAM Tool')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(['File ID', 'File Name', 'File URL', 'Created Date', 'File Size', 'MIME Type', 'AI Tags', 'Last Updated']);
    
    const headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#b36cff');
    headerRange.setFontColor('#ffffff');
  }
  
  return sheet;
}

function generateAITags(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    const base64Image = Utilities.base64Encode(blob.getBytes());
    
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${CONFIG.VISION_API_KEY}`;
    
    const requestBody = {
      requests: [{
        image: { content: base64Image },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'IMAGE_PROPERTIES', maxResults: 5 }
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
      throw new Error('Vision API error');
    }
    
    const labels = result.responses[0].labelAnnotations || [];
    const tagList = labels.map(label => `${label.description} (${Math.round(label.score * 100)}%)`);
    
    const colors = result.responses[0].imagePropertiesAnnotation?.dominantColors?.colors || [];
    const colorTags = colors.slice(0, 3).map(c => {
      const rgb = c.color;
      return `Color: RGB(${Math.round(rgb.red || 0)}, ${Math.round(rgb.green || 0)}, ${Math.round(rgb.blue || 0)})`;
    });
    
    return [...tagList, ...colorTags].join(', ');
    
  } catch (error) {
    return 'Error generating tags: ' + error.toString();
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎨 DAM Tool')
    .addItem('🏷️ Tag All Assets', 'tagAllAssets')
    .addItem('⚙️ Open Web App', 'openWebApp')
    .addToUi();
}

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
        sheet.getRange(i + 1, 7).setValue(tags);
        sheet.getRange(i + 1, 8).setValue(new Date());
        tagged++;
        Utilities.sleep(1000);
      } catch (error) {
        Logger.log(`Error tagging file ${fileId}: ${error}`);
      }
    }
  }
  
  SpreadsheetApp.getUi().alert(`✅ Tagged ${tagged} assets!`);
}

function openWebApp() {
  const url = ScriptApp.getService().getUrl();
  const html = `<p><a href="${url}" target="_blank">Click to open</a></p>`;
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(html).setWidth(400).setHeight(100),
    'DAM Tool'
  );
}

function getAllAssets() {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  const assets = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    
    assets.push({
      fileId: row[0],
      name: row[1] || 'Unnamed',
      url: row[2] || '',
      created: row[3] || '',
      size: row[4] || '',
      mimeType: row[5] || '',
      tags: row[6] || '',
      lastUpdated: row[7] || ''
    });
  }
  
  return assets;
}

function syncFromInterface() {
  try {
    const sheet = getOrCreateSheet();
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    const files = folder.getFiles();
    const driveFileIds = new Set();
    
    const existingData = sheet.getDataRange().getValues();
    const existingIds = new Map();
    for (let i = 1; i < existingData.length; i++) {
      if (existingData[i][0]) {
        existingIds.set(existingData[i][0], i + 1);
      }
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
          '',
          new Date()
        ]);
      }
    }

    const rowsToDelete = [];
    existingIds.forEach((rowNum, id) => {
      if (!driveFileIds.has(id)) rowsToDelete.push(rowNum);
    });
    rowsToDelete.sort((a, b) => b - a).forEach(r => sheet.deleteRow(r));
    
    return { success: true, count: driveFileIds.size };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}
