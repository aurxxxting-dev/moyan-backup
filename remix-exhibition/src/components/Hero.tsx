import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-start overflow-hidden bg-[#1e3a5f] px-6 md:px-24 py-24 md:py-0" id="hero">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] md:w-[60%] h-[80%] md:h-[60%] bg-[#ff6b35] blur-[80px] md:blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[60%] md:h-[40%] bg-white blur-[60px] md:blur-[100px] rounded-full"></div>
      </div>
      
      <div className="container mx-auto relative z-10 text-left">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-[#ff6b35] text-xs md:text-sm font-bold tracking-widest uppercase mb-6 md:mb-8"
        >
          Efficiency Redefined
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-7xl md:text-[10rem] font-black text-white leading-tight mb-6 md:mb-8 tracking-tight uppercase"
        >
          {t('hero.title')}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-5xl text-white/90 mb-10 md:mb-12 font-light max-w-3xl leading-tight"
        >
          {t('hero.subtitle')}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-2xl text-white/60 max-w-2xl border-l-2 border-[#ff6b35] pl-6 md:pl-8 italic"
        >
          <Trans i18nKey="hero.tagline">
            让 <span className="text-[#ff6b35] font-bold">10人设计部</span> 变成 <span className="text-[#ff6b35] font-bold">2人</span>，年省 <span className="text-[#ff6b35] font-bold">40万+</span>
          </Trans>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5, duration: 2 }}
        className="absolute right-[-5%] bottom-[-5%] text-[20vw] font-black text-white select-none pointer-events-none leading-none"
      >
        REMIX
      </motion.div>
    </section>
  );
};
