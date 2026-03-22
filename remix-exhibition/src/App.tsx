import React from 'react';
import { useTranslation } from 'react-i18next';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { motion } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { DemoGallery } from './components/DemoGallery';
import { Phone, Zap, Target, Rocket, Wallet, ArrowRight, ExternalLink } from 'lucide-react';

function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const solutions = [
    { key: 'ai', icon: <Zap size={32} /> },
    { key: 'value', icon: <Target size={32} /> },
    { key: 'speed', icon: <Rocket size={32} /> },
    { key: 'dependency', icon: <Wallet size={32} /> },
  ];

  return (
    <>
      <Hero />

      {/* Stats Section - Editorial Grid */}
      <section className="py-16 md:py-32 bg-[#1e3a5f] text-white overflow-hidden" id="stats">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-3xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight leading-tight mb-8 md:mb-12">
                {t('data.title')}
              </h2>
              <div className="h-1 w-full bg-white/20 mb-8 md:mb-12"></div>
              <p className="text-base md:text-xl text-white/60 font-light italic">
                {t('data.note')}
              </p>
            </div>
            
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-1">
                {[
                  { key: 'teamSize', trad: '1总监+2主创+5设计师', remix: '1总监+4执行设计师', effect: '-60%' },
                  { key: 'cost', trad: '约100万+', remix: '约50万+', effect: '省50万+' },
                  { key: 'cycle', trad: '5-7天', remix: '2天内', effect: '+70%' },
                  { key: 'passRate', trad: '首次约60%', remix: '85%+', effect: '85%' },
                ].map((row, idx) => (
                  <motion.div 
                    key={row.key}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group grid grid-cols-1 md:grid-cols-12 items-center p-4 md:p-8 border-b border-white/10 hover:bg-white/5 transition-all"
                  >
                    <div className="md:col-span-5 mb-3 md:mb-0">
                      <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#ff6b35] mb-1 md:mb-2">Metric 0{idx + 1}</div>
                      <div className="text-lg md:text-2xl font-bold">{t(`data.table.${row.key}`)}</div>
                    </div>
                    <div className="md:col-span-4 text-white/40 text-xs md:text-sm italic mb-3 md:mb-0">
                      {row.trad} → {row.remix}
                    </div>
                    <div className="md:col-span-3 text-left md:text-right">
                      <div className="text-3xl md:text-5xl font-black text-[#ff6b35] tracking-tighter">{row.effect}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Features />

      {/* Solutions Section - Visual Grid */}
      <section className="py-16 md:py-32 bg-white" id="solutions">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-6 md:gap-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-6xl md:text-9xl font-black text-[#1e3a5f] uppercase tracking-tight leading-tight mb-6 md:mb-8">
                {t('solution.title')}
              </h2>
              <p className="text-lg md:text-2xl text-slate-400 font-light italic">
                {t('solution.subtitle')}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
            {solutions.map((sol, index) => (
              <motion.div
                key={sol.key}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 md:p-16 bg-white hover:bg-slate-50 transition-all group"
                id={`solution-card-${sol.key}`}
              >
                <div className="mb-8 md:mb-12 text-slate-200 group-hover:text-[#ff6b35] transition-colors">
                  {sol.icon}
                </div>
                <h3 className="text-xl md:text-3xl font-bold text-[#1e3a5f] mb-4 md:mb-6 uppercase tracking-tight">
                  {t(`solution.cards.${sol.key}.title`)}
                </h3>
                <p className="text-base md:text-xl text-slate-500 font-light leading-relaxed">
                  {t(`solution.cards.${sol.key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      {/* CTA Section - Bold Minimal */}
      <section className="py-20 md:py-48 bg-[#ff6b35] text-white overflow-hidden relative" id="cta">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none select-none text-[25vw] font-black leading-none flex items-center justify-center">
          CONTACT
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl md:text-8xl font-black uppercase tracking-tight leading-tight mb-8 md:mb-12">
              {t('cta.title')}
            </h2>
            
            <button 
              onClick={() => navigate('/gallery')}
              className="group inline-flex flex-col items-center mb-12 md:mb-20 hover:scale-105 transition-transform"
            >
              <p className="text-base md:text-2xl text-white/90 font-light italic mb-4 flex items-center gap-2">
                {t('cta.subtitle')}
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </p>
              <div className="h-0.5 w-full bg-white/30 group-hover:bg-white transition-colors"></div>
            </button>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/70 mb-3 md:mb-4">Direct Line</div>
                <div className="text-3xl md:text-7xl font-black tracking-tight">{t('cta.phone')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 md:py-20 bg-black text-white/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-8">
            <div className="text-center md:text-left">
              <p className="text-xl md:text-2xl font-black text-white mb-2 uppercase tracking-tighter">REMIX</p>
              <p className="text-xs md:text-sm font-light max-w-xs mx-auto md:mx-0 mb-6 md:mb-0">{t('footer.text')}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://www.zcool.com.cn/u/2436868" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-white/60 hover:text-white hover:border-white transition-all text-xs font-bold uppercase tracking-widest"
              >
                {t('footer.zcool')}
                <ExternalLink size={12} />
              </a>
              <a 
                href="https://www.xiaohongshu.com/user/profile/657ff5590000000020035cfc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-white/60 hover:text-white hover:border-white transition-all text-xs font-bold uppercase tracking-widest"
              >
                {t('footer.xiaohongshu')}
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="text-center md:text-right text-[10px] md:text-xs uppercase tracking-widest font-bold">
              © 2026 ReMix System / Efficiency Reconstructed
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans selection:bg-[#ff6b35] selection:text-white">
        <LanguageSwitcher />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gallery" element={<DemoGallery />} />
        </Routes>
      </div>
    </Router>
  );
}
