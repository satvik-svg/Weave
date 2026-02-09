'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, MapPin, Brain, Users, Shield, Loader, Camera, Server } from 'lucide-react'

interface VerificationDemoModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function VerificationDemoModal({ isOpen, onClose }: VerificationDemoModalProps) {
    const [step, setStep] = useState(0)

    // Simulation steps
    const steps = [
        {
            id: 'gps',
            title: 'Location Validation',
            description: 'Verifying GPS metadata and geofencing coordinates...',
            icon: MapPin,
            color: 'text-blue-500',
            bg: 'bg-blue-100',
            duration: 3000
        },
        {
            id: 'ai',
            title: 'AI Image Analysis',
            description: 'Analyzing before/after photos for visual confirmation...',
            icon: Brain,
            color: 'text-purple-500',
            bg: 'bg-purple-100',
            duration: 4000
        },
        {
            id: 'consensus',
            title: 'Community Consensus',
            description: 'Gathering peer confirmations from local validators...',
            icon: Users,
            color: 'text-amber-500',
            bg: 'bg-amber-100',
            duration: 3500
        },
        {
            id: 'verified',
            title: 'Verified Impact 100%',
            description: 'Project successfully verified and recorded efficiently.',
            icon: CheckCircle,
            color: 'text-emerald-500',
            bg: 'bg-emerald-100',
            duration: 0
        }
    ]

    useEffect(() => {
        if (isOpen) {
            setStep(0)

            let currentStep = 0
            const runSimulation = () => {
                if (currentStep < steps.length - 1) {
                    setTimeout(() => {
                        currentStep += 1
                        setStep(currentStep)
                        runSimulation()
                    }, steps[currentStep].duration)
                }
            }

            runSimulation()
        }
    }, [isOpen])

    if (!isOpen) return null

    const CurrentIcon = steps[step].icon

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Shield size={18} className="text-emerald-500" />
                            Impact Verification Protocol
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>

                    <div className="p-8 flex flex-col items-center text-center">

                        {/* Visualizer Area */}
                        <div className="w-full h-48 mb-8 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden flex items-center justify-center group">
                            {/* Background Grid Animation */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20"></div>

                            {/* Step Specific Visuals */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={steps[step].id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="relative z-10 flex flex-col items-center"
                                >
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${steps[step].bg} ${steps[step].color} shadow-lg ring-4 ring-white`}>
                                        <CurrentIcon size={40} />
                                    </div>

                                    {step < steps.length - 1 && (
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mt-2 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                                            <Loader size={12} className="animate-spin" />
                                            PROCESSING_BLOCK_{step + 1}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Scanning Line - Only for AI step */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ top: '0%' }}
                                    animate={{ top: '100%' }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent z-0 opacity-50"
                                />
                            )}
                        </div>

                        {/* Status Text */}
                        <div className="space-y-2 mb-8 h-20">
                            <motion.h4
                                key={`title-${step}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xl font-bold text-slate-900"
                            >
                                {steps[step].title}
                            </motion.h4>
                            <motion.p
                                key={`desc-${step}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-slate-600 text-sm"
                            >
                                {steps[step].description}
                            </motion.p>
                        </div>

                        {/* Progress Indicators */}
                        <div className="flex gap-2 w-full justify-center">
                            {steps.map((s, index) => (
                                <div
                                    key={s.id}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${index <= step ? `w-8 ${s.color.replace('text-', 'bg-')}` : 'w-2 bg-slate-200'
                                        }`}
                                />
                            ))}
                        </div>

                        {step === steps.length - 1 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-8 bg-emerald-600 text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                                onClick={onClose}
                            >
                                Done
                            </motion.button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
