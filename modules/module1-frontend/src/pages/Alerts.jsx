import React, { useState, useEffect } from 'react';
import { ShieldAlert, BellRing, Clock, Globe, CheckCircle2 } from 'lucide-react';

const HARDCODED_ALERTS = [
  {
    id: 1,
    type: 'danger',
    title: { English: 'Evacuation Warning', Konkani: 'स्थलांतर चेतावणी', Marathi: 'निर्वासन इशारा', Hindi: 'निकासी चेतावनी' },
    message: {
      English: 'Water levels in Mandovi river are rising rapidly. Residents of Patto area must move to the Community Hall shelter immediately.',
      Konkani: 'मांडवी न्हंयेचे उदक वाडटा. पाटो वाठारांतल्या लोकांनी रोखडेंच कम्युनिटी हॉल आश्रयांत वचचें.',
      Marathi: 'मांडवी नदीतील पाण्याची पातळी वेगाने वाढत आहे. पाटो भागातील रहिवाशांनी कम्युनिटी हॉलमध्ये जावे.',
      Hindi: 'मांडवी नदी में जल स्तर तेजी से बढ़ रहा है। पाटो क्षेत्र के निवासियों को तुरंत सामुदायिक हॉल आश्रय में जाना चाहिए।'
    },
    time: '10 mins ago',
    verified: true
  },
  {
    id: 2,
    type: 'warning',
    title: { English: 'Heavy Rainfall Alert', Konkani: 'जोरदार पावसाची शिटकावणी', Marathi: 'अतिवृष्टी इशारा', Hindi: 'भारी वर्षा चेतावनी' },
    message: {
      English: 'IMD predicts extremely heavy rainfall over North Goa for the next 24 hours. Stay indoors and avoid low-lying areas.',
      Konkani: 'हवामान खात्यान फुडल्या 24 वरांचो उत्तर गोंयांत चड पावसाचो अदमास दिला. घरांतूच रावचें.',
      Marathi: 'हवामान विभागाने उत्तर गोव्यात पुढील २४ तास मुसळधार पाऊस पडण्याचा अंदाज वर्तवला आहे.',
      Hindi: 'मौसम विभाग ने अगले 24 घंटों में उत्तरी गोवा में अत्यधिक भारी वर्षा की भविष्यवाणी की है।'
    },
    time: '2 hours ago',
    verified: true
  },
  {
    id: 3,
    type: 'info',
    title: { English: 'Road Block: NH-66', Konkani: 'रस्तो बंद: NH-66', Marathi: 'रस्ता बंद: NH-66', Hindi: 'रास्ता बंद: NH-66' },
    message: {
      English: 'NH-66 near Panaji bridge is partially blocked due to waterlogging. Use alternate route via Campal.',
      Konkani: 'पणजी पुलाजवळ NH-66 आडवो आसा. कांपाल वाटेन वचचें.',
      Marathi: 'पणजी पुलाजवळ NH-66 पाणी साचल्यामुळे अर्धवट बंद आहे. कांपाल मार्गे जा.',
      Hindi: 'पणजी पुल के पास NH-66 जलभराव के कारण आंशिक रूप से बंद है।'
    },
    time: '4 hours ago',
    verified: false
  }
];

