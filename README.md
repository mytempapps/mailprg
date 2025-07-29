# Windows Servisi Olarak Monitor Uygulaması

Bu uygulama Windows servisi olarak çalışacak şekilde yapılandırılmıştır. NSSM (Non-Sucking Service Manager) kullanarak Windows servisi olarak çalıştırabilirsiniz.

## Kurulum

### 1. NSSM İndirme ve Kurulum

1. [NSSM indirme sayfasına](https://nssm.cc/download) gidin
2. Windows sürümünüze uygun NSSM sürümünü indirin (genellikle `nssm-2.24-101-g897c7ad.zip`)
3. ZIP dosyasını açın ve `nssm.exe` dosyasını bir PATH dizinine koyun (örn: `C:\Windows\System32`)

### 2. Servis Kurulumu

1. `install-service.bat` dosyasını **Yönetici olarak çalıştırın**
2. Script otomatik olarak:
   - Config dizini oluşturur (`config/`)
   - Logs dizini oluşturur (`logs/`)
   - Varsayılan JSON dosyalarını oluşturur
   - Servisi kurar ve başlatır

### 3. Konfigürasyon

JSON dosyalarını `config/` dizininde düzenleyin:

- **config/jobs.json**: İzleme görevleri
- **config/settings.json**: E-posta ve log ayarları

### 4. Servis Yönetimi

#### Servisi Başlat/Durdur
```cmd
net start MonitorService
net stop MonitorService
```

#### Servisi Kaldır
`uninstall-service.bat` dosyasını **Yönetici olarak çalıştırın**

#### Servis Durumunu Kontrol Et
`service-status.bat` dosyasını çalıştırın

## Log Dosyaları

- **logs/monitor.log**: Uygulama logları
- **logs/service-out.log**: Servis stdout logları
- **logs/service-error.log**: Servis stderr logları

## Örnek Kullanım

### jobs.json
```json
[
  {
    "id": "server_ping",
    "type": "ping",
    "host": "192.168.1.1",
    "interval_ms": 30000,
    "mail": {
      "to": "admin@example.com"
    }
  },
  {
    "id": "web_port_check",
    "type": "telnet",
    "host": "192.168.1.100",
    "port": 80,
    "interval_ms": 60000,
    "mail": {
      "to": "admin@example.com"
    }
  }
]
```

Alternatif format (eski uyumlu):
```json
{
  "jobs": [
    {
      "id": "server_ping",
      "type": "ping",
      "host": "192.168.1.1",
      "interval_ms": 30000,
      "mail": {
        "to": "admin@example.com"
      }
    }
  ]
}
```

### settings.json
```json
{
  "mail": {
    "from": "monitor@yourcompany.com",
    "to": "admin@yourcompany.com",
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 465,
      "secure": true,
      "user": "your-email@gmail.com",
      "pass": "your-app-password"
    }
  },
  "logging": {
    "enabled": true,
    "level": "info",
    "log_to_console": false,
    "log_to_file": true,
    "file_path": "logs\\monitor.log",
    "max_file_size_mb": 10,
    "max_backup_files": 5
  }
}
```

## Sorun Giderme

### Servis Başlamıyorsa
1. **Yönetici hakları**: Tüm işlemler için yönetici hakları gereklidir
2. **NSSM kontrolü**: `where nssm` komutu ile NSSM'in PATH'te olup olmadığını kontrol edin
3. **Logları kontrol edin**: `logs/service-error.log` dosyasını kontrol edin
4. **Config dosyaları**: JSON dosyalarının doğru formatta olduğundan emin olun

### Manuel Servis Kurulumu
Eğer batch dosyaları çalışmazsa:

```cmd
nssm install MonitorService "C:\full\path\to\monitor.exe"
nssm set MonitorService Description "Sistem Monitor Servisi"
nssm set MonitorService Arguments --jobs="C:\full\path\to\config\jobs.json" --settings="C:\full\path\to\config\settings.json"
nssm set MonitorService AppDirectory "C:\full\path\to\working\directory"
nssm set MonitorService Start SERVICE_DELAYED_AUTO_START
nssm set MonitorService AppStdout "C:\full\path\to\logs\service-out.log"
nssm set MonitorService AppStderr "C:\full\path\to\logs\service-error.log"
net start MonitorService
```