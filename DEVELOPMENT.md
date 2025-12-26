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
│       ├── config.ts             # Metadata & langkah-langkah
│       ├── [Nama]Visualization.tsx  # Komponen visualisasi
│       └── index.ts              # Barrel export
│
├── components/
│   ├── viz/                      # Komponen primitif visualisasi
│   │   ├── Server.tsx            # Icon server animasi
│   │   ├── Client.tsx            # Icon browser animasi
│   │   ├── DataPacket.tsx        # Paket data bergerak
│   │   └── Arrow.tsx             # Panah koneksi
│   └── PlaybackControls.tsx      # Kontrol play/pause/step
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
    <div className="relative w-full h-[400px] flex items-center justify-center">
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

---

## 🎬 Animasi

Import dari `@/lib/animations`:

- `fadeIn` - Fade in effect
- `slideInFromLeft/Right` - Slide dengan spring
- `scaleUp` - Scale dari 0
- `pulse` - Pulsing effect
- `float` - Floating effect
- `glowPulse` - Box shadow glow
- `packetMove(fromX, toX)` - Untuk DataPacket custom

---

## ✅ Checklist Menambah Visualisasi

- [ ] Buat folder di `src/visualizations/[nama]/`
- [ ] Buat `config.ts` dengan metadata lengkap
- [ ] Buat komponen visualisasi `.tsx`
- [ ] Buat `index.ts` untuk export
- [ ] Tambahkan ke `registry.ts`
- [ ] Test dengan `npm run dev`
- [ ] Pastikan animasi berjalan smooth
- [ ] Penjelasan menggunakan bahasa Indonesia
