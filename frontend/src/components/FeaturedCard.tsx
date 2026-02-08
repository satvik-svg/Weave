import Link from 'next/link'
import { ArrowRight, CheckCircle, Clock } from 'lucide-react'
import { ActionPlan } from '@/lib/api'

interface FeaturedCardProps {
    plan: ActionPlan
    featured?: boolean
}

export default function FeaturedCard({ plan, featured = false }: FeaturedCardProps) {
    // Calculate specific progress mock if needed, or use real data
    const progress = plan.progress_percentage || Math.round((plan.assigned_volunteers / plan.required_volunteers) * 100) || 0
    const isVerified = plan.status === 'verified' || progress > 90 // Mock logic for badge if status isn't explicit

    return (
        <Link
            href={`/plans/${plan.id}`}
            className={`group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 relative overflow-hidden flex flex-col h-full ${featured ? 'transform hover:-translate-y-2' : 'hover:-translate-y-1'
                }`}
        >
            {/* Decorative Gradient Background for Featured */}
            {featured && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10 transition-all group-hover:bg-emerald-500/10"></div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1 pr-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-emerald-700 transition-colors">
                        {plan.title}
                    </h3>
                    <div className="flex items-center text-xs text-slate-500 font-medium">
                        <Clock size={14} className="mr-1.5 text-slate-400" />
                        <span>2h ago</span>
                        <span className="mx-2">•</span>
                        <span className="truncate max-w-[120px]">Downtown District</span>
                    </div>
                </div>

                {isVerified && (
                    <div className="shrink-0 px-3 py-1 bg-emerald-100/50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center border border-emerald-100">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                    </div>
                )}
            </div>

            {/* Description Snippet */}
            <p className="text-slate-600 text-sm mb-8 line-clamp-2 flex-grow leading-relaxed">
                {plan.description}
            </p>

            {/* Progress Section */}
            <div className="mt-auto">
                <div className="flex items-end justify-between mb-2 text-sm">
                    <div className="font-semibold text-slate-700">
                        <span className="text-emerald-600">{plan.assigned_volunteers}</span>
                        <span className="text-slate-400">/</span>
                        <span>{plan.required_volunteers} Volunteers</span>
                    </div>
                    <div className="text-slate-400 font-medium text-xs">{progress}% Goal</div>
                </div>

                <div className="relative flex items-center gap-4">
                    {/* Progress Bar */}
                    <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white group-hover:bg-emerald-600 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-slate-900/20 group-hover:shadow-emerald-600/30">
                        <ArrowRight size={18} />
                    </div>
                </div>
            </div>
        </Link>
    )
}
