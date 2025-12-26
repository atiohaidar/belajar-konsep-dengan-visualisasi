"use client";

import { motion, AnimatePresence } from "framer-motion";
import { VisualizationProps } from "../types";
import { Server, Client, DataPacket, Arrow } from "@/components/viz";

export default function HTTPRequestVisualization({
    langkahAktif,
    sedangBerjalan,
}: VisualizationProps) {
    // Determine states based on current step
    const clientStatus =
        langkahAktif === 0 ? "idle" :
            langkahAktif === 1 ? "idle" :
                langkahAktif === 2 ? "sending" :
                    langkahAktif === 3 ? "waiting" :
                        langkahAktif === 4 ? "waiting" :
                            "receiving";

    const serverStatus =
        langkahAktif <= 2 ? "idle" :
            langkahAktif === 3 ? "processing" :
                langkahAktif === 4 ? "success" :
                    "success";

    const showRequest = langkahAktif === 2;
    const showResponse = langkahAktif === 4;
    const showDnsQuery = langkahAktif === 1;

    return (
        <div className="relative w-full h-full min-h-[280px] flex items-center justify-center">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

            {/* Main visualization area */}
            <div className="relative flex items-center justify-between w-full max-w-2xl px-8">
                {/* Client/Browser */}
                <Client
                    aktif={langkahAktif >= 0 && langkahAktif <= 2 || langkahAktif === 5}
                    status={clientStatus}
                    label="Browser Kamu"
                />

                {/* Connection area */}
                <div className="relative flex-1 mx-8">
                    {/* Arrow connection */}
                    <Arrow
                        direction={langkahAktif === 4 || langkahAktif === 5 ? "left" : "right"}
                        aktif={langkahAktif >= 2 && langkahAktif <= 5}
                        label={
                            langkahAktif === 1 ? "DNS Query" :
                                langkahAktif === 2 ? "HTTP Request" :
                                    langkahAktif === 4 ? "HTTP Response" :
                                        "Koneksi"
                        }
                    />

                    {/* DNS Server popup */}
                    <AnimatePresence>
                        {showDnsQuery && (
                            <motion.div
                                className="absolute -top-20 left-1/2 -translate-x-1/2"
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                transition={{ type: "spring", damping: 15 }}
                            >
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 rounded-lg shadow-lg border border-white/20">
                                    <div className="text-sm font-medium text-white">🔍 DNS Server</div>
                                    <div className="text-xs text-purple-200">google.com → 142.250.xxx.xxx</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Data packets */}
                    <DataPacket
                        visible={showRequest}
                        fromX={-50}
                        toX={100}
                        tipe="request"
                        label="GET /index.html"
                    />

                    <DataPacket
                        visible={showResponse}
                        fromX={150}
                        toX={0}
                        tipe="response"
                        label="200 OK + HTML"
                    />
                </div>

                {/* Server */}
                <Server
                    aktif={langkahAktif >= 3}
                    status={serverStatus}
                    label="Web Server"
                />
            </div>

            {/* Request/Response detail cards */}
            <AnimatePresence>
                {langkahAktif === 2 && (
                    <motion.div
                        className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur rounded-lg p-3 border border-orange-500/30 max-w-xs"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="text-xs font-mono text-orange-400 mb-1">HTTP Request</div>
                        <pre className="text-[10px] text-slate-300 font-mono">
                            {`GET /index.html HTTP/1.1
Host: google.com
User-Agent: Chrome/120
Accept: text/html`}
                        </pre>
                    </motion.div>
                )}

                {langkahAktif === 4 && (
                    <motion.div
                        className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur rounded-lg p-3 border border-green-500/30 max-w-xs"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div className="text-xs font-mono text-green-400 mb-1">HTTP Response</div>
                        <pre className="text-[10px] text-slate-300 font-mono">
                            {`HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!DOCTYPE html>...`}
                        </pre>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Processing indicator */}
            <AnimatePresence>
                {langkahAktif === 3 && (
                    <motion.div
                        className="absolute top-4 right-4 bg-blue-500/20 backdrop-blur rounded-lg px-4 py-2 border border-blue-500/30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <div className="flex items-center gap-2">
                            <motion.div
                                className="w-3 h-3 bg-blue-400 rounded-full"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 0.6, repeat: Infinity }}
                            />
                            <span className="text-sm text-blue-300">Server sedang memproses...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Final success indicator */}
            <AnimatePresence>
                {langkahAktif === 5 && (
                    <motion.div
                        className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500/20 backdrop-blur rounded-lg px-6 py-3 border border-green-500/30"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✅</span>
                            <span className="text-sm text-green-300">Halaman berhasil ditampilkan!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
