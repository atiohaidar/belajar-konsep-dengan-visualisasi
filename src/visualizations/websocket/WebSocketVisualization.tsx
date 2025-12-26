"use client";

import { motion, AnimatePresence } from "framer-motion";
import { VisualizationProps } from "../types";
import { Server, Client, DataPacket, Arrow } from "@/components/viz";

export default function WebSocketVisualization({
    langkahAktif,
    sedangBerjalan,
}: VisualizationProps) {
    // Determine states based on current step
    const clientStatus =
        langkahAktif === 0 ? "idle" :
            langkahAktif === 1 ? "sending" :
                langkahAktif === 2 ? "waiting" :
                    langkahAktif === 4 ? "sending" :
                        langkahAktif === 5 ? "receiving" :
                            langkahAktif === 7 ? "idle" :
                                "receiving";

    const serverStatus =
        langkahAktif <= 1 ? "idle" :
            langkahAktif === 2 ? "processing" :
                langkahAktif === 5 ? "success" :
                    langkahAktif === 7 ? "idle" :
                        "success";

    // Connection states
    const isConnected = langkahAktif >= 3 && langkahAktif <= 6;
    const showHandshakeRequest = langkahAktif === 1;
    const showHandshakeResponse = langkahAktif === 2;
    const showClientMessage = langkahAktif === 4;
    const showServerMessage = langkahAktif === 5;
    const showBidirectional = langkahAktif === 6;
    const showClose = langkahAktif === 7;

    return (
        <div className="relative w-full h-full min-h-[280px] flex items-center justify-center">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

            {/* Connection status indicator */}
            <AnimatePresence>
                {isConnected && (
                    <motion.div
                        className="absolute top-4 left-1/2 -translate-x-1/2 z-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/40">
                            <motion.div
                                className="w-2 h-2 bg-green-400 rounded-full"
                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="text-sm text-green-300 font-medium">Koneksi WebSocket Aktif</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main visualization area */}
            <div className="relative flex items-center justify-between w-full max-w-2xl px-8">
                {/* Client/Browser */}
                <Client
                    aktif={langkahAktif >= 0}
                    status={clientStatus}
                    label="Browser Kamu"
                />

                {/* Connection area */}
                <div className="relative flex-1 mx-8">
                    {/* Persistent connection line when connected */}
                    <AnimatePresence>
                        {isConnected && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
                                    style={{ width: "100%" }}
                                    animate={{
                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Arrow connection */}
                    <Arrow
                        direction={
                            langkahAktif === 2 || langkahAktif === 5 ? "left" :
                                langkahAktif === 6 ? "bidirectional" :
                                    "right"
                        }
                        aktif={langkahAktif >= 1 && langkahAktif <= 7}
                        label={
                            langkahAktif === 1 ? "Upgrade Request" :
                                langkahAktif === 2 ? "101 Switching Protocols" :
                                    langkahAktif === 3 ? "Koneksi Terbuka" :
                                        langkahAktif === 4 ? "Client → Server" :
                                            langkahAktif === 5 ? "Server → Client" :
                                                langkahAktif === 6 ? "Full Duplex" :
                                                    langkahAktif === 7 ? "Close Frame" :
                                                        "WebSocket"
                        }
                    />

                    {/* Handshake request */}
                    <DataPacket
                        visible={showHandshakeRequest}
                        fromX={-50}
                        toX={100}
                        tipe="request"
                        label="Upgrade: websocket"
                    />

                    {/* Handshake response */}
                    <DataPacket
                        visible={showHandshakeResponse}
                        fromX={150}
                        toX={0}
                        tipe="response"
                        label="101 Switching"
                    />

                    {/* Client message */}
                    <DataPacket
                        visible={showClientMessage}
                        fromX={-50}
                        toX={100}
                        tipe="data"
                        label="Pesan dari Client"
                    />

                    {/* Server message */}
                    <DataPacket
                        visible={showServerMessage}
                        fromX={150}
                        toX={0}
                        tipe="data"
                        label="Pesan dari Server"
                    />

                    {/* Bidirectional messages */}
                    <AnimatePresence>
                        {showBidirectional && (
                            <>
                                <motion.div
                                    className="absolute top-0 left-0 right-0"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <DataPacket
                                        visible={true}
                                        fromX={-50}
                                        toX={100}
                                        tipe="data"
                                        label="🎮 Game Data"
                                    />
                                </motion.div>
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <DataPacket
                                        visible={true}
                                        fromX={150}
                                        toX={0}
                                        tipe="data"
                                        label="📊 Live Update"
                                    />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Close frame */}
                    <DataPacket
                        visible={showClose}
                        fromX={-50}
                        toX={100}
                        tipe="request"
                        label="Close Frame"
                    />

                    {/* WebSocket vs HTTP comparison popup */}
                    <AnimatePresence>
                        {langkahAktif === 0 && (
                            <motion.div
                                className="absolute -top-24 left-1/2 -translate-x-1/2"
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                transition={{ type: "spring", damping: 15 }}
                            >
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg shadow-lg border border-white/20">
                                    <div className="text-sm font-medium text-white">🔌 WebSocket</div>
                                    <div className="text-xs text-purple-100">Komunikasi real-time dua arah</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Server */}
                <Server
                    aktif={langkahAktif >= 2}
                    status={serverStatus}
                    label="WebSocket Server"
                />
            </div>

            {/* Request/Response detail cards */}
            <AnimatePresence>
                {langkahAktif === 1 && (
                    <motion.div
                        className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur rounded-lg p-3 border border-purple-500/30 max-w-xs"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="text-xs font-mono text-purple-400 mb-1">HTTP Upgrade Request</div>
                        <pre className="text-[10px] text-slate-300 font-mono">
                            {`GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJ...`}
                        </pre>
                    </motion.div>
                )}

                {langkahAktif === 2 && (
                    <motion.div
                        className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur rounded-lg p-3 border border-green-500/30 max-w-xs"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div className="text-xs font-mono text-green-400 mb-1">Server Response</div>
                        <pre className="text-[10px] text-slate-300 font-mono">
                            {`HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc...`}
                        </pre>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Connection established indicator */}
            <AnimatePresence>
                {langkahAktif === 3 && (
                    <motion.div
                        className="absolute top-20 left-1/2 -translate-x-1/2 bg-purple-500/20 backdrop-blur rounded-lg px-6 py-3 border border-purple-500/30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="text-2xl"
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                🔗
                            </motion.div>
                            <div>
                                <div className="text-sm text-purple-300 font-medium">Koneksi Persistent</div>
                                <div className="text-xs text-purple-400">Siap mengirim/menerima pesan</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Message examples */}
            <AnimatePresence>
                {langkahAktif === 4 && (
                    <motion.div
                        className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur rounded-lg p-3 border border-orange-500/30 max-w-xs"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="text-xs font-mono text-orange-400 mb-1">WebSocket Frame (Client)</div>
                        <pre className="text-[10px] text-slate-300 font-mono">
                            {`{
  "type": "chat",
  "message": "Halo Server!",
  "time": "22:51:04"
}`}
                        </pre>
                    </motion.div>
                )}

                {langkahAktif === 5 && (
                    <motion.div
                        className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur rounded-lg p-3 border border-cyan-500/30 max-w-xs"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div className="text-xs font-mono text-cyan-400 mb-1">WebSocket Frame (Server)</div>
                        <pre className="text-[10px] text-slate-300 font-mono">
                            {`{
  "type": "notification",
  "message": "Ada pesan baru!",
  "from": "System"
}`}
                        </pre>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bidirectional explanation */}
            <AnimatePresence>
                {langkahAktif === 6 && (
                    <motion.div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur rounded-lg px-6 py-3 border border-purple-500/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-lg">💬 Chat</div>
                                <div className="text-[10px] text-slate-400">Real-time</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg">🎮 Gaming</div>
                                <div className="text-[10px] text-slate-400">Multiplayer</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg">📈 Trading</div>
                                <div className="text-[10px] text-slate-400">Live Data</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg">🔔 Notifikasi</div>
                                <div className="text-[10px] text-slate-400">Push</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Close connection indicator */}
            <AnimatePresence>
                {langkahAktif === 7 && (
                    <motion.div
                        className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-500/20 backdrop-blur rounded-lg px-6 py-3 border border-red-500/30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl">👋</span>
                            <span className="text-sm text-red-300">Koneksi ditutup dengan bersih</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
