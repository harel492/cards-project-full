import { 
  Building2, 
  Users, 
  Shield, 
  Search, 
  Heart, 
  Smartphone, 
  Globe, 
  Zap, 
  Settings,
  CheckCircle,
  TrendingUp,
  Lock
} from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <Building2 size={32} />,
      title: "כרטיסי ביקור דיגיטליים",
      description: "יצירת כרטיסי ביקור מקצועיים עם עיצוב מודרני ומותאם אישית"
    },
    {
      icon: <Search size={32} />,
      title: "חיפוש מתקדם",
      description: "חיפוש מהיר וחכם בכרטיסי הביקור עם פילטרים מתקדמים"
    },
    {
      icon: <Heart size={32} />,
      title: "ניהול מועדפים",
      description: "סימון ושמירת כרטיסים כמועדפים לגישה מהירה"
    },
    {
      icon: <Shield size={32} />,
      title: "אבטחה מתקדמת",
      description: "מערכת אבטחה חזקה עם הצפנה וניהול הרשאות"
    },
    {
      icon: <Smartphone size={32} />,
      title: "רספונסיבי",
      description: "עיצוב מותאם לכל המכשירים - מחשב, טאבלט וטלפון"
    },
    {
      icon: <Globe size={32} />,
      title: "נגישות גלובלית",
      description: "גישה לכרטיסי הביקור מכל מקום בעולם"
    }
  ];

  const userTypes = [
    {
      icon: <Users size={32} />,
      title: "משתמש רגיל",
      description: "צפייה בכרטיסים וסימון מועדפים",
      features: ["צפייה בכרטיסי ביקור", "סימון מועדפים", "חיפוש מתקדם", "פרופיל אישי"],
      color: "var(--color-primary)"
    },
    {
      icon: <Building2 size={32} />,
      title: "משתמש עסקי",
      description: "יצירה וניהול כרטיסי ביקור",
      features: ["יצירת כרטיסי ביקור", "עריכת כרטיסים", "ניהול פרטי קשר", "סטטיסטיקות"],
      color: "var(--color-secondary)"
    },
    {
      icon: <Settings size={32} />,
      title: "מנהל מערכת",
      description: "ניהול מלא של המערכת והמשתמשים",
      features: ["ניהול משתמשים", "סטטיסטיקות מערכת", "הרשאות מתקדמות", "תמיכה טכנית"],
      color: "var(--color-error)"
    }
  ];

  const stats = [
    { icon: <Building2 size={24} />, value: "כרטיסי ביקור", label: "דיגיטליים מקצועיים" },
    { icon: <Search size={24} />, value: "חיפוש", label: "מהיר וחכם" },
    { icon: <Heart size={24} />, value: "מועדפים", label: "ניהול פשוט" },
    { icon: <Shield size={24} />, value: "אבטחה", label: "מתקדמת" }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '4rem',
        padding: '3rem 0',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '1rem'
          }}>
            <Building2 size={40} />
          </div>
        </div>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem', 
          color: 'var(--color-primary)',
          fontWeight: 'bold'
        }}>
          אודות BCard
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--color-text-secondary)',
          maxWidth: 600,
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          פלטפורמה מתקדמת לניהול כרטיסי ביקור עסקיים דיגיטליים. 
          המערכת מאפשרת יצירה, ניהול ושיתוף כרטיסי ביקור מקצועיים בצורה פשוטה ויעילה.
        </p>
      </div>

      {/* Stats Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '4rem'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            backgroundColor: 'var(--color-background)',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ 
              color: 'var(--color-primary)', 
              marginBottom: '0.5rem',
              display: 'flex',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: 'var(--color-primary)',
              marginBottom: '0.5rem'
            }}>
              {stat.value}
            </div>
            <div style={{ 
              color: 'var(--color-text-secondary)',
              fontSize: '0.9rem'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '3rem', 
          color: 'var(--color-primary)',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          תכונות עיקריות
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              padding: '2rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              backgroundColor: 'var(--color-background)',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))'
              }} />
              <div style={{ 
                color: 'var(--color-primary)', 
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ 
                marginBottom: '1rem', 
                color: 'var(--color-text)',
                fontSize: '1.3rem',
                fontWeight: 'bold'
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* User Types Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '3rem', 
          color: 'var(--color-primary)',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          סוגי משתמשים
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem' 
        }}>
          {userTypes.map((userType, index) => (
            <div key={index} style={{
              padding: '2rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              backgroundColor: 'var(--color-background)',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: userType.color
              }} />
              <div style={{ 
                color: userType.color, 
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                {userType.icon}
              </div>
              <h3 style={{ 
                marginBottom: '0.5rem', 
                color: 'var(--color-text)',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                {userType.title}
              </h3>
              <p style={{ 
                marginBottom: '1.5rem', 
                color: 'var(--color-text-secondary)',
                fontSize: '1rem'
              }}>
                {userType.description}
              </p>
              <div style={{ textAlign: 'right' }}>
                {userType.features.map((feature, featureIndex) => (
                  <div key={featureIndex} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    color: 'var(--color-text-secondary)'
                  }}>
                    <CheckCircle size={16} style={{ color: userType.color }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div style={{ 
        padding: '3rem',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius)',
        backgroundColor: 'var(--color-background-secondary)',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          marginBottom: '2rem', 
          color: 'var(--color-primary)',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          טכנולוגיות מתקדמות
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              color: 'var(--color-primary)', 
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Zap size={32} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-text)' }}>ביצועים מהירים</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              טכנולוגיות מתקדמות להבטחת ביצועים מהירים ויעילים
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              color: 'var(--color-primary)', 
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Lock size={32} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-text)' }}>אבטחה מתקדמת</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              הצפנה חזקה ומערכת הרשאות מתקדמת להגנה על הנתונים
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              color: 'var(--color-primary)', 
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <TrendingUp size={32} />
            </div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-text)' }}>סקלביליות</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              ארכיטקטורה מותאמת לגידול ופיתוח עתידי של המערכת
            </p>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            React.js
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            Node.js
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--color-error)',
            color: 'white',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            MongoDB
          </div>
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            JWT
          </div>
        </div>
      </div>
    </div>
  );
} 