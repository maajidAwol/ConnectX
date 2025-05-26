# App Icon Update Guide

## 📱 How to Update Your App Icon

### Step 1: Prepare Your Logo
1. **Place your `app_logo.png` file** in the `assets/logo/` directory
2. **Requirements:**
   - Size: 1024x1024 pixels (minimum)
   - Format: PNG with transparent background (recommended)
   - High resolution for best quality

### Step 2: Generate Icons
Run these commands in your terminal:

```bash
# Get dependencies (if needed)
flutter pub get

# Generate app icons for all platforms
flutter pub run flutter_launcher_icons:main
```

### Step 3: Clean and Rebuild
```bash
# Clean the build
flutter clean

# Get dependencies again
flutter pub get

# Build for your target platform
flutter run
```

## 🎯 What This Will Generate

### Android
- `launcher_icon.png` in various sizes (mipmap folders)
- Adaptive icons for Android 8.0+

### iOS  
- `AppIcon.appiconset` with all required sizes
- Supports all iOS devices and orientations

### Web
- `favicon.ico` and web app icons
- PWA-ready icons

### Windows & macOS
- Platform-specific icon formats
- Proper sizes for desktop applications

## 🔧 Configuration Details

Your current configuration in `pubspec.yaml`:
- **Image Path**: `assets/logo/app_logo.png`
- **Background Color**: White (`#FFFFFF`)
- **Theme Color**: Sky Blue (`#039BE5`) - matches your app theme
- **Platforms**: Android, iOS, Web, Windows, macOS

## 🚨 Important Notes

1. **Backup**: The tool will replace existing icons
2. **Testing**: Test on multiple devices/simulators
3. **Size**: Ensure your logo is clearly visible at small sizes
4. **Transparency**: Use transparent backgrounds for better adaptation

## 🔄 If You Need to Update Again

1. Replace `app_logo.png` with your new logo
2. Run `flutter pub run flutter_launcher_icons:main`
3. Clean and rebuild your app

## 📋 Verification Checklist

- [ ] Logo placed in `assets/logo/app_logo.png`
- [ ] Run `flutter pub run flutter_launcher_icons:main`
- [ ] No errors in terminal output
- [ ] `flutter clean` completed
- [ ] App rebuilt successfully
- [ ] Icon appears correctly on home screen
- [ ] Icon looks good at different sizes 