const Alerts = () => {
  const [language, setLanguage] = useState('English');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch live alerts from backend
    fetch('http://127.0.0.1:8000/alerts/')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Map backend data to frontend schema with mock translations for the demo
          const mappedAlerts = data.map(backendAlert => {
            let type = 'info';
            let titles = { English: 'Community Alert', Konkani: 'समुदाय शिटकावणी', Marathi: 'समुदाय इशारा', Hindi: 'समुदाय चेतावनी' };
            
            const msg = backendAlert.message || '';
            const hazard = backendAlert.hazard_type || '';
            
            if (hazard === 'flood' || msg.toLowerCase().includes('flood')) {
              type = 'danger';
              titles = { English: 'Flood Warning', Konkani: 'हुंवार शिटकावणी', Marathi: 'पूर इशारा', Hindi: 'बाढ़ चेतावनी' };
            } else if (hazard === 'landslide') {
              type = 'danger';
              titles = { English: 'Landslide Warning', Konkani: 'भूंयस्खलन शिटकावणी', Marathi: 'भूस्खलन इशारा', Hindi: 'भूस्खलन चेतावनी' };
            } else if (hazard === 'fire') {
              type = 'warning';
              titles = { English: 'Fire Alert', Konkani: 'उजो शिटकावणी', Marathi: 'आग इशारा', Hindi: 'आग चेतावनी' };
            }

            // Real translations for the demo backend message
            let messages = { 
                English: msg,
                Konkani: `(Konkani) ${msg}`,
                Marathi: `(Marathi) ${msg}`,
                Hindi: `(Hindi) ${msg}`
            };

            // If it's the demo flood message, use actual translated strings
            if (msg.includes('Patto-Panaji') || msg.includes('vehicles')) {
               messages = {
                 English: msg,
                 Konkani: 'पाटो-पणजींत हुंवाराचो चड धोको आसा. वाहनां उंचेले सुवातेर व्हरचीं.',
                 Marathi: 'पाटो-पणजीमध्ये पुराचा मोठा धोका आहे. वाहने सुरक्षित आणि उंच ठिकाणी हलवा.',
                 Hindi: 'पाटो-पणजी में बाढ़ का उच्च जोखिम। वाहनों को ऊंचे स्थानों पर ले जाएं।'
               };
            }

            return {
              id: backendAlert.id || Math.random(),
              type: type,
              title: titles,
              message: messages,
              time: 'Just now',
              verified: backendAlert.status === 'Approved'
            };
          });
          setAlerts(mappedAlerts);
        } else {
          setAlerts(HARDCODED_ALERTS); // Fallback if no alerts yet
        }
      })
      .catch(err => {
        console.error('Failed to fetch alerts:', err);
        setAlerts(HARDCODED_ALERTS);
      });
  }, []);

  const typeStyles = {
    danger: { border: '#ef4444', icon: ShieldAlert, iconColor: '#ef4444', bg: '#fef2f2', labelBg: '#fee2e2', label: 'High Alert' },
    warning: { border: '#f59e0b', icon: BellRing, iconColor: '#d97706', bg: '#fffbeb', labelBg: '#fef3c7', label: 'Warning' },
    info: { border: '#3b82f6', icon: BellRing, iconColor: '#3b82f6', bg: '#eff6ff', labelBg: '#dbeafe', label: 'Info' },
  };

  return (
    <div style={{ background: '#f3f4ee', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Page header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e0e2da', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '0.25rem' }}>Community Alerts</h1>
            <p style={{ color: '#777', margin: 0, fontSize: '0.9rem' }}>Official verified alerts from authorities and IMD</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4ee', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e0e2da' }}>
            <Globe size={16} color="#5cb82b" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#333', outline: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
            >
              <option>English</option>
              <option>Konkani</option>
              <option>Marathi</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {alerts.map((alert) => {
          const s = typeStyles[alert.type];
          const Icon = s.icon;
          return (
            <div key={alert.id} style={{
              background: 'white',
              border: `1px solid #e0e2da`,
              borderLeft: `5px solid ${s.border}`,
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: s.bg, padding: '0.5rem', borderRadius: '8px' }}>
                    <Icon size={20} color={s.iconColor} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                      {alert.title[language] || alert.title.English}
                    </h3>
                    <span style={{ display: 'inline-block', marginTop: '0.2rem', background: s.labelBg, color: s.iconColor, padding: '0.1rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {s.label}
                    </span>
                  </div>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#aaa', whiteSpace: 'nowrap' }}>
                  <Clock size={13} /> {alert.time}
                </span>
              </div>

              <p style={{ fontSize: '0.97rem', lineHeight: '1.65', color: '#444', marginBottom: '1rem' }}>
                {alert.message[language] || alert.message.English}
              </p>

              {alert.verified && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#dcfce7', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                  <CheckCircle2 size={13} /> Verified by Authority
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Alerts;
