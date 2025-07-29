#!/bin/bash

# Monitor Service EXE Builder Script
# Bu script Windows executable oluşturmak için kullanılır

echo "📦 Monitor Service EXE Builder"
echo "================================"

# Proje kök dizinini kontrol et
if [ ! -f "package.json" ]; then
    echo "❌ Hata: package.json bulunamadı. Lütfen proje kök dizininden çalıştırın."
    exit 1
fi

# Gerekli paketleri kontrol et
echo "🔍 Gerekli paketler kontrol ediliyor..."
if ! command -v pkg &> /dev/null; then
    echo "📥 pkg paketi kuruluyor..."
    npm install -g pkg
fi

# Windows executable oluştur
echo "🏗️  Windows executable oluşturuluyor..."
npx pkg . --targets node18-win-x64 --output monitor.exe

# Başarı kontrolü
if [ $? -eq 0 ]; then
    echo "✅ Başarılı! monitor.exe oluşturuldu."
    ls -la monitor.exe
else
    echo "❌ Hata oluştu!"
    exit 1
fi

# Opsiyonel: diğer platformlar için
# echo "🔄 Diğer platformlar için build..."
# npx pkg . --targets node18-linux-x64 --output monitor-linux
# npx pkg . --targets node18-macos-x64 --output monitor-macos

echo "🎉 İşlem tamamlandı!"