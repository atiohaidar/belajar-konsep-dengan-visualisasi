import { VisualizationConfig } from "../types";

export const config: VisualizationConfig = {
    slug: "websocket",
    judul: "Cara Kerja WebSocket",
    deskripsi: "Pelajari bagaimana WebSocket memungkinkan komunikasi dua arah secara real-time antara browser dan server",
    kategori: "protocol",
    warna: "purple",
    icon: "🔌",
    langkahLangkah: [
        {
            id: "intro",
            judul: "Persiapan Koneksi",
            penjelasan: "Client (browser) ingin membuka koneksi WebSocket ke server. WebSocket berbeda dengan HTTP biasa karena memungkinkan komunikasi dua arah secara terus-menerus.",
            durasi: 2500,
        },
        {
            id: "handshake-request",
            judul: "HTTP Upgrade Request",
            penjelasan: "Client mengirim HTTP request khusus dengan header 'Upgrade: websocket'. Ini meminta server untuk mengubah koneksi HTTP biasa menjadi WebSocket.",
            durasi: 2500,
        },
        {
            id: "handshake-response",
            judul: "Server Menerima Upgrade",
            penjelasan: "Server merespons dengan '101 Switching Protocols', menandakan bahwa koneksi berhasil di-upgrade menjadi WebSocket. Koneksi sekarang persisten!",
            durasi: 2500,
        },
        {
            id: "connection-open",
            judul: "Koneksi Terbuka",
            penjelasan: "Koneksi WebSocket sekarang terbuka dan siap digunakan. Tidak seperti HTTP, koneksi ini tetap hidup dan bisa digunakan kapan saja.",
            durasi: 2000,
        },
        {
            id: "client-message",
            judul: "Client Mengirim Pesan",
            penjelasan: "Client bisa mengirim pesan kapan saja tanpa perlu membuat koneksi baru. Pesan dikirim dalam bentuk 'frame' yang sangat ringan.",
            durasi: 2500,
        },
        {
            id: "server-message",
            judul: "Server Mengirim Pesan",
            penjelasan: "Server juga bisa mengirim pesan kapan saja ke client tanpa diminta (push). Inilah keunggulan utama WebSocket dibanding HTTP!",
            durasi: 2500,
        },
        {
            id: "bidirectional",
            judul: "Komunikasi Dua Arah",
            penjelasan: "Client dan server bisa saling berkirim pesan secara bersamaan (full-duplex). Sempurna untuk chat, game online, atau data real-time!",
            durasi: 3000,
        },
        {
            id: "close",
            judul: "Menutup Koneksi",
            penjelasan: "Ketika selesai, salah satu pihak bisa menutup koneksi dengan mengirim 'close frame'. Koneksi ditutup dengan bersih.",
            durasi: 2000,
        },
    ],
    quiz: [
        {
            id: "q1",
            pertanyaan: "Apa yang membedakan WebSocket dengan HTTP biasa?",
            pilihan: [
                "WebSocket lebih lambat dari HTTP",
                "WebSocket memungkinkan komunikasi dua arah secara real-time",
                "WebSocket hanya bisa mengirim teks",
                "WebSocket tidak memerlukan server"
            ],
            jawabanBenar: 1,
            penjelasan: "WebSocket memungkinkan komunikasi full-duplex (dua arah) secara real-time. Tidak seperti HTTP yang request-response, WebSocket memungkinkan server mengirim data kapan saja tanpa diminta client."
        },
        {
            id: "q2",
            pertanyaan: "Status code apa yang dikirim server saat menyetujui upgrade ke WebSocket?",
            pilihan: [
                "200 OK",
                "301 Moved Permanently",
                "101 Switching Protocols",
                "404 Not Found"
            ],
            jawabanBenar: 2,
            penjelasan: "Server mengirim '101 Switching Protocols' untuk menandakan bahwa koneksi berhasil di-upgrade dari HTTP ke WebSocket."
        },
        {
            id: "q3",
            pertanyaan: "Untuk aplikasi apa WebSocket paling cocok digunakan?",
            pilihan: [
                "Menampilkan halaman statis",
                "Download file besar",
                "Chat real-time dan game online",
                "Menampilkan gambar"
            ],
            jawabanBenar: 2,
            penjelasan: "WebSocket sangat cocok untuk aplikasi yang membutuhkan komunikasi real-time seperti chat, game online, live notifications, dan trading platforms karena koneksinya persisten dan bisa push data kapan saja."
        }
    ],
};

