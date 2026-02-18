# ✅ DAM Tool Deployment Checklist

**Print this page and check off each step as you complete it!**

---

## 📥 Part 1: Get Started (5 min)

### Download & Prepare
- [ ] Downloaded `Code.gs` from GitHub
- [ ] Downloaded `DAMTool.html` from GitHub
- [ ] Opened notepad/text file to save IDs
- [ ] Have 3-5 test images ready

---

## 📊 Part 2: Google Sheet Setup (2 min)

### Create Database
- [ ] Opened [sheets.google.com](https://sheets.google.com)
- [ ] Created new blank spreadsheet
- [ ] Named it "DAM Database"
- [ ] Kept sheet tab open

### Get Spreadsheet ID
- [ ] Copied Spreadsheet ID from URL (between `/d/` and `/edit`)
- [ ] Pasted ID in notepad
- [ ] Format check: Long string like `1H5o5Ns...`

---

## 🗂️ Part 3: Google Drive Setup (2 min)

### Create Folder
- [ ] Opened [drive.google.com](https://drive.google.com)
- [ ] Created new folder named "DAM Assets"
- [ ] Uploaded 3-5 test images (JPG/PNG/GIF/WebP/BMP)

### Get Folder ID
- [ ] Opened the folder
- [ ] Copied Folder ID from URL (after `/folders/`)
- [ ] Pasted ID in notepad
- [ ] Format check: Long string like `13kaO35...`

---

## 🔑 Part 4: Google Cloud Vision API (5 min)

### Create Project
- [ ] Opened [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Created new project named "DAM Tool"
- [ ] Waited for project creation (30 sec)
- [ ] Clicked notification when ready

### Enable API
- [ ] Searched for "Cloud Vision API"
- [ ] Clicked **Enable** button
- [ ] Waited for API to enable (30 sec)

### Create API Key
- [ ] Navigated to **APIs & Services** → **Credentials**
- [ ] Clicked **Create Credentials** → **API Key**
- [ ] Copied API key (starts with `AIzaSy...`)
- [ ] Pasted key in notepad
- [ ] Clicked **Restrict Key**
- [ ] Selected **Restrict key** under API restrictions
- [ ] Checked ✅ **Cloud Vision API**
- [ ] Clicked **Save**

---

## 💻 Part 5: Apps Script Setup (5 min)

### Open Apps Script
- [ ] Went to Google Sheet
- [ ] Clicked **Extensions** → **Apps Script**
- [ ] New tab opened
- [ ] Deleted placeholder code

### Add Code.gs
- [ ] Opened downloaded `Code.gs` file
- [ ] Selected ALL code (Ctrl+A / Cmd+A)
- [ ] Copied code (Ctrl+C / Cmd+C)
- [ ] Pasted into Apps Script editor
- [ ] Clicked **Save** (💾 icon)
- [ ] Named project "DAM Tool"

### Add DAMTool.html
- [ ] Clicked **+** next to "Files"
- [ ] Selected **HTML**
- [ ] Named it exactly: `DAMTool` (no .html!)
- [ ] Clicked **OK**
- [ ] Deleted placeholder HTML
- [ ] Opened downloaded `DAMTool.html` file
- [ ] Selected ALL and copied
- [ ] Pasted into Apps Script
- [ ] Clicked **Save**

### Verify Files
- [ ] See `Code.gs` in left sidebar
- [ ] See `DAMTool.html` in left sidebar

---

## ⚙️ Part 6: Configure Credentials (3 min)

### Add Setup Function
- [ ] Clicked on `Code.gs`
- [ ] Scrolled to bottom
- [ ] Pasted this function at the end:
```javascript
function setupMyConfig() {
  const scriptProps = PropertiesService.getScriptProperties();
  
  scriptProps.setProperties({
    'VISION_API_KEY': 'YOUR_API_KEY_HERE',
    'DRIVE_FOLDER_ID': 'YOUR_FOLDER_ID_HERE',
    'SPREADSHEET_ID': 'YOUR_SPREADSHEET_ID_HERE'
  });
  
  Logger.log('✅ Configuration saved!');
}
```
- [ ] Replaced `YOUR_API_KEY_HERE` with actual API key from notepad
- [ ] Replaced `YOUR_FOLDER_ID_HERE` with actual folder ID from notepad
- [ ] Replaced `YOUR_SPREADSHEET_ID_HERE` with actual spreadsheet ID from notepad
- [ ] Clicked **Save**

### Run Setup & Authorize
- [ ] Selected `setupMyConfig` from function dropdown
- [ ] Clicked **Run** (▶️ button)
- [ ] Popup appeared: "Authorization required"
- [ ] Clicked **Review permissions**
- [ ] Selected my Google account
- [ ] Clicked **Advanced**
- [ ] Clicked **Go to DAM Tool (unsafe)**
- [ ] Clicked **Allow**
- [ ] Waited for execution (5-10 sec)
- [ ] Clicked **Execution log** at bottom
- [ ] Saw: "✅ Configuration saved!"
- [ ] **DELETED** entire `setupMyConfig` function
- [ ] Clicked **Save**

### Update CONFIG to Use Script Properties
- [ ] Scrolled to top of `Code.gs`
- [ ] Found `CONFIG` section (around line 13)
- [ ] Replaced entire CONFIG with:
```javascript
const CONFIG = {
  VISION_API_KEY: PropertiesService.getScriptProperties().getProperty('VISION_API_KEY'),
  DRIVE_FOLDER_ID: PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID'),
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'),
  SHEET_NAME: 'Assets',
  SUPPORTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']
};
```
- [ ] Clicked **Save**

---

## 🧪 Part 7: Test Configuration (2 min)

### Run Test Sync
- [ ] Selected `syncFromInterface` from function dropdown
- [ ] Clicked **Run** (▶️)
- [ ] Waited 10-15 seconds
- [ ] Clicked **Execution log**
- [ ] Saw: `{ success: true, count: X }` (X = number of images)

### Verify in Sheet
- [ ] Went to Google Sheet tab
- [ ] Refreshed page (F5 / Cmd+R)
- [ ] New sheet tab appeared: "Assets"
- [ ] Clicked "Assets" tab
- [ ] Saw my images listed with File ID, Name, URL, etc.
- [ ] Column G ("AI Tags") is empty (that's OK for now!)

---

## 🚀 Part 8: Deploy Web App (3 min)

### Create Deployment
- [ ] Went to Apps Script tab
- [ ] Clicked **Deploy** → **New deployment**
- [ ] Clicked gear icon ⚙️ next to "Select type"
- [ ] Selected **Web app**
- [ ] Set Description: "DAM Tool v1"
- [ ] Set Execute as: **Me (my-email@gmail.com)**
- [ ] Set Who has access: **Anyone**
- [ ] Clicked **Deploy**
- [ ] Waited 10 seconds
- [ ] **COPIED** entire Web app URL (starts with `https://script.google.com/macros/s/...`)
- [ ] **PASTED** URL in notepad
- [ ] Clicked **Done**

### Connect Frontend
- [ ] Clicked `DAMTool.html` in left sidebar
- [ ] Pressed Ctrl+F / Cmd+F (Find)
- [ ] Searched for: `const baseUrl = '';`
- [ ] Pasted deployment URL between the quotes:
  ```javascript
  const baseUrl = 'https://script.google.com/macros/s/YOUR_URL_HERE/exec';
  ```
- [ ] Clicked **Save**

### Redeploy with URL
- [ ] Clicked **Deploy** → **Manage deployments**
- [ ] Clicked **Edit** icon (✏️) next to deployment
- [ ] Under "Version", selected **New version**
- [ ] Set Description: "Added deployment URL"
- [ ] Clicked **Deploy**
- [ ] Clicked **Done**

---

## 🎉 Part 9: Launch & Tag (2 min)

### Open Web App
- [ ] Opened new browser tab
- [ ] Pasted Web app URL from notepad
- [ ] Pressed Enter
- [ ] DAM Tool interface loaded!
- [ ] Clicked **🔄 Sync** button
- [ ] Saw: "Synced! Found X assets" message

### Tag Images with AI
- [ ] Went to Google Sheet tab
- [ ] Saw menu bar has **🎨 DAM Tool** menu
- [ ] Clicked **🎨 DAM Tool** → **🏷️ Tag All Assets**
- [ ] Waited 30-60 seconds (AI processing!)
- [ ] Popup appeared: "✅ Tagged X assets!"
- [ ] Clicked **OK**
- [ ] Checked column G ("AI Tags") - now filled with tags!

### Test Search
- [ ] Went back to Web app tab
- [ ] Clicked **🔄 Sync** (refresh tags)
- [ ] Saw: "Loaded X assets"
- [ ] Typed a search term (e.g., "person", "blue", "nature")
- [ ] Clicked **🔍 Search**
- [ ] Images appeared as thumbnails!
- [ ] Hovered over image - saw "⬇ Download"
- [ ] Clicked image - downloaded successfully!

---

## 🎯 Part 10: Final Verification (1 min)

### Complete System Test
- [ ] Can sync new images from Drive
- [ ] Can search by tags
- [ ] Can download images
- [ ] Tags are AI-generated and accurate
- [ ] No errors in browser console (F12)

### Bookmark & Organize
- [ ] Bookmarked Web app URL
- [ ] Named bookmark: "My DAM Tool"
- [ ] Saved notepad with all IDs (for reference)
- [ ] Closed unnecessary tabs

---

## 🔒 Security Verification

### Credentials Safety Check
- [ ] API key NOT visible in Code.gs (using Script Properties ✅)
- [ ] Folder ID NOT visible in Code.gs (using Script Properties ✅)
- [ ] Spreadsheet ID NOT visible in Code.gs (using Script Properties ✅)
- [ ] setupMyConfig function DELETED from code ✅
- [ ] API key restricted to Cloud Vision API only ✅

### GitHub Safety (if uploading)
- [ ] Code.gs has empty strings in CONFIG ✅
- [ ] DAMTool.html has empty baseUrl ✅
- [ ] No real credentials in any files ✅
- [ ] .gitignore file present ✅

---

## 📊 Success Criteria

**You're done when ALL of these are true:**

✅ **Can open Web app** → Web app URL loads interface  
✅ **Can sync** → "Synced! Found X assets" message appears  
✅ **Has AI tags** → Column G in Sheet is filled with tags  
✅ **Can search** → Typing search term shows results  
✅ **Can download** → Clicking image downloads file  
✅ **Is secure** → Credentials stored in Script Properties, not code  

---

## 🆘 Troubleshooting Quick Reference

| Problem | Checklist Item to Review |
|---------|-------------------------|
| ❌ "No assets found" | Part 3: Did you upload images? Part 7: Did sync work? |
| ❌ "Error: Invalid response" | Part 8: Did you paste deployment URL in HTML? Did you redeploy? |
| ❌ Search returns nothing | Part 9: Did you run "Tag All Assets"? Check column G in Sheet |
| ❌ "Permission denied" | Part 6: Did you authorize? Try running any function again |
| ❌ "Configuration undefined" | Part 6: Did you update CONFIG to use Script Properties? |
| ❌ HTML file not found | Part 5: Is file named exactly `DAMTool` (no .html)? |

---

## 📞 Need Help?

- 🐛 **Found a bug?** [Open GitHub Issue](https://github.com/kwitykwity/DAMTool/issues)
- 💬 **Have questions?** Check the [Full Deployment Guide](DEPLOYMENT_GUIDE.md)
- 📚 **Need more details?** See [README.md](README.md)

---

## 🎊 Completion Certificate

**I, __________________, successfully deployed my DAM Tool on ___/___/___**

**Total time:** _____ minutes

**Number of assets tagged:** _____

**Favorite feature:** _____________________

---

<div align="center">

### ✅ Checklist Complete!

**You now have a fully functional AI-powered Digital Asset Management system!**

🎉 **Congratulations!** 🎉

**[⭐ Star the repo](https://github.com/kwitykwity/DAMTool)** • **[Share on Twitter](https://twitter.com/intent/tweet?text=I%20just%20built%20an%20AI-powered%20image%20search%20tool%20in%2015%20minutes!)** • **[Report Issues](https://github.com/kwitykwity/DAMTool/issues)**

</div>
