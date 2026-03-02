#  AIQU Depot - Web-Based POS & Cash Flow Management 

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-4285F4?style=for-the-badge&logo=google&logoColor=white)

## Deskripsi Proyek
**AIQU Depot** adalah sebuah aplikasi kasir (*Point of Sale*) dan sistem manajemen keuangan berbasis web yang dirancang khusus untuk operasional bisnis depot air isi ulang. Aplikasi ini dibangun untuk memecahkan masalah pencatatan manual, memberikan transparansi laporan kepada *Owner*, sekaligus menjaga kerahasiaann data internal (seperti gaji karyawan).

Sistem ini sepenuhnya bersifat *serverless* pada sisi *backend*, memanfaatkan **Google Sheets** dan **Google Apps Script** sebagai *database* dan API, sehingga sangat ringan, efisien, dan gratis untuk bisnis skala kecil (UMKM).

## Fitur Utama
Sistem ini dilengkapi dengan pembatasan hak akses (otorisasi) tingkat antarmuka dan pembagian logika laporan:

1. **Pencatatan Transaksi Real-Time:** Input penjualan harian (Aqua, Le Minerale, Galon) dan pengeluaran operasional (Cash Out) dengan kalkulasi estimasi omset otomatis.
2. **Manajemen Kasbon Karyawan:** Fitur untuk mencatat pengambilan kasbon karyawan/owner beserta fitur pembatalan (hapus data) jika terjadi kesalahan input.
3. **Sistem 2-Level Laporan (Dual-Level Access):**
   -  **Ringkasan Internal (Dapur):** Dilindungi dengan PIN Keamanan. Menampilkan omset kotor, pengeluaran operasional, rincian potongan kasbon, kalkulasi gaji otomatis untuk setiap karyawan, dan laba bersih.
   -  **Laporan Owner (Eksternal):** Laporan bersih yang dapat difilter berdasarkan **Harian** maupun **Bulanan**. Hanya menampilkan total item terjual, omset, pengeluaran operasional, dan sisa kas murni (tanpa mengekspos rincian gaji karyawan).
4. **Responsive & Aesthetic UI:** Antarmuka bergaya *Glassmorphism* dengan tema warna pink pastel, dirancang responsif (Mobile-First) untuk kenyamanan kasir yang beroperasi menggunakan *smartphone*.

## Arsitektur Sistem & Teknologi (Tech Stack)
Aplikasi ini dibangun menggunakan arsitektur *Front-End* terpisah yang berkomunikasi dengan *Serverless Backend* melalui API:
* **Front-End:** HTML5, CSS3 (Custom animations & Glassmorphism UI), Vanilla JavaScript (DOM Manipulation & Fetch API).
* **Back-End & Database:** Google Sheets (sebagai penyimpanan data) dioperasikan oleh Google Apps Script (`Code.gs`) yang bertindak sebagai *RESTful API* menangani *HTTP GET* (tarik data laporan) dan *HTTP POST* (input data penjualan/kasbon).
* **Deployment:** GitHub Pages (Frontend Hosting).

## Cara Kerja (Alur Sistem)
1. **Input Data:** Pengguna memasukkan data penjualan melalui form HTML. JavaScript melakukan validasi dan perhitungan kalkulasi *preview* secara lokal.
2. **Fetch API:** Data dikirimkan dalam bentuk `FormData` menggunakan metode `POST` ke *endpoint* URL Google Apps Script.
3. **Data Processing:** Google Apps Script (`Code.gs`) menerima data, memformat tanggal, mencari atau membuat lembar kerja (*sheet*) berdasarkan bulan berjalan, dan menyisipkan data ke dalam struktur tabel yang telah diformat (dilengkapi *auto-border* dan format Rupiah).
4. **Data Retrieval:** Saat pengguna meminta laporan, sistem mengirimkan *request* `GET`. Apps Script akan membaca *spreadsheet*, melakukan rekapitulasi angka secara spesifik (harian/bulanan), dan mengembalikan data dalam format JSON ke *frontend*.

## Tampilan Aplikasi (Screenshots)
<img width="1366" height="685" alt="menu-hasil-laporan" src="https://github.com/user-attachments/assets/fabb800c-95e2-43f9-a131-9eef387848b6" />
<img width="1366" height="679" alt="menu-popup-pin-keamanan" src="https://github.com/user-attachments/assets/bf2cc184-328c-440b-9630-4c600e688571" />
<img width="1366" height="682" alt="menu-penjualan" src="https://github.com/user-attachments/assets/a3e53cf8-661e-4dc0-9f40-48941bb19c19" />

## Pengembang
Dikembangkan sebagai implementasi solusi *Full-Stack Web Development* untuk studi kasus bisnis nyata. Terus belajar dan berkembang dalam merancang sistem yang efisien dan tepat guna.
