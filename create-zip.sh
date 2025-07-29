#!/bin/bash

# Monitor Service ZIP Creator Script
# Bu script dağıtım için zip paketi oluşturur

echo "📦 Monitor Service ZIP Creator"
echo "==============================="

# Proje kök dizinini kontrol et
if [ ! -f "package.json" ]; then
    echo "❌ Hata: package.json bulunamadı. Lütfen proje kök dizininden çalıştırın."
    exit 1
fi

# Build klasörünü temizle
if [ -d "dist" ]; then
    echo "🧹 dist klasörü temizleniyor..."
    rm -rf dist
fi

mkdir -p dist

# Windows executable oluştur
if [ -f "build-exe.sh" ]; then
    echo "🏗️  Windows executable oluşturuluyor..."
    ./build-exe.sh
else
    echo "⚠️  build-exe.sh bulunamadı, sadece dosyaları zip'liyorum..."
fi

# Dağıtım dosyalarını kopyala
echo "📂 Dağıtım dosyaları kopyalanıyor..."

# Temel dosyaları kopyala
cp monitor.exe dist/ 2>/dev/null || echo "⚠️  monitor.exe bulunamadı, atlanıyor"
cp -r config dist/
cp *.bat dist/
cp *.md dist/
cp package.json dist/

# Logs klasörünü oluştur (boş)
mkdir -p dist/logs

# ZIP dosyası oluştur
echo "🗜️  ZIP paketi oluşturuluyor..."
VERSION=$(grep -o '"version": *"[^"]*"' package.json | cut -d'"' -f4)
ZIP_NAME="monitor-service-v${VERSION}.zip"

if command -v zip >/dev/null 2>&1; then
    # Linux/macOS zip kullanımı
    zip -r "$ZIP_NAME" dist/
else
    # Windows için alternatif (WSL veya Git Bash)
    if command -v 7z >/dev/null 2>&1; then
        7z a "$ZIP_NAME" dist/
    else
        echo "❌ ZIP oluşturma aracı bulunamadı (zip veya 7z)"
        exit 1
    fi
fi

# İstatistikleri göster
if [ -f "$ZIP_NAME" ]; then
    echo "✅ Başarılı! ZIP oluşturuldu: $ZIP_NAME"
    ls -lh "$ZIP_NAME"
else
    echo "❌ ZIP oluşturulamadı!"
    exit 1
fi

echo "🎉 ZIP paketi hazır!"