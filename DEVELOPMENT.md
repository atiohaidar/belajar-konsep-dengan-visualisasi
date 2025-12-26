# Development Guide - Visualisasi Konsep Programming

Panduan ini untuk AI dan developer yang ingin menambah visualisasi baru.

## 📁 Struktur Project

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage (list visualisasi)
│   └── viz/[slug]/page.tsx       # Dynamic page per visualisasi
│
├── visualizations/               # ⭐ FOLDER UTAMA VISUALISASI
│   ├── types.ts                  # Type definitions
│   ├── registry.ts               # Daftar semua visualisasi
│   └── [nama-konsep]/            # Folder per visualisasi
│       ├── config.ts             # Metadata, langkah & quiz
│       ├── [Nama]Visualization.tsx  # Komponen visualisasi
│       └── index.ts              # Barrel export
│
├── components/
│   ├── viz/                      # Komponen primitif visualisasi
│   │   ├── Server.tsx            # Icon server animasi
│   │   ├── Client.tsx            # Icon browser animasi
│   │   ├── DataPacket.tsx        # Paket data bergerak
│   │   └── Arrow.tsx             # Panah koneksi
│   ├── PlaybackControls.tsx      # Kontrol play/pause/step
│   └── QuizMode.tsx              # Komponen quiz
│
└── lib/
    └── animations.ts             # Framer Motion variants
```

---

## 🆕 Cara Menambah Visualisasi Baru

### Langkah 1: Buat Folder Baru

```bash
src/visualizations/[nama-konsep]/
├── config.ts
├── [Nama]Visualization.tsx
└── index.ts
```

### Langkah 2: Buat config.ts

```typescript
import { VisualizationConfig } from "../types";

export const config: VisualizationConfig = {
  slug: "nama-konsep",           // URL slug (huruf kecil, pakai dash)
  judul: "Judul Visualisasi",    // Judul tampilan
  deskripsi: "Deskripsi singkat",
  kategori: "protocol",          // "network" | "security" | "storage" | "protocol"
  warna: "blue",
  icon: "🔌",                    // Emoji
  langkahLangkah: [
    {
      id: "step-1",
      judul: "Nama Langkah",
      penjelasan: "Penjelasan dalam bahasa Indonesia yang mudah dipahami",
      durasi: 2000,              // Durasi dalam ms
    },
    // ... langkah lainnya
  ],
  // ⭐ OPTIONAL: Tambahkan quiz
  quiz: [
    {
      id: "q1",
      pertanyaan: "Pertanyaan?",
      pilihan: ["A", "B", "C", "D"],
      jawabanBenar: 0,           // Index jawaban benar (0-based)
      penjelasan: "Penjelasan mengapa jawaban tersebut benar"
    }
  ],
};
```

### Langkah 3: Buat Komponen Visualisasi

```typescript
"use client";

import { VisualizationProps } from "../types";
import { Server, Client, DataPacket, Arrow } from "@/components/viz";

export default function NamaVisualization({
  langkahAktif,
  sedangBerjalan,
}: VisualizationProps) {
  // Logic berdasarkan langkahAktif
  
  return (
    <div className="relative w-full h-full min-h-[280px] flex items-center justify-center">
      {/* Komponen visualisasi */}
    </div>
  );
}
```

### Langkah 4: Buat index.ts

```typescript
export { config } from "./config";
export { default as Component } from "./NamaVisualization";
```

### Langkah 5: Daftarkan di Registry

Edit `src/visualizations/registry.ts`:

```typescript
import * as namaKonsep from "./nama-konsep";

export const visualizations: VisualizationModule[] = [
  // ... existing
  {
    config: namaKonsep.config,
    Component: namaKonsep.Component,
  },
];
```

---

## 🎨 Komponen Tersedia

### Server
```tsx
<Server 
  aktif={true}           // Glow effect
  status="processing"    // "idle" | "processing" | "success" | "error"
  label="Web Server"
/>
```

### Client
```tsx
<Client 
  aktif={true}
  status="sending"       // "idle" | "sending" | "waiting" | "receiving"
  label="Browser"
/>
```

### DataPacket
```tsx
<DataPacket
  visible={true}
  fromX={-50}            // Posisi awal X
  toX={100}              // Posisi akhir X
  tipe="request"         // "request" | "response" | "data"
  label="GET /api"
/>
```

### Arrow
```tsx
<Arrow 
  direction="right"      // "left" | "right" | "bidirectional"
  aktif={true}
  label="HTTP Request"
/>
```

### LineGraph
```tsx
<LineGraph
  title="Grafik v-t"         // Judul grafik
  dataPoints={[              // Array titik data {x, y}
    { x: 0, y: 10 },
    { x: 5, y: 20 }
  ]}
  xLabel="t (s)"             // Label sumbu X
  yLabel="v (m/s)"           // Label sumbu Y
  color="#3B82F6"            // Warna garis (hex)
  currentX={2.5}             // Posisi X marker (opsional, untuk animasi)
  currentY={15}              // Posisi Y marker (opsional, untuk animasi)
  xDomain={[0, 10]}          // Range sumbu X (opsional)
  yDomain={[0, 100]}         // Range sumbu Y (opsional)
  graphHeight={180}          // Tinggi grafik dalam px (default: 120)
/>
```

**Fitur:**
- Auto-scaling berdasarkan data
- Progressive drawing (garis muncul mengikuti marker)
- Grid lines dan axis labels otomatis
- Marker animasi real-time

---

## 🎬 Animasi

Import dari `@/lib/animations`:

**Basic:**
- `fadeIn` - Fade in effect
- `slideInFromLeft/Right/Top/Bottom` - Slide dengan spring
- `scaleUp`, `scaleDown` - Scale effects

**Looping:**
- `pulse`, `pulseFast` - Pulsing effect
- `float` - Floating effect
- `bounce` - Bouncing effect
- `spin` - Rotating
- `wave` - Waving motion

**Glow:**
- `glowPulse` - Blue glow
- `glowPurple` - Purple glow
- `glowGreen` - Green glow

**Special:**
- `shake` - Error shake
- `elasticPop` - Elastic pop-in
- `ripple` - Click ripple effect
- `expandFromCenter` - Horizontal expand
- `successCheck` - Checkmark animation
- `confettiBurst(angle)` - Confetti particle

**Data Movement:**
- `packetMove(fromX, toX)` - Untuk DataPacket
- `packetWithTrail(fromX, toX)` - Dengan trail effect
- `staggerContainer`, `staggerContainerFast` - Untuk child stagger

---

## ⌨️ Keyboard Shortcuts

Shortcuts yang tersedia di halaman visualisasi:

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` `→` | Navigate langkah |
| `R` | Reset ke awal |
| `F` | Toggle fullscreen |
| `Q` | Buka quiz (setelah selesai) |
| `Esc` | Pause / Exit fullscreen |

---

## ✅ Checklist Menambah Visualisasi

- [ ] Buat folder di `src/visualizations/[nama]/`
- [ ] Buat `config.ts` dengan metadata lengkap
- [ ] Tambahkan quiz (minimal 3 pertanyaan)
- [ ] Buat komponen visualisasi `.tsx`
- [ ] Gunakan `h-full` untuk height (responsive)
- [ ] Buat `index.ts` untuk export
- [ ] Tambahkan ke `registry.ts`
- [ ] Test dengan `npm run dev`
- [ ] Test fullscreen mode
- [ ] Test quiz functionality
- [ ] Pastikan animasi berjalan smooth
- [ ] Penjelasan menggunakan bahasa Indonesia

