import React, { useEffect, useRef, useState } from 'react';
import { FaLandmark, FaUsers, FaGraduationCap } from 'react-icons/fa';

export default function Home() {
  const villageInfo = {
    established: "१९५५",
    population: "२,५००",
    literacy: "८५%",
  };

  const imageGrid = [
    { src: "/images/developed village 2.webp", alt: "Village 1" },
    { src: "/images/developed village.jpg", alt: "Village 2" },
    { src: "/images/gpvasardi.jpg", alt: "Village 3" },
    { src: "/images/phu.jpeg", alt: "Village 4" },
    { src: "/images/place.jpeg", alt: "Village 5" },
    { src: "/images/samajmandir.jpeg", alt: "Village 6" },
    { src: "/images/school.jpeg", alt: "Village 7" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const delay = 3000; // Change image every 3 seconds

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === imageGrid.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // --- Add these for marquee pause/resume ---
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleMarqueeMouseEnter = () => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMarqueeMouseLeave = () => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'running';
    }
  };

  // ------------------------------------------

  return (
    <div className="min-h-screen bg-white font-sans text-[14px] sm:text-base">
      {/* Header Banner with Slideshow */}
      <section className="bg-gradient-to-r from-blue-700 via-green-500 to-green-300 text-white py-6 px-2 sm:py-12 sm:px-6 relative overflow-hidden shadow-lg">
        <div className="max-w-6xl mx-auto relative">
          {/* Slideshow Container */}
          <div className="relative w-full h-48 sm:h-96 overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl mb-4 sm:mb-6">
            <div
              className="flex transition-transform duration-[2000ms] ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {imageGrid.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  className={`w-full flex-shrink-0 object-contain h-48 sm:h-96 transition-transform duration-[2000ms] ease-in-out ${
                    index === currentIndex ? "scale-105 opacity-100" : "scale-100 opacity-60"
                  }`}
                  style={{
                    transition: "transform 2s cubic-bezier(0.4,0,0.2,1), opacity 1.2s",
                  }}
                />
              ))}
            </div>
            {/* Swacch Sundar Harit Vathode Title (left, overlay, visible on all screens) */}
            <div className="absolute left-2 top-2 sm:left-6 sm:top-6 bg-black/40 rounded-lg px-2 py-1 sm:px-4 sm:py-2 shadow">
              <p className="text-base sm:text-2xl font-semibold leading-tight text-green-200">स्वच्छ सुंदर</p>
              <p className="text-lg sm:text-3xl font-extrabold text-green-400">हरित वाठोडे</p>
            </div>
          </div>

          {/* Village Title & Dots */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-0">
            <div className="text-center sm:text-right w-full">
              <p className="text-lg sm:text-3xl font-semibold leading-tight drop-shadow">विकसित</p>
              <p className="text-xl sm:text-4xl font-extrabold text-yellow-200 drop-shadow">वाठोडे</p>
            </div>
            {/* Dots for slideshow */}
            <div className="flex justify-center sm:justify-end mt-2 sm:mt-0 w-full sm:w-auto">
              {imageGrid.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full mx-1 border-2 border-yellow-200 transition-all duration-300 ${
                    idx === currentIndex ? "bg-yellow-300 scale-110 shadow" : "bg-white/60"
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Strip */}
      <div className="relative w-full bg-black overflow-hidden h-10 sm:h-12 flex items-center">
        <div className="absolute left-0 top-0 h-full flex items-center px-3 bg-yellow-400 text-black font-bold text-xs sm:text-sm rounded-br-md z-10">
          सूचना
        </div>
        <div className="w-full h-full flex items-center pl-24">
          <a
            href="https://maharashtra.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-full"
            onMouseEnter={handleMarqueeMouseEnter}
            onMouseLeave={handleMarqueeMouseLeave}
          >
            <div
              ref={marqueeRef}
              className="whitespace-nowrap animate-marquee text-white text-xs sm:text-base font-medium flex items-center gap-10 sm:gap-16 cursor-pointer"
              style={{ animationPlayState: 'running' }}
            >
              <span className="relative">
                पारदर्शक प्रशासन आणि समाजाच्या सहभागामाधून एक सक्षम, आत्मनिर्भर गाव निर्माण करूया. पारदर्शक प्रशासन आणि समाजाच्या सहभागामाधून एक सक्षम, आत्मनिर्भर गाव निर्माण करूया.
                <span className="absolute -top-2 right-0 flex items-center">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-700 border-2 border-white"></span>
                    <span className="absolute inset-0 flex items-center justify-center text-[0.55rem] font-bold text-white">New</span>
                  </span>
                </span>
              </span>
              <span>अधिक माहितीसाठी ग्रामपंचायत कार्यालयला संपर्क करा</span>
            </div>
          </a>
        </div>
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              animation: marquee 15s linear infinite;
              display: inline-flex;
              min-width: 100%;
            }
          `}
        </style>
      </div>

      {/* Panchayat Info Section */}
      <section className="relative py-10 px-3 sm:px-6">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            src="/images/wathoda video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-xl sm:text-3xl font-bold mb-6">ग्रामपंचायत माहिती</h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-8">
            <div className="bg-white/80 p-2 sm:p-4 rounded-xl shadow-md w-32 sm:w-52">
              <FaLandmark className="text-blue-600 text-xl sm:text-3xl mx-auto mb-1 sm:mb-2" />
              <p className="font-semibold text-xs sm:text-base">स्थापना वर्ष</p>
              <p className="text-xs sm:text-base">{villageInfo.established}</p>
            </div>
            <div className="bg-white/80 p-2 sm:p-4 rounded-xl shadow-md w-36 sm:w-60">
              <FaUsers className="text-green-600 text-xl sm:text-3xl mx-auto mb-1 sm:mb-2" />
              <p className="font-semibold text-xs sm:text-base">लोकसंख्या</p>
              <p className="text-xs sm:text-base">{villageInfo.population}</p>
            </div>
            <div className="bg-white/80 p-2 sm:p-4 rounded-xl shadow-md w-28 sm:w-48">
              <FaGraduationCap className="text-purple-600 text-xl sm:text-3xl mx-auto mb-1 sm:mb-2" />
              <p className="font-semibold text-xs sm:text-base">साक्षरता दर</p>
              <p className="text-xs sm:text-base">{villageInfo.literacy}</p>
            </div>
          </div>
        </div>
      </section>

