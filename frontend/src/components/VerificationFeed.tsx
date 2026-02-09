'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, MapPin, Brain, Shield, Crosshair, Clock, Globe } from 'lucide-react'

// Mock Data Types
type VerificationEvent = {
    id: string
    type: 'gps' | 'ai' | 'consensus' | 'verified'
    project: string
    timestamp: string
    detail: string
}

const ProjectNames = [
    "City Park Cleanup", "River Restoration", "Food Drive Initiative",
    "School Garden Project", "Beach Cleanup Drive", "Community Center Repair",
    "Homeless Shelter Support", "Tree Planting Campaign"
]

export default function VerificationFeed() {
    const [events, setEvents] = useState<VerificationEvent[]>([])

    // Initial seed
    useEffect(() => {
        const initialEvents: VerificationEvent[] = [
            { id: '1', type: 'verified', project: "City Park Cleanup", timestamp: "Just now", detail: "Verification threshold met (98%)" },
            { id: '2', type: 'consensus', project: "Beach Cleanup Drive", timestamp: "1 min ago", detail: "3 new peer confirmations received" },
            { id: '3', type: 'ai', project: "River Restoration", timestamp: "2 mins ago", detail: "Analysis complete: 85% visual improvement" },
        ]
        setEvents(initialEvents)

        // Simulate live feed
        const interval = setInterval(() => {
            const newEvent = generateRandomEvent()
            setEvents(prev => [newEvent, ...prev].slice(0, 5)) // Keep last 5
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    const generateRandomEvent = (): VerificationEvent => {
        const types: VerificationEvent['type'][] = ['gps', 'ai', 'consensus', 'verified']
        const type = types[Math.floor(Math.random() * types.length)]
        const project = ProjectNames[Math.floor(Math.random() * ProjectNames.length)]

        let detail = ""
        switch (type) {
            case 'gps': detail = "GPS Metadata confirmed within geofence"; break;
            case 'ai': detail = "Computer vision detected waste removal"; break;
            case 'consensus': detail = "Validator consensus reached (5/5)"; break;
            case 'verified': detail = "Smart Contract #0x82... verified milestone"; break;
        }

        return {
            id: Date.now().toString(),
            type,
            project,
            timestamp: "Just now",
            detail
        }
    }

    const getIcon = (type: VerificationEvent['type']) => {
        switch (type) {
            case 'gps': return <MapPin size={16} className="text-blue-500" />
            case 'ai': return <Brain size={16} className="text-purple-500" />
            case 'consensus': return <Globe size={16} className="text-amber-500" />
            case 'verified': return <CheckCircle size={16} className="text-emerald-500" />
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                        </div>
                        <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Live Verification Feed</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1"><Shield size={12} /> NODE_STATUS: ACTIVE</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> UPTIME: 99.9%</span>
                    </div>
                </div>

                <div className="p-4 space-y-3 min-h-[300px]">
                    <AnimatePresence initial={false} mode="popLayout">
                        {events.map((event) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600">
                                    {getIcon(event.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className="text-sm font-bold text-slate-200 truncate">{event.project}</h4>
                                        <span className="text-[10px] text-slate-500 font-mono">{event.timestamp}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono truncate">{event.detail}</p>
                                </div>

                                <div className={`text-[10px] px-2 py-1 rounded bg-slate-700 text-slate-300 font-mono border border-slate-600 w-20 text-center`}>
                                    {event.type.toUpperCase()}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {events.length === 0 && (
                        <div className="flex items-center justify-center h-full text-slate-600 text-sm font-mono">
                            Waiting for network events...
                        </div>
                    )}
                </div>

                {/* Terminal Footer Decoration */}
                <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-600 font-mono flex justify-between">
                    <span>Connected to Weave Network Mainnet</span>
                    <span>Latency: 24ms</span>
                </div>
            </div>
        </div>
    )
}
