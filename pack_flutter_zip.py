import os
import shutil
import zipfile

def create_flutter_project_zip():
    base_dir = '/tmp/flutter_project'
    if os.path.exists(base_dir):
        shutil.rmtree(base_dir)

    os.makedirs(f"{base_dir}/lib", exist_ok=True)
    os.makedirs(f"{base_dir}/android/app/src/main", exist_ok=True)

    # 1. lib/main.dart
    shutil.copy('src/flutter/main.dart', f"{base_dir}/lib/main.dart")

    # 2. pubspec.yaml
    shutil.copy('public/pubspec.yaml', f"{base_dir}/pubspec.yaml")

    # 3. android/key.properties
    shutil.copy('public/key.properties', f"{base_dir}/android/key.properties")

    # 4. android/app/build.gradle
    shutil.copy('public/build.gradle', f"{base_dir}/android/app/build.gradle")

    # 5. android/app/src/main/AndroidManifest.xml
    shutil.copy('public/AndroidManifest.xml', f"{base_dir}/android/app/src/main/AndroidManifest.xml")

    # 6. android/build.gradle (root)
    with open(f"{base_dir}/android/build.gradle", 'w') as f:
        f.write("""allprojects {
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
""")

    # 7. android/settings.gradle
    with open(f"{base_dir}/android/settings.gradle", 'w') as f:
        f.write("""pluginManagement {
    def flutterSdkPath = {
        def properties = new Properties()
        file("local.properties").withInputStream { properties.load(it) }
        def flutterSdkPath = properties.getProperty("flutter.sdk")
        assert flutterSdkPath != null : "flutter.sdk not set in local.properties"
        return flutterSdkPath
    }()

    includeBuild("$flutterSdkPath/packages/flutter_tools/gradle")

    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

plugins {
    id "dev.flutter.flutter-plugin-loader" version "1.0.0"
    id "com.android.application" version "8.2.1" apply false
    id "org.jetbrains.kotlin.android" version "1.9.22" apply false
}

include ":app"
""")

    # 8. android/gradle.properties
    with open(f"{base_dir}/android/gradle.properties", 'w') as f:
        f.write("""org.gradle.jvmargs=-Xmx4G -XX:MaxMetaspaceSize=1G -XX:+HeapDumpOnOutOfMemoryError
android.useAndroidX=true
android.enableJetifier=true
""")

    # Create zip from base_dir containing lib/, pubspec.yaml, android/
    targets = ['hms-flutter-project.zip', 'public/hms-flutter-project.zip']
    for zip_target in targets:
        os.makedirs(os.path.dirname(zip_target) if os.path.dirname(zip_target) else '.', exist_ok=True)
        with zipfile.ZipFile(zip_target, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(base_dir):
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, base_dir)
                    zipf.write(full_path, rel_path)
        print(f"Created {zip_target} ({os.path.getsize(zip_target)} bytes)")

    # Also list contents to verify
    with zipfile.ZipFile('public/hms-flutter-project.zip', 'r') as zipf:
        print("Zip contents:")
        for info in zipf.infolist():
            print(f"  {info.filename} ({info.file_size} bytes)")

if __name__ == '__main__':
    create_flutter_project_zip()
