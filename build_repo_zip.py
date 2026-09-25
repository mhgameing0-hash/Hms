import os
import zipfile
import shutil

repo_dir = '/tmp/hms_flutter_repo'
if os.path.exists(repo_dir):
    shutil.rmtree(repo_dir)

os.makedirs(f'{repo_dir}/.github/workflows', exist_ok=True)
os.makedirs(f'{repo_dir}/lib', exist_ok=True)
os.makedirs(f'{repo_dir}/android/app/src/main/kotlin/com/hms/homemaintenance', exist_ok=True)
os.makedirs(f'{repo_dir}/android/app/src/main/res/values', exist_ok=True)
os.makedirs(f'{repo_dir}/android/gradle/wrapper', exist_ok=True)

# 1. GitHub Actions workflow
workflow_content = """name: Build Real Flutter Android Release APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'

      - name: Set up Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.19.6'
          channel: 'stable'
          cache: true

      - name: Flutter doctor
        run: flutter doctor -v

      - name: Install Dependencies
        run: flutter pub get

      - name: Build Real Release APK
        run: flutter build apk --release --no-tree-shake-icons

      - name: Build Android App Bundle (AAB)
        run: flutter build appbundle --release --no-tree-shake-icons

      - name: Upload Release APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: hms-app-release-apk
          path: build/app/outputs/flutter-apk/app-release.apk
          if-no-files-found: error

      - name: Upload Release AAB Artifact
        uses: actions/upload-artifact@v4
        with:
          name: hms-app-release-aab
          path: build/app/outputs/bundle/release/app-release.aab
          if-no-files-found: error
"""
with open(f'{repo_dir}/.github/workflows/build-apk.yml', 'w') as f:
    f.write(workflow_content)

# 2. Copy main.dart
shutil.copy('public/main.dart', f'{repo_dir}/lib/main.dart')

# 3. pubspec.yaml
pubspec_content = """name: hms_home_maintenance
description: HMS Home Maintenance System - Pakistan's Civil & Home Services App
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  url_launcher: ^6.2.5
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
"""
with open(f'{repo_dir}/pubspec.yaml', 'w') as f:
    f.write(pubspec_content)

# 4. analysis_options.yaml
with open(f'{repo_dir}/analysis_options.yaml', 'w') as f:
    f.write("""include: package:flutter_lints/flutter.yaml
linter:
  rules:
    prefer_const_constructors: false
    prefer_const_literals_to_create_immutables: false
""")

# 5. android/build.gradle
android_build_gradle = """allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.buildDir = '../build'
subprojects {
    project.buildDir = "${rootProject.buildDir}/${project.name}"
}
subprojects {
    project.evaluationDependsOn(':app')
}

tasks.register("clean", Delete) {
    delete rootProject.buildDir
}
"""
with open(f'{repo_dir}/android/build.gradle', 'w') as f:
    f.write(android_build_gradle)

# 6. android/settings.gradle
settings_gradle = """include ':app'

def localPropertiesFile = new File(rootProject.projectDir, "local.properties")
def properties = new Properties()

assert localPropertiesFile.exists() : "local.properties does not exist"
localPropertiesFile.withReader("UTF-8") { reader -> properties.load(reader) }

def flutterSdkPath = properties.getProperty("flutter.sdk")
assert flutterSdkPath != null : "flutter.sdk not set in local.properties"
apply from: "$flutterSdkPath/packages/flutter_tools/gradle/app_plugin_loader.gradle"
"""
with open(f'{repo_dir}/android/settings.gradle', 'w') as f:
    f.write(settings_gradle)

# 7. android/gradle.properties
with open(f'{repo_dir}/android/gradle.properties', 'w') as f:
    f.write("""org.gradle.jvmargs=-Xmx4G -XX:MaxMetaspaceSize=1G
android.useAndroidX=true
android.enableJetifier=true
""")

# 8. android/app/build.gradle
app_build_gradle = """def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '1'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.0'
}

apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply from: "$flutterRoot/packages/flutter_tools/gradle/flutter.gradle"

android {
    namespace "com.hms.homemaintenance"
    compileSdkVersion 34
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }

    defaultConfig {
        applicationId "com.hms.homemaintenance"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
        multiDexEnabled true
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled false
            shrinkResources false
        }
    }
}

flutter {
    source '../..'
}

dependencies {}
"""
with open(f'{repo_dir}/android/app/build.gradle', 'w') as f:
    f.write(app_build_gradle)

# 9. AndroidManifest.xml
manifest = """<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.hms.homemaintenance">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.CALL_PHONE"/>

    <application
        android:label="HMS Home Maintenance"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
"""
with open(f'{repo_dir}/android/app/src/main/AndroidManifest.xml', 'w') as f:
    f.write(manifest)

