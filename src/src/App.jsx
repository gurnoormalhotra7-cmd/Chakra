// Your ChakraApp component — lightly adjusted for JSX environment
import React, { useState, useEffect } from 'react';
import { 
  Flashlight, 
  MapPin, 
  Phone, 
  Settings, 
  Mic, 
  ShieldAlert, 
  X, 
  ChevronRight, 
  Battery, 
  Navigation, 
  Bell, 
  Siren 
} from 'lucide-react';

// TRANSLATIONS (same as you provided)
const TRANSLATIONS = {
  en: {
    title: "Chakra",
    subtitle: "Emergency Safety System",
    login_phone: "Enter Mobile Number",
    get_otp: "Get OTP",
    verify_otp: "Verify OTP",
    otp_sent: "OTP sent to",
    resend: "Resend OTP",
    hello: "Hello, Aditi",
    system_active: "System Active",
    sos_label: "SOS",
    sos_hint: "PRESS 3s",
    flashlight: "Flashlight",
    location: "Location",
    emergency_title: "EMERGENCY",
    alerting: "Alerting Contacts & 112",
    loc_sent: "Live Location Sent",
    recording: "Audio Recording",
    safe: "I AM SAFE",
    battery_opt: "Battery Optimization Active"
  },
  hi: {
    title: "चक्र",
    subtitle: "आपातकालीन सुरक्षा प्रणाली",
    login_phone: "मोबाइल नंबर दर्ज करें",
    get_otp: "ओटीपी प्राप्त करें",
    verify_otp: "ओटीपी सत्यापित करें",
    otp_sent: "ओटीपी भेजा गया",
    resend: "ओटीपी पुनः भेजें",
    hello: "नमस्ते, अदिति",
    system_active: "सिस्टम सक्रिय है",
    sos_label: "बचाओ",
    sos_hint: "3 सेकंड दबाएं",
    flashlight: "टॉर्च",
    location: "स्थान",
    emergency_title: "आपातकालीन",
    alerting: "संपर्कों और 112 को सूचित कर रहा है",
    loc_sent: "लाइव लोकेशन भेजी गई",
    recording: "ऑडियो रिकॉर्डिंग",
    safe: "मैं सुरक्षित हूँ",
    battery_opt: "बैटरी अनुकूलन सक्रिय"
  }
};

