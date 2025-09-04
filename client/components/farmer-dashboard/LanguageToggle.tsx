import React, { useState } from "react";

function LanguageToggle() {
  const [lang, setLang] = useState<'en'|'hi'>('en');
  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => setLang('en')} aria-pressed={lang==='en'} className={`px-2 py-1 rounded-md ${lang==='en'? 'bg-[hsl(var(--primary))] text-white' : 'bg-white border'}`}>EN</button>
      <button onClick={() => setLang('hi')} aria-pressed={lang==='hi'} className={`px-2 py-1 rounded-md ${lang==='hi'? 'bg-[hsl(var(--primary))] text-white' : 'bg-white border'}`}>HI</button>
    </div>
  );
}

export default React.memo(LanguageToggle);
