import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const IMAGES = [
  'https://i.imgs.ovh/2026/03/19/O6xb0M.jpeg',
  'https://i.imgs.ovh/2026/03/19/O6xzzr.jpeg',
  'https://i.imgs.ovh/2026/03/19/O6xA2h.jpeg',
  'https://i.imgs.ovh/2026/03/19/O6xRXe.jpeg',
  'https://i.imgs.ovh/2026/03/19/O6xkSa.jpeg',
  'https://i.imgs.ovh/2026/03/19/O6xqDt.jpeg',
  'https://i.imgs.ovh/2026/03/19/O6x5hq.jpeg',
  'https://i.imgs.ovh/2026/03/19/O6x8jC.jpeg',
  'https://i.imgs.ovh/2026/03/19/O6xe54.jpeg',
];

const VIDEOS = [
  'https://pic5.fukit.cn/autoupload/vtq-yo8BYN1zv3pkiiOsqtiO_OyvX7mIgxFBfDMDErs/20260319/zUHO/7b9a534e46014ace0691c09b771ad028.mp4',
  'https://pic5.fukit.cn/autoupload/vtq-yo8BYN1zv3pkiiOsqtiO_OyvX7mIgxFBfDMDErs/20260319/Cbm4/d858689bc016f53c02cbdd2db42ac59a.mp4',
];

export const DemoGallery: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#1e3a5f] text-white selection:bg-[#ff6b35] selection:text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1e3a5f]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#ff6b35] hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back</span>
          </button>
          <div className="text-xl font-black tracking-tighter uppercase">REMIX GALLERY</div>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 md:mb-24"
        >
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight leading-tight mb-6">
            {t('gallery.title', 'Effect Showcase')}
          </h1>
          <div className="h-2 w-24 bg-[#ff6b35] mb-8"></div>
          <p className="text-xl md:text-2xl text-white/60 font-light italic max-w-3xl">
            {t('gallery.subtitle', 'Witness the transformation of exhibition design efficiency through our ReMix system.')}
          </p>
        </motion.div>

        {/* Videos Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff6b35]">01 / Video Showcase</div>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {VIDEOS.map((video, idx) => (
              <motion.div 
                key={video}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-video bg-black/40 overflow-hidden group"
              >
                <video 
                  src={video} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  controls
                  playsInline
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Images Section */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff6b35]">02 / Image Gallery</div>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {IMAGES.map((img, idx) => (
              <motion.div 
                key={img}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="break-inside-avoid"
              >
                <img 
                  src={img} 
                  alt={`Gallery ${idx}`} 
                  className="w-full h-auto border border-white/5 hover:border-[#ff6b35]/50 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
