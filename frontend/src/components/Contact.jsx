import { useLanguage } from "../context/LanguageContext";

const socialIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 2c.3 2.3 1.7 3.9 4 4.2v3c-1.5 0-2.9-.5-4-1.3v6.6c0 3.4-2.7 6-6 6s-6-2.6-6-6 2.7-6 6-6c.4 0 .8 0 1.1.1v3.1a3 3 0 1 0 2.1 2.9V2h2.8z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12s0-3.4-.4-5a3 3 0 0 0-2.1-2.1C17.9 4.5 12 4.5 12 4.5s-5.9 0-7.5.4A3 3 0 0 0 2.4 7C2 8.6 2 12 2 12s0 3.4.4 5a3 3 0 0 0 2.1 2.1c1.6.4 7.5.4 7.5.4s5.9 0 7.5-.4A3 3 0 0 0 21.6 17c.4-1.6.4-5 .4-5zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5H17V3.6C16.6 3.5 15.5 3.4 14.3 3.4c-2.5 0-4.2 1.5-4.2 4.3V10H7.4v3.1H10v8h3.5z" />
    </svg>
  )
};

export default function Contact({ settings }) {
  const { lang, t } = useLanguage();

  const socials = ["instagram", "tiktok", "youtube", "facebook"].filter(
    (key) => settings[key]
  );

  return (
    <footer id="contact" className="contact">
      <h2 className="contact__heading">{t.contact}</h2>

      <div className="contact__list">
        {settings.phone && (
          <a className="contact__item" href={`tel:${settings.phone.replace(/\s/g, "")}`}>
            <span className="contact__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.7a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.7.7a2 2 0 0 1 1.8 2.2z" />
              </svg>
            </span>
            {settings.phone}
          </a>
        )}

        {settings.whatsapp && (
          <a
            className="contact__item"
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact__icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2z" />
              </svg>
            </span>
            WhatsApp
          </a>
        )}

        {settings[`location_${lang}`] && (
          <div className="contact__item">
            <span className="contact__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            {settings.location_map_url ? (
              <a href={settings.location_map_url} target="_blank" rel="noreferrer">
                {settings[`location_${lang}`]}
              </a>
            ) : (
              settings[`location_${lang}`]
            )}
          </div>
        )}
      </div>

      {socials.length > 0 && (
        <div className="contact__socials">
          {socials.map((key) => (
            <a
              key={key}
              className="contact__social"
              href={settings[key]}
              target="_blank"
              rel="noreferrer"
              aria-label={key}
            >
              {socialIcons[key]}
            </a>
          ))}
        </div>
      )}

      <p className="contact__footer">
        © {new Date().getFullYear()} {settings.site_name}
      </p>
    </footer>
  );
}
