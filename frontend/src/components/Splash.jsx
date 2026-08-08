import { useState, useRef, useEffect } from "react";

export default function Splash({ title, subtitle, swipeLabel, onFinish }) {
  const [leaving, setLeaving] = useState(false);
  const startY = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    // Блокируем скролл фона пока сплэш открыт
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function finish() {
    setLeaving(true);
    setTimeout(onFinish, 550);
  }

  function handleTouchStart(e) {
    startY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (startY.current === null) return;
    const delta = startY.current - e.changedTouches[0].clientY;
    if (delta > 60) finish();
    startY.current = null;
  }

  function handleWheel(e) {
    if (e.deltaY > 30) finish();
  }

  return (
    <div
      ref={rootRef}
      className={`splash${leaving ? " leaving" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onClick={finish}
    >
      <h1 className="splash__title">{title}</h1>
      <p className="splash__subtitle">{subtitle}</p>
      <div className="splash__swipe">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {swipeLabel}
      </div>
    </div>
  );
}
