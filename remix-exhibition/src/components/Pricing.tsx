import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export const Pricing: React.FC = () => {
  const { t } = useTranslation();

  const packages = ['entry', 'standard', 'advanced', 'enterprise'];

  return (
    <section className="py-16 md:py-32 bg-white" id="pricing">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6 md:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-[#1e3a5f] uppercase tracking-tight leading-tight mb-4 md:mb-6">
              {t('pricing.title')}
            </h2>
            <div className="h-1.5 md:h-2 w-16 md:w-24 bg-[#ff6b35]"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`p-6 md:p-10 rounded-none transition-all flex flex-col border-l-2 border-slate-100 hover:border-[#ff6b35] group ${
                pkg === 'standard' 
                  ? 'bg-[#1e3a5f] text-white' 
                  : 'bg-white text-[#1e3a5f]'
              }`}
              id={`pricing-card-${pkg}`}
            >
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8 opacity-50">
                Package 0{index + 1}
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">{t(`pricing.packages.${pkg}.title`)}</h3>
              <div className="text-2xl md:text-4xl font-black text-[#ff6b35] mb-6 md:mb-8">
                {t(`pricing.packages.${pkg}.price`)}
              </div>
              <p className={`text-sm md:text-lg leading-relaxed ${pkg === 'standard' ? 'text-white/70' : 'text-slate-500'}`}>
                {t(`pricing.packages.${pkg}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
