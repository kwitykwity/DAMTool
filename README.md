# 🎨 Kwitykwity DAM Tool - Complete Setup Guide

**A Digital Asset Management tool that uses AI to automatically tag your images!**

---

## ⚡ What You'll Build

By the end of this guide, you'll have:
- 🤖 **AI-powered image tagging** using Google Cloud Vision
- 🔍 **Instant search** across all your assets
- 🖼️ **Beautiful thumbnail gallery** 
- ⬇️ **One-click downloads**
- 🔄 **Auto-sync** with Google Drive
- 💯 **100% FREE** using Google's free tier!

**⏱️ Total time: 15-20 minutes**

---

## 📋 Prerequisites

Before you start, make sure you have:
- ✅ A Google account (Gmail)
- ✅ Basic ability to copy/paste
- ✅ 3-5 test images ready to upload

**No coding experience needed!** 🎉

---

## 🚀 Part 1: Get the Code (5 minutes)

### Step 1: Download the Files

**Option A: Download ZIP (Easiest)**
1. Go to [github.com/kwitykwity/DAMTool](https://github.com/kwitykwity/DAMTool)
2. Click the green **Code** button
3. Click **Download ZIP**
4. Extract the ZIP file to your computer
5. You should see: `Code.gs` and `DAMTool.html`

**Option B: Clone with Git**
```bash
git clone https://github.com/kwitykwity/DAMTool.git
cd DAMTool
```

✅ **Checkpoint:** You have `Code.gs` and `DAMTool.html` files on your computer

---

## 📊 Part 2: Create Your Google Sheet (2 minutes)

### Step 2: Make Your Database

1. 🌐 Go to [sheets.google.com](https://sheets.google.com)
2. ➕ Click **Blank** to create a new spreadsheet
3. 📝 At the top, click "Untitled spreadsheet"
4. 🎯 Rename it: **"DAM Database"** (or any name you like)
5. ✅ Leave this tab open!

🎉 **You now have your database!**

---

## 🗂️ Part 3: Create Your Image Folder (2 minutes)

### Step 3: Set Up Google Drive Folder

1. 🌐 Go to [drive.google.com](https://drive.google.com)
2. ➕ Click **New** → **Folder**
3. 📁 Name it: **"DAM Assets"** (or any name)
4. 📸 **Upload 3-5 test images** to this folder
   - Supported: JPG, PNG, GIF, WebP, BMP
5. 🔗 **Get the Folder ID:**
   - Open the folder
   - Look at the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Copy the ID (the long string after `/folders/`)
   - Example: `13kaO35wK7x3pGQrrCL7b0FGgVw5NjUP`
6. 📋 **Paste it in a notepad** - you'll need it soon!

✅ **Checkpoint:** You have a folder with images and the Folder ID saved

---

## 🔑 Part 4: Get Your API Key (5 minutes)

### Step 4: Enable Google Cloud Vision API

**🎯 This is what gives your tool AI superpowers!**

1. 🌐 Go to [console.cloud.google.com](https://console.cloud.google.com)
2. 🆕 Click **Select a project** → **New Project**
3. 📝 Name it: **"DAM Tool"**
4. ⏳ Click **Create** (wait 30 seconds)
5. 🔔 Click the notification bell when it's ready

**Enable the Vision API:**
1. 🔍 In the search bar at top, type: **"Cloud Vision API"**
2. 📱 Click **Cloud Vision API** from results
3. 💙 Click the blue **Enable** button
4. ⏳ Wait 30 seconds for it to enable

**Create Your API Key:**
1. 🔧 Click **APIs & Services** → **Credentials** (left sidebar)
2. ➕ Click **+ Create Credentials** (top)
3. 🔑 Select **API Key**
4. 🎉 A popup shows your key: `AIzaSy...`
5. 📋 Click **Copy** and paste in your notepad
6. ⚙️ Click **Restrict Key** (important for security!)
7. Under "API restrictions":
   - Select **Restrict key**
   - Check ✅ **Cloud Vision API**
8. 💾 Click **Save**

✅ **Checkpoint:** You have your API key saved (starts with `AIzaSy...`)

---

## 📇 Part 5: Get Your Spreadsheet ID (1 minute)

### Step 5: Find Your Sheet ID

1. 🔙 Go back to your Google Sheet tab
2. 👀 Look at the URL in the address bar:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
3. 📋 Copy the ID between `/d/` and `/edit`
   - Example: `1H5o5NsDuqx5N9g9tXqNNVynAqqoWYqbCYcdjwfy31rQ`
4. 📝 Paste it in your notepad

✅ **Checkpoint:** You now have all three IDs saved:
- ✅ API Key
- ✅ Drive Folder ID  
- ✅ Spreadsheet ID

---

## 💻 Part 6: Add the Code (5 minutes)

### Step 6a: Open Apps Script

1. 🔙 Go to your Google Sheet
2. 🧩 Click **Extensions** → **Apps Script**
3. 🆕 A new tab opens with Apps Script editor
4. 🗑️ Delete the placeholder code: `function myFunction() { ... }`

### Step 6b: Add Backend Code

1. 📂 Open the `Code.gs` file you downloaded
2. 📋 **Select ALL the code** (Ctrl+A / Cmd+A)
3. 📋 **Copy** it (Ctrl+C / Cmd+C)
4. 🖥️ Go back to Apps Script tab
5. 📋 **Paste** the code (Ctrl+V / Cmd+V)
6. 💾 Click the **Save** icon (💾) at top
7. 📝 Name the project: **"DAM Tool"**

### Step 6c: Add HTML Interface

1. ➕ Click the **+** button next to "Files" (left sidebar)
2. 📄 Select **HTML**
3. ⚠️ **IMPORTANT:** Name it exactly: `DAMTool` (no .html extension!)
4. ✅ Click **OK**
5. 🗑️ Delete the placeholder HTML
6. 📂 Open the `DAMTool.html` file you downloaded
7. 📋 **Select ALL** and **Copy**
8. 🖥️ Go back to Apps Script
9. 📋 **Paste** into the DAMTool file
10. 💾 Click **Save**

✅ **Checkpoint:** You should see two files in the left sidebar:
- ✅ Code.gs
- ✅ DAMTool.html

---

## ⚙️ Part 7: Configure Your Credentials (3 minutes)

### Step 7: Add Your Secret Keys

**🔒 This keeps your credentials secure and private!**

1. 🖥️ In Apps Script, go to **Code.gs**
2. 📜 Scroll to the very bottom
3. ➕ **Add this function** at the end:

```javascript
function setupMyConfig() {
  const scriptProps = PropertiesService.getScriptProperties();
  
  scriptProps.setProperties({
    'VISION_API_KEY': 'PASTE_YOUR_API_KEY_HERE',
    'DRIVE_FOLDER_ID': 'PASTE_YOUR_FOLDER_ID_HERE',
    'SPREADSHEET_ID': 'PASTE_YOUR_SPREADSHEET_ID_HERE'
  });
  
  Logger.log('✅ Configuration saved!');
}
```

4. 📋 Replace the three placeholder values with YOUR actual IDs from your notepad
5. 💾 Click **Save**

**Run the Setup:**
1. 🎯 In the function dropdown at top, select **setupMyConfig**
2. ▶️ Click **Run** (the play button)
3. 🔐 A popup appears: **"Authorization required"**
4. 🔵 Click **Review permissions**
5. 👤 Choose your Google account
6. ⚠️ Click **Advanced** → **Go to DAM Tool (unsafe)**
   - Don't worry! It's safe - Google marks all custom scripts this way
7. ✅ Click **Allow**
8. ⏳ Wait for it to run (5-10 seconds)
9. 📊 Click **Execution log** (bottom) - you should see: "✅ Configuration saved!"
10. 🗑️ **DELETE the entire `setupMyConfig` function** (important for security!)
11. 💾 Click **Save**

### Update Code to Use Secure Config

1. 📜 Scroll to the top of Code.gs
2. 🔍 Find the `CONFIG` section (around line 13)
3. 🔄 Replace it with this:

```javascript
const CONFIG = {
  VISION_API_KEY: PropertiesService.getScriptProperties().getProperty('VISION_API_KEY'),
  DRIVE_FOLDER_ID: PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID'),
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'),
  SHEET_NAME: 'Assets',
  SUPPORTED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']
};
```

4. 💾 Click **Save**

✅ **Checkpoint:** Your credentials are now stored securely!

---

## 🧪 Part 8: Test It Works (2 minutes)

### Step 8: Quick Test

1. 🎯 In the function dropdown, select **syncFromInterface**
2. ▶️ Click **Run**
3. ⏳ Wait 10-15 seconds
4. 📊 Click **Execution log** (bottom panel)
5. ✅ You should see: `{ success: true, count: 3 }` (or however many images you uploaded)

**Check Your Sheet:**
1. 🔙 Go back to your Google Sheet tab
2. 🔄 Refresh the page
3. 🎉 You should see a new sheet tab called **"Assets"**
4. 📋 Click it - your images are listed!

✅ **Checkpoint:** Your images are synced to the sheet!

---

## 🚀 Part 9: Deploy Your Web App (3 minutes)

### Step 9a: Create Deployment

1. 🔙 Go back to Apps Script tab
2. 🚀 Click **Deploy** → **New deployment**
3. ⚙️ Click the gear icon next to "Select type"
4. 🌐 Select **Web app**
5. ⚙️ Configure settings:
   - 📝 Description: **"DAM Tool v1"**
   - 🔧 Execute as: **Me (your-email@gmail.com)**
   - 🌍 Who has access: **Anyone**
6. 🚀 Click **Deploy**
7. ⏳ Wait 10 seconds
8. 📋 **CRITICAL:** Copy the entire Web app URL
   - Looks like: `https://script.google.com/macros/s/AKfycby.../exec`
   - Click **Copy** button
   - Or select all and Ctrl+C / Cmd+C
9. 📝 **Paste it in your notepad!**
10. ✅ Click **Done**

### Step 9b: Connect the Frontend

1. 🖥️ In Apps Script, click **DAMTool.html** (left sidebar)
2. 🔍 Press Ctrl+F / Cmd+F to open Find
3. 🔎 Search for: `const baseUrl = '';`
4. 📋 Paste your deployment URL between the quotes:
   ```javascript
   const baseUrl = 'https://script.google.com/macros/s/AKfycby.../exec';
   ```
5. 💾 Click **Save**

### Step 9c: Redeploy with Updated URL

⚠️ **IMPORTANT - Don't skip this!**

1. 🚀 Click **Deploy** → **Manage deployments**
2. ✏️ Click the **Edit** icon (pencil) next to your deployment
3. 🔄 Under "Version", click **New version**
4. 📝 Description: **"Added deployment URL"**
5. 🚀 Click **Deploy**
6. ✅ Click **Done**

✅ **Checkpoint:** Your web app is deployed and connected!

---

## 🎉 Part 10: Launch Your DAM Tool! (2 minutes)

### Step 10: Open Your App

1. 📋 Get your Web app URL from your notepad
2. 🌐 Open a **new browser tab**
3. 📋 Paste the URL and press Enter
4. 🎨 **Your DAM Tool loads!**

### First-Time Setup:

1. 🔄 Click the **🔄 Sync** button
   - Status shows: "Synced! Found 3 assets" ✅
2. 🔙 Go back to your Google Sheet tab
3. 🧩 In the menu bar, you'll see: **🎨 DAM Tool**
4. 📋 Click **🎨 DAM Tool** → **🏷️ Tag All Assets**
5. ⏳ Wait 30-60 seconds (AI is tagging your images!)
6. ✅ Popup: "Tagged 3 assets!"
7. 🔙 Go back to your web app tab
8. 🔄 Click **🔄 Sync** again (refreshes the tags)

### Try Searching:

1. 🔍 In the search box, type a word related to your images
   - Examples: "person", "nature", "blue", "outdoor"
2. 🔎 Click **🔍 Search**
3. 🎉 **Your images appear as thumbnails!**
4. 🖱️ **Hover over any image** - you'll see "⬇ Download"
5. 🖱️ **Click any image** - it downloads instantly!

---

## 🎊 Congratulations! You're Done!

### 🌟 What You Built:

✅ AI-powered image search engine  
✅ Automatic tagging with Google Cloud Vision  
✅ Beautiful visual gallery interface  
✅ One-click downloads  
✅ Two-way sync with Google Drive  
✅ 100% FREE using Google's free tier!  

### 📌 Pro Tips:

💾 **Bookmark your Web app URL** - that's your personal DAM Tool!  

📸 **Add more images:**
1. Upload to your Drive folder
2. Open web app
3. Click 🔄 Sync
4. Go to Sheet → 🎨 DAM Tool → 🏷️ Tag All Assets
5. Back to web app → 🔄 Sync
6. Search away!

🔒 **Keep it secure:**
- Never share your API key
- Your credentials are safely stored in Script Properties
- Your deployment URL is private (only you can use it)

🎨 **Customize it:**
- Change colors in the CSS
- Modify the search logic
- Add more features!

---

## 🆘 Troubleshooting

### ❌ "No assets found"
- Check: Did you upload images to the Drive folder?
- Check: Did you click Sync in the web app?
- Solution: Upload images, then click Sync

### ❌ "Error: Invalid response format"
- Check: Did you paste the deployment URL in DAMTool.html?
- Check: Did you redeploy after adding the URL?
- Solution: Go back to Step 9b and 9c

### ❌ Search returns nothing
- Check: Did you run "Tag All Assets" from the Sheet menu?
- Check: Are the tags actually in column G of your sheet?
- Solution: Sheet → 🎨 DAM Tool → 🏷️ Tag All Assets

### ❌ "You do not have permission"
- Check: Did you run the authorization in Step 7?
- Solution: Apps Script → Select any function → Run → Allow permissions

### 🐛 Still stuck?
- Open browser console (F12) and check for errors
- Check Apps Script Execution Log
- Open a GitHub issue with screenshots

---

## 📚 How It Works

```
┌─────────────────┐
│  Google Drive   │  ← You upload images here
│   (Storage)     │
└────────┬────────┘
         │
         ↓ Sync
┌─────────────────┐
│ Google Sheets   │  ← Metadata database
│  (Database)     │
└────────┬────────┘
         │
         ↓ Cloud Vision API
┌─────────────────┐
│  AI Tagging     │  ← Generates tags automatically
│   (Vision API)  │
└────────┬────────┘
         │
         ↓ Search
┌─────────────────┐
│  Web Interface  │  ← You search and download here
│   (DAMTool)     │
└─────────────────┘
```

---

## 🛡️ Security Checklist

- ✅ API keys stored in Script Properties (not in code)
- ✅ Credentials never committed to GitHub
- ✅ API key restricted to Cloud Vision API only
- ✅ Web app runs under your account (not public scripts)
- ✅ All data stays in YOUR Google account

---

## 🎯 Next Steps

🚀 **Share it:**
- Deploy for your team
- Each person needs their own setup (15 min each)

🎨 **Customize it:**
- Fork the repo
- Modify colors, layout, features
- Submit pull requests!

💡 **Extend it:**
- Add more file types
- Integrate with other tools
- Build a mobile interface

---

## 📞 Support & Community

💬 **Questions?** Open a GitHub Issue  
🐛 **Found a bug?** Submit a Pull Request  
⭐ **Like it?** Star the repo!  
🎉 **Share it!** Help others find it  

---

## 📄 License

MIT License - Free to use and modify!

---

<div align="center">

### 🎨 Made with 💜 by Kwitykwity

**[GitHub](https://github.com/kwitykwity)** • **[Live Demo](https://kwitykwity.github.io/DAMTool/)** • **[Report Issue](https://github.com/kwitykwity/DAMTool/issues)**

⭐ **Star this repo if it helped you!** ⭐

</div>
