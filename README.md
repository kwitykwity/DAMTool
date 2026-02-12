# Kwitykwity DAM Tool

A Digital Asset Management tool built with Google Apps Script that uses AI to automatically tag images.

## 🔒 Security Note

**IMPORTANT:** This repository does NOT include API keys or credentials. You must set up your own.

## 🚀 Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/kwitykwity-dam.git
cd kwitykwity-dam
```

### Step 2: Get Your API Credentials

#### Google Cloud Vision API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Cloud Vision API"
4. Go to APIs & Services → Credentials
5. Create API Key
6. Copy the API key (starts with `AIza...`)

#### Google Drive Folder ID:
1. Create a folder in Google Drive for your assets
2. Open the folder
3. Copy the ID from the URL: `https://drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE`

### Step 3: Configure the Script

#### Option A: Using Script Properties (Recommended - Most Secure)

1. Open your Google Sheet
2. Go to Extensions → Apps Script
3. Copy the code from `Code.gs` into the Apps Script editor
4. Create a temporary function:

```javascript
function setupMyConfig() {
  const scriptProps = PropertiesService.getScriptProperties();
  
  scriptProps.setProperties({
    'VISION_API_KEY': 'AIzaSy...',  // Your actual API key
    'DRIVE_FOLDER_ID': '13kaO35...'  // Your actual folder ID
  });
  
  Logger.log('✅ Configured!');
}
```

5. Run the function: Select `setupMyConfig` from dropdown → Click Run
6. **Delete the function** after running
7. Your credentials are now stored securely

#### Option B: Using Environment Variables (For clasp users)

Create `.env` file (gitignored):
```
VISION_API_KEY=your_api_key_here
DRIVE_FOLDER_ID=your_folder_id_here
```

### Step 4: Deploy

1. In Apps Script, click **Deploy** → **New deployment**
2. Click gear icon → Select **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the Web App URL

### Step 5: Update the HTML

In `DAMTool.html`, replace line 257:

```javascript
const baseUrl = 'YOUR_WEB_APP_URL_HERE';
```

With your actual deployment URL.

## 📂 Project Structure

```
├── Code.gs                 # Main backend logic (safe for GitHub)
├── DAMTool.html           # Frontend interface
├── config.template.gs     # Template for configuration
├── .gitignore            # Prevents secrets from being committed
└── README.md             # This file
```

## 🔐 What's Safe to Commit?

✅ **SAFE:**
- `Code.gs` (uses Script Properties, no hardcoded keys)
- `DAMTool.html`
- `README.md`
- `.gitignore`
- `config.template.gs`

❌ **NEVER COMMIT:**
- Actual API keys
- Actual folder IDs
- `config.local.gs` (your personal config)
- `.env` files

## 🎯 Features

- 🔍 **AI-Powered Search** - Find assets by automatically generated tags
- 🖼️ **Thumbnail Gallery** - Visual browsing with 1.5" thumbnails
- ⬇️ **One-Click Download** - Click any thumbnail to download
- 🔄 **Two-Way Sync** - Automatically syncs with Google Drive
- 🏷️ **Auto-Tagging** - Google Cloud Vision API generates tags
- 📊 **Spreadsheet Database** - All metadata stored in Google Sheets

## 🛠️ Tech Stack

- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **Storage:** Google Drive
- **AI:** Google Cloud Vision API
- **Frontend:** HTML/CSS/JavaScript

## 📝 License

MIT License - Feel free to use and modify!

## ⚠️ Security Best Practices

1. **Never commit API keys** to version control
2. **Use Script Properties** for storing credentials
3. **Rotate API keys** regularly
4. **Restrict API key** usage in Google Cloud Console
5. **Review** `.gitignore` before every commit

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. **DO NOT** commit your config files
4. Submit a pull request

## 📧 Support

For issues or questions, please open a GitHub issue.

---

Made with 💜 by Kwitykwity