{/* Executive Members */}
<section className="relative py-10 px-3 sm:px-6">
  <div className="absolute inset-0 z-0 pointer-events-none">
    <img
      src={imageGrid[1]?.src}
      alt="background"
      className="w-full h-full object-cover opacity-20 blur-md animate-slide-bg"
    />
    <style>
      {`
        @keyframes slide-bg {
          0% { transform: scale(1.05) translateX(0); }
          100% { transform: scale(1.05) translateX(-30px); }
        }
        .animate-slide-bg {
          animation: slide-bg 15s linear infinite alternate;
        }
      `}
    </style>
  </div>
  <div className="relative z-10 text-center">
    <h2 className="text-xl sm:text-3xl font-bold mb-6">कार्यकारी सदस्य</h2>
    <div className="flex flex-wrap justify-center gap-4">
      <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-[240px]">
        <img src="/images/sarpanch.jpg" alt="Sarpanch" className="w-20 h-20 mx-auto rounded-full object-cover mb-2" />
        <h3 className="text-lg font-semibold">Vikas Patil</h3>
        <p className="text-gray-600 text-sm">(मा.सरपंच वाठोडे)</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-[240px]">
        <img src="/images/gramsevak.jpg" alt="Gramsevak" className="w-20 h-20 mx-auto rounded-full object-cover mb-2" />
        <p className="text-gray-600 text-sm font-semibold">श्री. शरद पुंडलिक कोळी</p>
        <p className="text-gray-600 text-sm">(ग्रामसेवक, वाठोडे)</p>
      </div>
    </div>
  </div>
</section>

{/* Connect With Government Section */}
<section className="py-12 px-2 sm:px-6 bg-[#ececff]">
  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-black">Connect With Government</h2>
  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
    {/* Card 1 */}
    <a
      href="https://digitalindia.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/digital_india.jpg" alt="Digital India" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        Digital India
      </div>
    </a>
    {/* Card 2 */}
    <a
      href="https://www.makeinindia.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/make_in_india.jpg" alt="Make in India" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        Make in India
      </div>
    </a>
    {/* Card 3 */}
    <a
      href="https://swachhbharat.mygov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/swatch-bharat.jpg" alt="Swachh Bharat Abhiyaan" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        Swachh Bharat Abhiyan
      </div>
    </a>
    {/* Card 4 */}
    <a
      href="https://bharatkeveer.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/bharat-ke-veer.jpg" alt="Bharat ke Veer" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        Bharat ke Veer
      </div>
    </a>
    {/* Card 5 */}
    <a
      href="https://www.mygov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/mygov.png" alt="MyGov" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        MyGov- Connect with Gov.
      </div>
    </a>
    {/* Card 6 */}
    <a
      href="https://pmjdy.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="../../public/images/jan_dhan_yojna.jpg" alt="P.M Jan Dhan Yojana" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        P.M Jan Dhan Yojana
      </div>
    </a>
    {/* Card 7 */}
    <a
      href="https://www.nsiindia.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="../../public/images/Sukanya_Samriddhi_Yojana_Scheme.jpg" alt="Sukanya Samriddhi Yojana" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        Sukanya Samriddhi Yojana
      </div>
    </a>
    {/* Card 8 */}
    <a
      href="https://www.skillindia.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded overflow-hidden shadow-lg group"
    >
      <img src="/images/skill_india.jpg" alt="National Skill Dev. Mission" className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-80 text-white text-lg font-semibold text-center py-2 group-hover:bg-opacity-90 transition">
        National Skill Devel. Mission
      </div>
    </a>
  </div>
</section>
    </div>
  );
}
