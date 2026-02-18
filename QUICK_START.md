# ⚡ Quick Start Guide

**For experienced users who just need the essentials.**

⏱️ **Time:** 10 minutes  
💡 **Skill level:** Comfortable with Google Workspace & APIs

---

## 🎯 Overview

Build an AI-powered image search tool using:
- **Storage:** Google Drive
- **Database:** Google Sheets  
- **AI:** Google Cloud Vision API
- **Backend:** Google Apps Script
- **Frontend:** HTML/JS

---

## 📥 1. Download Files (1 min)

```bash
git clone https://github.com/kwitykwity/DAMTool.git
cd DAMTool
```

**OR** download ZIP from GitHub

**Files needed:** `Code.gs` and `DAMTool.html`

---

## 🔑 2. Get Credentials (4 min)

### Google Cloud Vision API Key
1. [console.cloud.google.com](https://console.cloud.google.com) → New Project
2. Enable **Cloud Vision API**
3. **APIs & Services** → **Credentials** → **Create API Key**
4. Restrict to Cloud Vision API
5. Copy key: `AIzaSy...`

### Google Drive Folder ID
1. Create folder in Drive
2. Upload 3-5 test images
3. Copy ID from URL: `drive.google.com/drive/folders/FOLDER_ID`

### Google Sheet ID
1. Create new Google Sheet
2. Copy ID from URL: `docs.google.com/spreadsheets/d/SHEET_ID/edit`

---

## 💻 3. Setup Apps Script (3 min)

### Add Files
1. Sheet → **Extensions** → **Apps Script**
2. Paste `Code.gs` content → Save
3. **+ Files** → **HTML** → Name: `DAMTool` → Paste `DAMTool.html` content → Save

### Configure Credentials
Add to bottom of `Code.gs`:

```javascript
function setupMyConfig() {
  PropertiesService.getScriptProperties().setProperties({
    'VISION_API_KEY': 'YOUR_API_KEY',
    'DRIVE_FOLDER_ID': 'YOUR_FOLDER_ID',
    'SPREADSHEET_ID': 'YOUR_SHEET_ID'
  });
}
```

Run it, authorize, then **delete the function**.

Update CONFIG at top of `Code.gs`:

```javascript
const CONFIG = {
  VISION_API_KEY: PropertiesService.getScriptProperties().getProperty('VISION_API_KEY'),
  DRIVE_FOLDER_ID: PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID'),
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'),
  SHEET_NAME: 'Assets',
  SUPPORTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']
};
```

Save.

---

## 🚀 4. Deploy (2 min)

1. **Deploy** → **New deployment** → **Web app**
2. Execute as: **Me** | Access: **Anyone**
3. Copy deployment URL
4. In `DAMTool.html`, update: `const baseUrl = 'YOUR_DEPLOYMENT_URL';`
5. **Deploy** → **Manage deployments** → **Edit** → **New version** → **Deploy**

---

## ✅ 5. Test

1. Open deployment URL
2. Click **Sync**
3. Sheet → **🎨 DAM Tool** → **Tag All Assets** (wait 30 sec)
4. Web app → **Sync** → Search → Done!

---

## 🔧 Architecture

```
Drive (images) → Apps Script (sync) → Sheet (database)
                      ↓
                Vision API (tags)
                      ↓
                Web Interface (search)
```

---

## 📁 File Structure

```
Code.gs          # Backend (Apps Script)
DAMTool.html     # Frontend (HTML/CSS/JS)
```

---

## 🔒 Security Notes

- ✅ Credentials in Script Properties (not code)
- ✅ API key restricted to Vision API
- ✅ Delete setup function after running
- ✅ Never commit real credentials to GitHub

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| No assets found | Upload images to Drive, click Sync |
| Search returns nothing | Run "Tag All Assets" from Sheet menu |
| Permission denied | Reauthorize: Run any function → Allow |
| HTML not found | Name file exactly `DAMTool` (no .html) |
| Invalid response | Update baseUrl in HTML, redeploy |

---

## 🎯 Key Functions

```javascript
syncFromInterface()    // Sync Drive → Sheet
getAllAssets()         // Get all assets as JSON
generateAITags(fileId) // Tag single image
tagAllAssets()         // Tag all untagged images
```

---

## 🔄 Daily Usage

1. Upload images to Drive folder
2. Web app → Click **Sync**
3. Sheet → **Tag All Assets** (if needed)
4. Search by tags
5. Click thumbnail to download

---

## 📊 Database Schema

| Column | Content |
|--------|---------|
| A | File ID |
| B | File Name |
| C | File URL |
| D | Created Date |
| E | File Size |
| F | MIME Type |
| G | AI Tags |
| H | Last Updated |

---

## 🎨 Customization

### Change Colors
Edit CSS variables in `DAMTool.html`:
```css
:root {
  --accent1: #b36cff;  /* Primary purple */
  --accent2: #5bbcff;  /* Secondary blue */
  --blue: #4a90e2;     /* Thumbnail border */
}
```

### Add More File Types
Update in `Code.gs`:
```javascript
SUPPORTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml']
```

### Adjust AI Sensitivity
In `generateAITags()`:
```javascript
{ type: 'LABEL_DETECTION', maxResults: 10 }  // Change 10 to desired number
```

---

## 🚀 Advanced Usage

### Batch Tagging with Rate Limiting
```javascript
function tagAllAssets() {
  // ... existing code ...
  Utilities.sleep(1000);  // Adjust delay (milliseconds)
}
```

### Custom Tag Filtering
```javascript
// In generateAITags(), filter low-confidence tags:
const tagList = labels
  .filter(label => label.score > 0.8)  // Only 80%+ confidence
  .map(label => label.description);
```

### Auto-Sync Trigger
```javascript
function createTrigger() {
  ScriptApp.newTrigger('syncFromInterface')
    .timeBased()
    .everyHours(1)
    .create();
}
```

---

## 📚 API Reference

### Vision API Response
```javascript
{
  labelAnnotations: [
    { description: "Person", score: 0.95 },
    { description: "Smile", score: 0.88 }
  ],
  imagePropertiesAnnotation: {
    dominantColors: { colors: [...] }
  }
}
```

### Sync Response
```javascript
{ success: true, count: 25 }
// OR
{ success: false, error: "Error message" }
```

---

## 🔗 Links

- 📖 [Full Deployment Guide](DEPLOYMENT_GUIDE.md)
- ✅ [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
- 🐛 [Report Issues](https://github.com/kwitykwity/DAMTool/issues)
- ⭐ [Star on GitHub](https://github.com/kwitykwity/DAMTool)

---

## 💡 Pro Tips

**Performance:**
- Keep Drive folder under 1000 images
- Run cleanup regularly (🗑️ Clean Deleted Files)
- Batch tag during off-hours

**Organization:**
- Use descriptive folder names
- Organize by project/client
- Archive old assets

**Security:**
- Rotate API keys every 90 days
- Review Script Properties periodically
- Monitor API usage in Cloud Console

**Workflow:**
- Bookmark deployment URL
- Create desktop shortcut
- Integrate with existing DAM tools

---

## 🆘 Need More Help?

📖 **Detailed guide:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)  
✅ **Step-by-step:** See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)  
💬 **Questions?** Open a [GitHub Issue](https://github.com/kwitykwity/DAMTool/issues)

---

<div align="center">

**Built with 💜 by Kwitykwity**

⚡ **You're ready to go!** ⚡

</div>
