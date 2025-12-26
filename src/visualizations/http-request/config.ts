import { VisualizationConfig } from "../types";

export const config: VisualizationConfig = {
    slug: "http-request",
    judul: "Cara Kerja HTTP Request",
    deskripsi: "Pelajari bagaimana browser mengirim request ke server dan menerima response",
    kategori: "programming",
    warna: "blue",
    icon: "🌐",
    langkahLangkah: [
        {
            id: "intro",
            judul: "Persiapan",
            penjelasan: "Kamu mengetik URL di browser (contoh: google.com). Browser siap mengirim permintaan ke server.",
            durasi: 2000,
        },
        {
            id: "dns",
            judul: "Pencarian DNS",
            penjelasan: "Browser mencari alamat IP dari domain yang kamu ketik. DNS seperti buku telepon internet yang mengubah nama domain menjadi alamat IP.",
            durasi: 2000,
        },
        {
            id: "request",
            judul: "Mengirim Request",
            penjelasan: "Browser mengirim HTTP Request ke server. Request berisi: method (GET/POST), headers, dan body (jika ada).",
            durasi: 2500,
        },
        {
            id: "processing",
            judul: "Server Memproses",
            penjelasan: "Server menerima request dan memprosesnya. Server bisa mengambil data dari database, menjalankan logika, atau hal lainnya.",
            durasi: 2000,
        },
        {
            id: "response",
            judul: "Server Mengirim Response",
            penjelasan: "Server mengirim HTTP Response kembali ke browser. Response berisi: status code (200, 404, dll), headers, dan body (HTML, JSON, dll).",
            durasi: 2500,
        },
        {
            id: "render",
            judul: "Browser Menampilkan",
            penjelasan: "Browser menerima response dan menampilkan hasilnya. Jika HTML, browser akan me-render halaman web.",
            durasi: 2000,
        },
    ],
    quiz: [
        {
            id: "q1",
            pertanyaan: "Apa fungsi DNS dalam proses HTTP Request?",
            pilihan: [
                "Mengenkripsi data yang dikirim",
                "Mengubah nama domain menjadi alamat IP",
                "Memproses request dari browser",
                "Menampilkan halaman web"
            ],
            jawabanBenar: 1,
            penjelasan: "DNS (Domain Name System) berfungsi seperti buku telepon internet yang mengubah nama domain (seperti google.com) menjadi alamat IP yang dapat dipahami komputer."
        },
        {
            id: "q2",
            pertanyaan: "Status code 200 dalam HTTP Response artinya?",
            pilihan: [
                "Halaman tidak ditemukan",
                "Server error",
                "Request berhasil",
                "Redirect ke halaman lain"
            ],
            jawabanBenar: 2,
            penjelasan: "Status code 200 OK menandakan bahwa request berhasil diproses oleh server dan response dikirim dengan sukses."
        },
        {
            id: "q3",
            pertanyaan: "Bagian mana dari HTTP Request yang berisi informasi tentang jenis request?",
            pilihan: [
                "Body",
                "Headers",
                "Method (GET/POST)",
                "Status Code"
            ],
            jawabanBenar: 2,
            penjelasan: "Method seperti GET, POST, PUT, DELETE menentukan jenis operasi yang diminta. GET untuk mengambil data, POST untuk mengirim data, dll."
        }
    ],
};