// Button component (keeps your styles)
const Button = ({ className = '', variant = 'primary', size = 'default', children, disabled, ...props }) => {
  const variants = {
    primary: 'bg-white text-[#282834] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-900/20',
    outline: 'border-2 border-white/20 text-white hover:bg-white/10',
    ghost: 'text-white/60 hover:text-white hover:bg-white/5',
  };
  
  const sizes = {
    default: 'h-12 px-6 rounded-xl font-bold',
    icon: 'h-14 w-14 rounded-full flex items-center justify-center',
    lg: 'h-16 px-8 rounded-2xl text-xl font-black tracking-wide',
  };

  return (
    <button 
      className={`transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default function ChakraApp() {
  const [screen, setScreen] = useState('login');
  const [lang, setLang] = useState('en');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [locationOn, setLocationOn] = useState(true);
  const [coords, setCoords] = useState(null);
  const [audioLevel, setAudioLevel] = useState(new Array(5).fill(10));
  const [notification, setNotification] = useState(null);

  const t = TRANSLATIONS[lang];

  const sendNotification = (title, body) => {
    setNotification({ title, msg: body });
    setTimeout(() => setNotification(null), 4000);

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') new Notification(title, { body });
        });
      }
    }
  };

  const toggleFlashlight = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      if (capabilities && capabilities.torch) {
        await track.applyConstraints({ advanced: [{ torch: !flashlightOn }] });
        setFlashlightOn(!flashlightOn);
      } else {
        setFlashlightOn(!flashlightOn);
      }
    } catch (e) {
      setFlashlightOn(!flashlightOn);
    }
  };

  useEffect(() => {
    if (screen === 'dashboard' || screen === 'emergency') {
      if ('geolocation' in navigator) {
        const watchId = navigator.geolocation.watchPosition(
          (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => console.error(err),
          { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
      }
    }
  }, [screen]);

  useEffect(() => {
    if (screen === 'emergency') {
      const interval = setInterval(() => {
        setAudioLevel(prev => prev.map(() => Math.floor(Math.random() * 40) + 10));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [screen]);

  const LoginScreen = () => (
    <div className="flex flex-col h-full p-8 animate-in fade-in zoom-in duration-300">
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/5">
          <ShieldAlert size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">{t.title}</h1>
        <p className="text-white/60 font-medium">{t.subtitle}</p>
      </div>
      
      <div className="w-full space-y-4 bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
        <label className="text-xs text-white/50 uppercase font-bold tracking-wider">{t.login_phone}</label>
        <div className="flex gap-2">
          <div className="h-12 w-16 bg-white/10 rounded-xl flex items-center justify-center text-white font-bold border border-white/10">
            +91
          </div>
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-12 flex-1 bg-white/10 rounded-xl px-4 text-white font-bold placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 border border-white/10"
            placeholder="98765 43210"
          />
        </div>
        <Button 
          className="w-full mt-4" 
          disabled={phone.length < 10}
          onClick={() => {
            const code = Math.floor(1000 + Math.random() * 9000).toString();
            setGeneratedOtp(code);
            setScreen('otp');
            setTimeout(() => sendNotification("Messages", `Your Chakra verification code is ${code}`), 1500);
          }}
        >
          {t.get_otp} <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );

  const OTPScreen = () => {
    const handleChange = (element, index) => {
      if (isNaN(element.value)) return;
      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);
      if (element.nextSibling && element.value) {
        element.nextSibling.focus();
      }
    };

    return (
      <div className="flex flex-col h-full p-8 pt-20 animate-in slide-in-from-right duration-300">
        <button onClick={() => setScreen('login')} className="absolute top-8 left-8 text-white/50 hover:text-white">
          <ChevronRight className="rotate-180" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-2">{t.verify_otp}</h2>
        <p className="text-white/60 mb-8">{t.otp_sent} +91 {phone}</p>

        <div className="flex gap-4 justify-center mb-8">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="w-14 h-16 bg-white/10 border-2 border-white/10 rounded-2xl text-center text-2xl font-bold text-white focus:border-green-400 focus:outline-none transition-all"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onFocus={e => e.target.select()}
            />
          ))}
        </div>

        <Button 
          className="w-full"
          disabled={otp.join('').length !== 4} 
          onClick={() => {
            if (otp.join('') === generatedOtp) {
              setScreen('language');
            } else {
              alert(`Incorrect OTP. Try ${generatedOtp} (Simulated)`);
            }
          }}
        >
          {t.verify_otp}
        </Button>
        <button className="mt-6 text-white/40 text-sm font-semibold hover:text-green-400 transition-colors">
          {t.resend}
        </button>
      </div>
    );
  };

  const LanguageScreen = () => (
    <div className="flex flex-col h-full p-8 animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 ring-2 ring-green-500/40">
           <span className="text-4xl">Aa</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Select Language</h2>
        <p className="text-white/60">Choose your preferred language</p>
      </div>
      
      <div className="space-y-4 w-full">
        <Button variant="outline" className="w-full justify-between group h-16 text-lg" onClick={() => { setLang('en'); setScreen('dashboard'); }}>
          English <ChevronRight className="group-hover:translate-x-1 transition-transform opacity-50"/>
        </Button>
        <Button variant="outline" className="w-full justify-between group h-16 text-lg" onClick={() => { setLang('hi'); setScreen('dashboard'); }}>
          हिंदी (Hindi) <ChevronRight className="group-hover:translate-x-1 transition-transform opacity-50"/>
        </Button>
      </div>
    </div>
  );

  const DashboardScreen = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-500 relative">
      {flashlightOn && (
        <div className="absolute inset-0 bg-white z-[60] animate-in fade-in duration-100 pointer-events-none mix-blend-overlay opacity-50" />
      )}

      <header className="p-6 flex justify-between items-center bg-[#282834] z-10">
        <div>
          <h2 className="text-white font-bold text-xl">{t.hello}</h2>
          <p className="text-green-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]" /> {t.system_active}
          </p>
        </div>
        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 cursor-pointer">
          <Settings size={20} className="text-white" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute w-72 h-72 border border-white/5 rounded-full animate-[ping_3s_linear_infinite]" />
        <div className="absolute w-56 h-56 border border-white/10 rounded-full animate-[ping_2s_linear_infinite]" />
        
        <button 
          onMouseDown={() => {
            const timer = setTimeout(() => {
              setScreen('emergency');
              sendNotification("CRITICAL ALERT", "SOS Activated. Location sent to Emergency Contacts.");
              if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
            }, 1000);
            window.sosTimer = timer;
          }}
          onMouseUp={() => {
            clearTimeout(window.sosTimer);
          }}
          onTouchStart={() => {
             const timer = setTimeout(() => {
              setScreen('emergency');
              sendNotification("CRITICAL ALERT", "SOS Activated. Location sent to Emergency Contacts.");
              if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
            }, 1000);
            window.sosTimer = timer;
          }}
          onTouchEnd={() => {
             clearTimeout(window.sosTimer);
          }}
          className="w-44 h-44 bg-gradient-to-b from-[#EF4444] to-[#B91C1C] rounded-full shadow-[0_0_60px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center active:scale-90 transition-transform duration-200 z-10 border-4 border-[#282834] ring-4 ring-[#EF4444]/30 relative group"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          <span className="text-4xl font-black text-white tracking-widest drop-shadow-md">{t.sos_label}</span>
          <span className="text-white/80 text-[10px] mt-1 uppercase font-bold tracking-widest bg-black/20 px-2 py-0.5 rounded-full">{t.sos_hint}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 p-6 z-10">
        <button 
          onClick={toggleFlashlight}
          className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${
            flashlightOn 
            ? "bg-white text-[#282834] border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
            : "bg-white/5 text-white border-white/10 hover:bg-white/10"
          }`}
        >
          <Flashlight size={24} className={flashlightOn ? "fill-current" : ""} />
          <span className="font-bold text-sm">{t.flashlight}</span>
        </button>

        <button 
          onClick={() => setLocationOn(!locationOn)}
          className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${
            locationOn 
            ? "bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]" 
            : "bg-white/5 text-white border-white/10 hover:bg-white/10"
          }`}
        >
          <MapPin size={24} className={locationOn ? "fill-current" : ""} />
          <span className="font-bold text-sm">{t.location}</span>
        </button>
      </div>

      <div className="h-20 bg-[#1F1F2A] border-t border-white/5 flex items-center justify-around z-10">
        <Button variant="ghost" size="icon" className="text-green-400 bg-green-400/10"><Navigation size={24}/></Button>
        <Button variant="ghost" size="icon"><Phone size={24}/></Button>
        <Button variant="ghost" size="icon"><Bell size={24}/></Button>
      </div>
    </div>
  );

  const EmergencyScreen = () => (
    <div className="flex flex-col h-full bg-[#EF4444] relative overflow-hidden animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 via-red-600 to-red-700 animate-pulse" />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center animate-bounce shadow-xl">
          <Siren size={48} className="text-[#EF4444]" />
        </div>
        
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-sm">
            {t.emergency_title}
          </h1>
          <p className="text-white/90 text-sm font-bold uppercase tracking-wider bg-black/10 py-1 px-3 rounded-full inline-block">
            {t.alerting}
          </p>
        </div>

        <div className="bg-[#282834]/90 rounded-2xl p-5 w-full backdrop-blur-md border border-white/20 shadow-2xl space-y-4">
          <div className="flex items-center gap-4 text-white border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Navigation size={20} className="fill-current" />
            </div>
            <div className="text-left flex-1">
              <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">{t.loc_sent}</p>
              <p className="font-mono text-sm font-bold truncate">
                {coords ? `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E` : "Acquiring GPS..."}
              </p>
            </div>
            {coords && <div className="h-2 w-2 bg-green-500 rounded-full animate-ping" />}
          </div>

          <div className="flex items-center gap-4 text-white">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 animate-pulse">
              <Mic size={20} />
            </div>
            <div className="text-left flex-1">
              <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">{t.recording}</p>
              <div className="flex items-end gap-1 h-6 mt-1">
                {audioLevel.map((h, i) => (
                  <div key={i} className="w-1.5 bg-red-400 rounded-t-sm transition-all duration-100" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center text-white/80 text-xs font-semibold bg-black/10 px-3 py-1.5 rounded-lg">
           <Battery size={14} /> {t.battery_opt}
        </div>
      </div>

      <div className="relative z-10 p-6 pb-10 bg-gradient-to-t from-red-900/80 to-transparent">
        <Button 
          variant="default"
          size="lg"
          className="w-full bg-white text-[#EF4444] hover:bg-white/90 shadow-xl border-b-4 border-gray-200 active:border-b-0 active:translate-y-1"
          onClick={() => {
            setScreen('dashboard');
            sendNotification("SAFE", "Emergency Mode Deactivated");
            setFlashlightOn(false);
          }}
        >
          <X size={28} /> {t.safe}
        </Button>
      </div>
    </div>
  );

  const NotificationToast = () => {
    if (!notification) return null;
    return (
      <div className="absolute top-4 left-4 right-4 z-[100] animate-in slide-in-from-top duration-500">
        <div className="bg-white/90 backdrop-blur-md text-[#282834] p-4 rounded-2xl shadow-2xl flex gap-3 border border-white/50">
          <div className="w-10 h-10 bg-[#282834] rounded-xl flex items-center justify-center shrink-0">
             <ShieldAlert size={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm">{notification.title}</h4>
            <p className="text-xs text-gray-600 leading-tight">{notification.msg}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 font-sans p-4">
      <div className="relative w-[375px] h-[812px] bg-[#282834] rounded-[45px] shadow-[0_0_0_12px_#1f2937] overflow-hidden">
        <div className="absolute top-0 w-full h-12 flex justify-between items-end px-8 pb-3 z-50 text-white pointer-events-none">
          <span className="text-sm font-bold">9:41</span>
          <div className="flex gap-1.5 items-center">
            <div className="w-4 h-4"><Navigation size={14} className="fill-white"/></div>
            <div className="w-6 h-3 border border-white/40 rounded-[4px] relative">
              <div className="absolute inset-0.5 bg-white rounded-[1px] w-[70%]" />
            </div>
          </div>
        </div>

        <div className="h-full pt-6">
          <NotificationToast />
          {screen === 'login' && <LoginScreen />}
          {screen === 'otp' && <OTPScreen />}
          {screen === 'language' && <LanguageScreen />}
          {screen === 'dashboard' && <DashboardScreen />}
          {screen === 'emergency' && <EmergencyScreen />}
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
}
