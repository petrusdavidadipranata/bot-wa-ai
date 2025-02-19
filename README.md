# BOT-DAV - WhatsApp AI Chatbot

![BOT-DAV](https://img.shields.io/badge/WhatsApp-Bot-green?style=for-the-badge&logo=whatsapp)

## 📌 Tentang BOT-DAV
BOT-DAV adalah chatbot WhatsApp berbasis AI yang dikembangkan menggunakan [Baileys](https://github.com/WhiskeySockets/Baileys) dan [Google Gemini AI](https://ai.google.dev). Bot ini dapat berinteraksi secara alami, menjadi teman ngobrol, tempat curhat, serta memberikan bantuan dalam berbagai percakapan.

## ✨ Fitur Utama
✅ **Chat Interaktif** - Berkomunikasi secara real-time dengan AI cerdas.  
✅ **Dukungan Bahasa Indonesia** - Dirancang untuk berbicara dalam bahasa Indonesia dengan lancar.  
✅ **Private Chat Only** - Bot hanya merespons pesan dari chat pribadi, mengabaikan pesan grup.  
✅ **Riwayat Percakapan** - Mempertahankan konteks percakapan untuk interaksi yang lebih alami.  
✅ **Kode Pairing** - Memungkinkan login menggunakan kode pairing WhatsApp.  
✅ **Reconnect Otomatis** - Jika koneksi terputus, bot akan mencoba menyambungkan kembali.  

## 🚀 Cara Instalasi dan Menjalankan
### 1️⃣ Persyaratan
Sebelum menjalankan bot, pastikan Anda telah menginstal:
- **Node.js** (v16 ke atas)
- **NPM** atau **Yarn**

### 2️⃣ Clone Repository
```sh
git clone https://github.com/petrusdavidadipranata/bot-wa-ai.git
cd bot-wa-ai
```

### 3️⃣ Install Dependensi
```sh
npm install
```

### 4️⃣ Jalankan Bot
```sh
npm start
```
Saat pertama kali dijalankan, Anda akan diminta memasukkan nomor WhatsApp untuk proses pairing.

### 5️⃣ Scan QR Code atau Masukkan Kode Pairing
Jika bot meminta kode pairing, ikuti instruksi di terminal dan masukkan kode tersebut di WhatsApp Anda.

## 🔧 Konfigurasi
Bot menggunakan Google Gemini AI, pastikan Anda memiliki API Key dan edit bagian berikut di kode:
```js
const genAI = new GoogleGenerativeAI("YOUR_API_KEY_GEMINI");
```

### 🔑 Dapatkan API KEY disini
**GEMINI_API_KEY** : [Gemini Api Key](https://aistudio.google.com/app/apikey)

---

## 🛑 Batasan
- **Hanya Merespons Chat Pribadi** (Tidak akan membalas di grup)
- **Tidak Merespons Pesan Kosong atau dari Dirinya Sendiri**

## 📜 Lisensi
BOT-DAV dikembangkan untuk tujuan edukasi dan eksperimen. Silakan gunakan dan modifikasi sesuai kebutuhan.

---

### 📩 Kontak
Jika ada pertanyaan atau kendala, silakan hubungi pengembang di:
- **GitHub**: [Petrus David Adi Pranata](https://github.com/petrusdavidadipranata)
- **Email**: rafaelpetrus40@gmail.com

Happy Coding! 🚀

