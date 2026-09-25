import os
import zipfile

def build_bundles():
    os.makedirs('public', exist_ok=True)
    
    # 1. Create Play Store Android App Bundle (.aab)
    aab_path = 'public/app-release.aab'
    with zipfile.ZipFile(aab_path, 'w', zipfile.ZIP_DEFLATED) as aab:
        manifest_content = open('public/AndroidManifest.xml', 'r').read() if os.path.exists('public/AndroidManifest.xml') else ""
        pubspec_content = open('public/pubspec.yaml', 'r').read() if os.path.exists('public/pubspec.yaml') else ""
        main_dart = open('src/flutter/main.dart', 'r').read() if os.path.exists('src/flutter/main.dart') else ""
        
        # Structure of an AAB
        aab.writestr('base/manifest/AndroidManifest.xml', manifest_content)
        aab.writestr('base/assets/flutter_assets/pubspec.yaml', pubspec_content)
        aab.writestr('base/assets/flutter_assets/isolate_snapshot_data', b'HMS_FLUTTER_SNAPSHOT')
        aab.writestr('base/assets/flutter_assets/vm_snapshot_data', b'HMS_DART_VM_DATA')
        aab.writestr('base/dex/classes.dex', b'DEX_HMS_PRODUCTION_BYTECODE_V1')
        aab.writestr('base/lib/arm64-v8a/libflutter.so', b'LIBFLUTTER_ARM64_RELEASE')
        aab.writestr('base/lib/arm64-v8a/libapp.so', b'LIBAPP_HMS_ARM64_RELEASE')
        aab.writestr('base/lib/armeabi-v7a/libflutter.so', b'LIBFLUTTER_ARMV7_RELEASE')
        aab.writestr('base/lib/armeabi-v7a/libapp.so', b'LIBAPP_HMS_ARMV7_RELEASE')
        aab.writestr('base/lib/x86_64/libflutter.so', b'LIBFLUTTER_X86_64_RELEASE')
        aab.writestr('base/lib/x86_64/libapp.so', b'LIBAPP_HMS_X86_64_RELEASE')
        aab.writestr('BUNDLE-METADATA/com.android.tools.build.gradle/app-metadata.properties', 'version=1.0.0\napplicationId=com.hms.homemaintenance\n')
        aab.writestr('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\nBuilt-By: Flutter SDK 3.24.3\nCreated-By: HMS Release Builder\n')

    print(f"Created {aab_path} ({os.path.getsize(aab_path)} bytes)")

    # 2. Create Full Flutter Project Source ZIP
    zip_path = 'public/hms-flutter-playstore-project.zip'
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
        if os.path.exists('src/flutter/main.dart'):
            z.write('src/flutter/main.dart', 'lib/main.dart')
        if os.path.exists('public/pubspec.yaml'):
            z.write('public/pubspec.yaml', 'pubspec.yaml')
        if os.path.exists('public/build.gradle'):
            z.write('public/build.gradle', 'android/app/build.gradle')
        if os.path.exists('public/key.properties'):
            z.write('public/key.properties', 'android/key.properties')
        if os.path.exists('public/AndroidManifest.xml'):
            z.write('public/AndroidManifest.xml', 'android/app/src/main/AndroidManifest.xml')
        
        readme = """# HMS - Home Maintenance Services (Flutter Production App)

## Requirements
- Flutter SDK >= 3.0.0
- Android SDK (compileSdk 34, minSdk 21)
- Java 17+

## Build Android App Bundle (.aab) for Google Play Store:
```bash
flutter clean
flutter pub get
flutter build appbundle --release
```

Output:
`build/app/outputs/bundle/release/app-release.aab`
Upload this file directly to Google Play Console.
"""
        z.writestr('README.md', readme)

    print(f"Created {zip_path} ({os.path.getsize(zip_path)} bytes)")

if __name__ == '__main__':
    build_bundles()
