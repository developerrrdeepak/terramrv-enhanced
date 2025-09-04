import React, { useState } from "react";

export default function LanguageToggle() {
  const [lang, setLang] = useState<'en'|'hi'>('en');
  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-md ${lang==='en'? 'bg-[#4CAF50] text-white' : 'bg-white border'}`}>EN</button>
      <button onClick={() => setLang('hi')} className={`px-2 py-1 rounded-md ${lang==='hi'? 'bg-[#4CAF50] text-white' : 'bg-white border'}`}>HI</button>
    </div>
  );
}
