# Gmail SMTP Güvenli Kurulum Rehberi

Google'ın 2025 yeni güvenlik politikalarına göre Gmail SMTP kullanımı için güncel kurulum rehberi.

## 🚨 ÖNEMLİ: Güvenlik Politikası Değişikliği

**Başlangıç: Ocak 2025**
- Artık sadece kullanıcı adı/şifre ile giriş desteklenmiyor
- Uygulama şifresi veya OAuth2 gereklidir
- "Less secure apps" tamamen kaldırıldı

## ✅ Güvenli 3 Yöntem

### 1. Uygulama Şifresi ile (Önerilen)

#### Adım 1: 2FA Açın
1. Google Hesabınıza gidin: https://myaccount.google.com/
2. Güvenlik > 2-Adımlı Doğrulama
3. 2FA'yı aktif edin

#### Adım 2: Uygulama Şifresi Oluşturun
1. https://myaccount.google.com/apppasswords adresine gidin
2. "Uygulama şifresi oluştur" seçin
3. Uygulama: "Posta" veya "Diğer"
4. Cihaz: "Windows Bilgisayar" veya "Özel"
5. 16 karakterlik şifreyi kopyalayın

#### Adım 3: settings.json Güncelle
```json
{
  "mail": {
    "from": "senin-email@gmail.com",
    "to": "hedef-email@gmail.com",
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 465,
      "secure": true,
      "user": "senin-email@gmail.com",
      "pass": "16-karakter-uygulama-sifresi"
    }
  }
}
```

### 2. OAuth2 ile (Gelişmiş)

settings.json için OAuth2 konfigürasyonu:
```json
{
  "mail": {
    "from": "senin-email@gmail.com",
    "to": "hedef-email@gmail.com",
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 465,
      "secure": true,
      "auth": {
        "type": "OAuth2",
        "user": "senin-email@gmail.com",
        "clientId": "your-client-id.apps.googleusercontent.com",
        "clientSecret": "your-client-secret",
        "refreshToken": "your-refresh-token"
      }
    }
  }
}
```

### 3. Alternatif SMTP Sağlayıcılar

#### Outlook/Hotmail
```json
{
  "mail": {
    "from": "senin-email@outlook.com",
    "to": "hedef-email@example.com",
    "smtp": {
      "host": "smtp-mail.outlook.com",
      "port": 587,
      "secure": false,
      "user": "senin-email@outlook.com",
      "pass": "uygulama-sifresi"
    }
  }
}
```

#### Yahoo Mail
```json
{
  "mail": {
    "from": "senin-email@yahoo.com",
    "to": "hedef-email@example.com",
    "smtp": {
      "host": "smtp.mail.yahoo.com",
      "port": 465,
      "secure": true,
      "user": "senin-email@yahoo.com",
      "pass": "uygulama-sifresi"
    }
  }
}
```

## 🔧 Sorun Giderme

### Yaygın Hatalar ve Çözümleri

#### 1. "Invalid login" veya "Authentication failed"
**Çözüm:**
- Uygulama şifresi kullanın, normal şifre değil
- 2FA'nın aktif olduğundan emin olun
- Uygulama şifresini yeniden oluşturun

#### 2. "Less secure apps" hatası
**Çözüm:**
- Artık bu seçenek yok, uygulama şifresi kullanın
- OAuth2 veya alternatif SMTP sağlayıcı kullanın

#### 3. "Too many login attempts"
**Çözüm:**
- 15-30 dakika bekleyin
- Uygulama şifresini yeniden oluşturun
- IP adresinizi kontrol edin

#### 4. "Connection timeout"
**Çözüm:**
- Güvenlik duvarı/antivirus kontrol edin
- Port 587 veya 465'ın açık olduğundan emin olun
- İnternet bağlantısını kontrol edin

## 🚀 Hızlı Kurulum

### 1. Uygulama Şifresi Al
```bash
# Terminal'de test et
curl -X POST "https://accounts.google.com/o/oauth2/token" \
  -d "client_id=your-client-id" \
  -d "client_secret=your-client-secret" \
  -d "refresh_token=your-refresh-token" \
  -d "grant_type=refresh_token"
```

### 2. Test Scripti ile Kontrol
```bash
node test-mail-direct.js
```

### 3. Ayar Dosyasını Güncelle
```bash
# Gmail için
cp config/settings-gmail.json config/settings.json

# Alternatif için
cp config/settings-outlook.json config/settings.json
```

## 📋 Güvenlik Kontrol Listesi

- [ ] 2FA aktif
- [ ] Uygulama şifresi oluşturuldu
- [ ] settings.json güncellendi
- [ ] Test maili gönderildi
- [ ] Alternatif SMTP hazır

## 🆘 Acil Durum

Eğer Gmail çalışmıyorsa:
1. **Outlook** veya **Yahoo** kullanın
2. **Professional SMTP** (SendGrid, Mailgun) kullanın
3. **Şirket e-postası** kullanın

## 📞 Destek

- Gmail Yardım: https://support.google.com/mail
- Uygulama şifresi: https://support.google.com/accounts/answer/185833
- OAuth2 Dokümantasyonu: https://developers.google.com/gmail/api/auth/web-server