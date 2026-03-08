// import { Link } from 'react-router-dom';
// import { ArrowRight } from 'lucide-react';

// export default function LandingPage() {
//     return (
//         <div className="min-h-screen bg-white">
//             <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
//                 <h1 className="text-2xl font-bold text-[var(--color-primary)]">FinTrack</h1>
//                 <Link 
//                     to="/auth" 
//                     className="px-5 py-2 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary-light)] transition-colors"
//                 >
//                     Log In
//                 </Link>
//             </header>

//             <main className="max-w-4xl mx-auto px-6 py-20 text-center">
//                 <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6 leading-tight">
//                     Manage Your Wealth with AI Intelligence
//                 </h2>
//                 <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto">
//                     The intelligent way to track expenses, set budgets, and grow your wealth. 
//                     Get personalized insights powered by advanced AI algorithms.
//                 </p>
//                 <Link 
//                     to="/auth" 
//                     className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg shadow-[var(--color-primary)]/30"
//                 >
//                     Get Started Free <ArrowRight size={18} />
//                 </Link>
//             </main>

//             <footer className="absolute bottom-6 w-full text-center">
//                 <p className="text-sm text-[var(--color-text-muted)]">© 2024 FinTrack Inc. All rights reserved.</p>
//             </footer>
//         </div>
//     );
// }

import { Link } from 'react-router-dom';
import { ArrowRight, Wallet } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Wallet className="text-[var(--color-primary)]" size={24} />
                    <h1 className="text-2xl font-bold text-[var(--color-primary)]">Financy</h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-20 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6 leading-tight">
                    Master Your Money with Confidence
                </h2>
                <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto">
                    The ultimate finance management platform to track expenses, set budgets, and grow your wealth. 
                    Get actionable insights tailored to your financial goals and take control of your future today.
                </p>
                <Link 
                    to="/auth" 
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg shadow-[var(--color-primary)]/30"
                >
                    Get Started <ArrowRight size={18} />
                </Link>
            </main>

            <footer className="absolute bottom-6 w-full text-center">
                <p className="text-sm text-[var(--color-text-muted)]">© 2024 Financy Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}