import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Users, Repeat, Clock, Trophy } from 'lucide-react';

export const Features: React.FC = () => {
  const { t } = useTranslation();

  const painPoints = [
    { key: 'team', icon: <Users size={32} /> },
    { key: 'repetition', icon: <Repeat size={32} /> },
    { key: 'cycle', icon: <Clock size={32} /> },
    { key: 'bidding', icon: <Trophy size={32} /> },
  ];

  return (
    <section className="py-16 md:py-32 bg-slate-50" id="features">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <h2 className="text-3xl sm:text-6xl md:text-8xl font-black text-[#1e3a5f] uppercase tracking-tight leading-tight mb-6 md:mb-8">
              {t('painPoints.title')}
            </h2>
            <div className="w-16 md:w-20 h-1.5 md:h-2 bg-[#ff6b35] mb-6 md:mb-8"></div>
            <p className="text-base md:text-xl text-slate-500 font-light max-w-xs">
              Traditional exhibition design is broken. We identify the core inefficiencies that drain your resources.
            </p>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {painPoints.map((point, index) => (
              <motion.div
                key={point.key}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 md:p-12 bg-white rounded-none border-b-2 border-slate-200 hover:border-[#ff6b35] transition-all group"
                id={`pain-card-${point.key}`}
              >
                <div className="mb-6 md:mb-8 text-slate-300 group-hover:text-[#ff6b35] transition-colors">
                  {point.icon}
                </div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#ff6b35] mb-3 md:mb-4">
                  Issue 0{index + 1}
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1e3a5f] mb-3 md:mb-4">
                  {t(`painPoints.cards.${point.key}.title`)}
                </h3>
                <p className="text-sm md:text-lg text-slate-500 leading-relaxed font-light">
                  {t(`painPoints.cards.${point.key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