# 10. MainActivity.kt
main_activity = """package com.hms.homemaintenance

import io.flutter.embedding.android.FlutterActivity

class MainActivity: FlutterActivity() {
}
"""
with open(f'{repo_dir}/android/app/src/main/kotlin/com/hms/homemaintenance/MainActivity.kt', 'w') as f:
    f.write(main_activity)

# 11. styles.xml
styles = """<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="LaunchTheme" parent="@android:style/Theme.Black.NoTitleBar">
        <item name="android:windowBackground">@android:color/black</item>
    </style>
    <style name="NormalTheme" parent="@android:style/Theme.Black.NoTitleBar">
        <item name="android:windowBackground">?android:colorBackground</item>
    </style>
</resources>
"""
with open(f'{repo_dir}/android/app/src/main/res/values/styles.xml', 'w') as f:
    f.write(styles)

# 12. gradle-wrapper.properties
with open(f'{repo_dir}/android/gradle/wrapper/gradle-wrapper.properties', 'w') as f:
    f.write("""distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.3-all.zip
""")

# 13. README.md with comprehensive instructions
readme = """# HMS Home Maintenance System (Flutter Android App)

مکمل اینڈرائیڈ فلٹر پراجیکٹ برائے ہوم مینٹیننس سسٹم (پاکستان)

---

## حقیقی 35MB+ ریلیز APK تیار کرنے کے طریقے (How to Build the Real 35MB Release APK)

اینڈرائیڈ پر 19KB کی فائل اس لیے Parse نہیں ہوتی کیونکہ حقیقی اینڈرائیڈ بائنری (Compiled Bytecode / DEX) تقریباً 25MB سے 40MB کی ہوتی ہے۔ نیچے دیے گئے کسی بھی طریقے سے اصلی بائنری حاصل کریں:

### طریقہ نمبر 1: گٹ ہب ایکشنز سے مفت خودکار بلڈ (GitHub Actions - 100% Free & Automatic)
1. اپنے گٹ ہب (`github.com`) اکاؤنٹ پر جائیں اور نیو ریپوزٹری بنائیں: **`hms-flutter-app`**
2. اس ZIP فائل کے تمام فولڈرز اور فائلز گٹ ہب ریپوزٹری میں اپلوڈ / پش کریں (یا گٹ ہب ویب سائٹ پر ڈریگ اینڈ ڈراپ کریں)۔
3. جیسے ہی آپ پش کریں گے، ریپوزٹری میں موجود **`.github/workflows/build-apk.yml`** خودکار طریقے سے چل پڑے گا۔
4. گٹ ہب کے **"Actions"** ٹیب میں جائیں -> **"Build Real Flutter Android Release APK"** پر کلک کریں۔
5. بلڈ مکمل ہونے پر (2 سے 3 منٹ بعد) نیچے **Artifacts** سیکشن سے اصلی **`hms-app-release-apk`** (حجم تقریباً 35MB) ڈاؤنلوڈ کریں اور کسی بھی اینڈرائیڈ فون پر انسٹال کریں!

---

### طریقہ نمبر 2: گٹ ہب کوڈ سپیسز (GitHub Codespaces - براؤزر میں 1 کلک بلڈ)
1. گٹ ہب پر اپنی ریپوزٹری میں سبز بٹن **"Code"** پر کلک کریں۔
2. **"Codespaces"** -> **"Create codespace on main"** منتخب کریں۔
3. براؤزر میں ٹرمینل کھل جائے گا۔ صرف یہ 2 کمانڈز ٹائپ کریں:
   ```bash
   flutter pub get
   flutter build apk --release
   ```
4. بائیں فائل پینل میں `build/app/outputs/flutter-apk/app-release.apk` پر رائٹ کلک کر کے **"Download"** کریں!

---

### طریقہ نمبر 3: اپنے کمپیوٹر پر (Local Machine / Android Studio)
اگر آپ کے کمپیوٹر پر Flutter انسٹال ہے:
```bash
flutter pub get
flutter build apk --release
```
فائل یہاں بنے گی:
`build/app/outputs/flutter-apk/app-release.apk`

---

## ایپ کی خصوصیات (Features)
- 13 سول اور ہوم مینٹیننس شعبہ جات (Civil, Electrical, Plumbing, Paint, etc.)
- 3D واٹر گلاس ایفیکٹس اور اینیمیشنز
- کاریگر پروفائلز، تصدیق اور پورٹ فولیو
- کاریگر ورکر والٹ (Worker Wallet) اور جاب بکنگ
- مکمل اردو اور انگلش سپورٹ
"""
with open(f'{repo_dir}/README.md', 'w') as f:
    f.write(readme)

# Create the zip
output_zip = 'public/hms-flutter-github-repo.zip'
with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(repo_dir):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, repo_dir)
            z.write(full_path, arcname=rel_path)

print('Created hms-flutter-github-repo.zip successfully! Size:', os.path.getsize(output_zip), 'bytes')
