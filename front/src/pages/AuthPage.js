import React, { useState, useEffect } from 'react';

/* ══════════════════════════════════════════════
   BANDEIRINHAS
══════════════════════════════════════════════ */
const FLAG_COLORS = [
  '#EF4444','#F59E0B','#10B981','#3B82F6','#E97125',
  '#8B5CF6','#EC4899','#EF4444','#FACC15','#14B8A6',
  '#F97316','#6366F1','#EF4444','#22C55E',
];

function FlagString({ y = 0, colors }) {
  const n = colors.length;
  const spacing = 44;
  return (
    <g>
      <path
        d={`M0 ${y+8} Q${n*spacing*0.25} ${y+24} ${n*spacing*0.5} ${y+10} Q${n*spacing*0.75} ${y-4} ${n*spacing} ${y+14}`}
        stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none"
      />
      {colors.map((color, i) => {
        const bx = i * spacing + 8;
        const by = y + 4 + Math.sin((i / n) * Math.PI * 1.5) * 10;
        return (
          <g key={i} style={{
            transformOrigin: `${bx + 10}px ${by}px`,
            animation: `flag${i % 3} ${2 + (i % 4) * 0.35}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.12}s`,
          }}>
            <polygon points={`${bx},${by} ${bx+20},${by} ${bx+10},${by+28}`} fill={color}/>
            <polygon points={`${bx},${by} ${bx+10},${by} ${bx+5},${by+14}`} fill="rgba(255,255,255,0.25)"/>
          </g>
        );
      })}
    </g>
  );
}

/* ══════════════════════════════════════════════
   LANTERNA
══════════════════════════════════════════════ */
function Lantern({ color1, color2, glowColor, size = 1, delay = 0 }) {
  const w = 40 * size, h = 58 * size;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
      animation:'lanternSwing 3.5s ease-in-out infinite', animationDelay:`${delay}s` }}>
      <div style={{ width:2, height:30*size, background:'rgba(255,255,255,0.35)' }}/>
      <svg viewBox="0 0 44 68" style={{ width:w, height:h, filter:`drop-shadow(0 0 16px ${glowColor})` }}>
        <ellipse cx="22" cy="10" rx="12" ry="7" fill={color2}/>
        <path d="M10 10 Q7 31 10 52 Q22 60 34 52 Q37 31 34 10 Z" fill={color1}/>
        <path d="M12 10 Q10 31 12 52" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none"/>
        <path d="M22 10 L22 52" stroke="rgba(0,0,0,0.08)" strokeWidth="1" fill="none"/>
        <path d="M32 10 Q34 31 32 52" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none"/>
        <ellipse cx="22" cy="52" rx="12" ry="7" fill={color2}/>
        <line x1="22" y1="59" x2="22" y2="64" stroke={color2} strokeWidth="2"/>
        <circle cx="22" cy="66" r="3.5" fill="#FBBF24" style={{animation:'glowBob 1.8s ease-in-out infinite'}}/>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FOGUETE
══════════════════════════════════════════════ */
function Rocket({ delay = 0, left }) {
  return (
    <div style={{
      position:'absolute', left, bottom:-90, zIndex:3,
      animation:'rocketUp 7s ease-in-out infinite',
      animationDelay:`${delay}s`,
    }}>
      <svg viewBox="0 0 28 70" style={{width:20,height:52}}>
        <ellipse cx="14" cy="18" rx="9" ry="14" fill="#EF4444"/>
        <rect x="7" y="20" width="14" height="24" rx="3" fill="#F97316"/>
        <polygon points="3,44 14,34 25,44" fill="#EF4444"/>
        <polygon points="1,28 7,22 7,40" fill="#F97316"/>
        <polygon points="27,28 21,22 21,40" fill="#F97316"/>
        <ellipse cx="14" cy="20" rx="5.5" ry="7" fill="#FDE68A" opacity="0.65"/>
      </svg>
      <div style={{width:5,height:36,margin:'0 auto',marginTop:-4,
        background:'linear-gradient(#FACC15,#F97316 60%,transparent)',
        borderRadius:4,filter:'blur(1px)'}}/>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PASSWORD STRENGTH
══════════════════════════════════════════════ */
function PasswordStrength({ senha }) {
  const score = [/.{8,}/,/[A-Z]/,/[0-9]/,/[^A-Za-z0-9]/].filter(r=>r.test(senha)).length;
  if (!senha) return null;
  const levels = [
    {label:'Fraca',color:'#dc2626'},{label:'Razoável',color:'#d97706'},
    {label:'Boa',color:'#15956d'},{label:'Forte',color:'#0f6e56'},
  ];
  const level = levels[Math.max(0,Math.min(score-1,3))];
  return (
    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:7}}>
      <div style={{flex:1,height:5,borderRadius:999,background:'#e2e8f0',overflow:'hidden'}}>
        <div style={{width:`${(score/4)*100}%`,height:'100%',borderRadius:'inherit',
          background:level.color,transition:'width .25s ease'}}/>
      </div>
      <span style={{minWidth:54,fontSize:11,fontWeight:900,textAlign:'right',color:level.color}}>{level.label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   INPUT STYLE
══════════════════════════════════════════════ */
const INPUT_STYLE = {
  width:'100%', minHeight:50, padding:'12px 14px',
  border:'1.5px solid #e2e8f0', borderRadius:14, outline:'none',
  background:'#fff', color:'#111827', fontWeight:600, fontSize:15,
  boxSizing:'border-box', fontFamily:'inherit',
  transition:'border-color .18s ease, box-shadow .18s ease',
};

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function AuthPage({ onLoginSuccess }) {
  const [modo, setModo] = useState('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVis, setSenhaVis] = useState(false);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('error');
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [eventoId, setEventoId] = useState('');

  const setMsg = (msg, type='error') => { setStatus(msg); setStatusType(type); };

  useEffect(() => {
    const loadEventos = async () => {
      try {
        const { get } = await import('../utils/api.js');
        const data = await get('/eventos', null);
        setEventos(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0 && !eventoId) {
          setEventoId(data[0].id);
        }
      } catch (err) {
        console.error('Falha ao carregar eventos publicos:', err);
      }
    };
    loadEventos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    if (modo==='register' && !nome.trim()) return setMsg('Informe seu nome completo.');
    if (!email.trim() || !senha) return setMsg('Preencha e-mail e senha.');
    if (modo==='register' && senha.length < 6) return setMsg('Senha precisa ter pelo menos 6 caracteres.');
    if (modo==='register' && !eventoId) return setMsg('Selecione o evento que voce vai participar.');
    setLoading(true);
    try {
      const { post } = await import('../utils/api.js');
      if (modo==='register') {
        await post('/auth/registrar', null, { nome, email, senha, tipo:'participante', evento_id: eventoId || null });
        setMsg('Conta criada. Entrando...', 'info');
      }
      const data = await post('/auth/login', null, { email, senha });
      if (!data?.user) throw new Error('Resposta inválida do servidor.');
      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight:'100dvh',
      background:'linear-gradient(170deg, #1a0533 0%, #2d0f52 18%, #0f2044 42%, #0a2e1a 72%, #061a10 100%)',
      display:'flex', flexDirection:'column',
      overflow:'hidden', position:'relative',
    }}>
      <style>{`
        @keyframes twinkle    { 0%,100%{opacity:.12} 50%{opacity:.95} }
        @keyframes rocketUp   { 0%,38%{transform:translateY(0);opacity:0} 52%{opacity:1} 100%{transform:translateY(-115vh);opacity:0} }
        @keyframes lanternSwing { 0%,100%{transform:rotate(-9deg)} 50%{transform:rotate(9deg)} }
        @keyframes glowPulse  { 0%,100%{opacity:.65} 50%{opacity:1} }
        @keyframes glowBob    { 0%,100%{r:3.5;opacity:.65} 50%{r:5;opacity:1} }
        @keyframes flag0 { from{transform:rotate(-4deg)} to{transform:rotate(4deg)} }
        @keyframes flag1 { from{transform:rotate(-3deg) translateY(0)} to{transform:rotate(5deg) translateY(5px)} }
        @keyframes flag2 { from{transform:rotate(3deg)} to{transform:rotate(-4deg) translateY(4px)} }
        @keyframes charFloat  { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-12px) rotate(1.5deg)} }
      `}</style>

      {/* ── Estrelas ── */}
      {[...Array(55)].map((_,i) => (
        <div key={i} aria-hidden="true" style={{
          position:'absolute',
          width:i%7===0?4:i%3===0?3:2, height:i%7===0?4:i%3===0?3:2,
          borderRadius:'50%',
          background:i%5===0?'#FDE68A':'#fff',
          left:`${(i*41+7)%100}%`, top:`${(i*29+5)%65}%`,
          animation:`twinkle ${1.2+(i%5)*0.5}s ease-in-out infinite`,
          animationDelay:`${(i*0.19)%3.5}s`,
          boxShadow:i%7===0?'0 0 6px #FDE68A':'none',
        }}/>
      ))}

      {/* ── Foguetes ── */}
      <Rocket delay={0.6} left="8%"/>
      <Rocket delay={3.2} left="30%"/>
      <Rocket delay={5.5} left="88%"/>

      {/* ── Bandeirinhas ── */}
      <div style={{position:'absolute',top:0,left:-10,right:-10,zIndex:6,pointerEvents:'none'}}>
        <svg viewBox="0 0 700 62" style={{width:'100%',height:62,overflow:'visible'}}>
          <FlagString y={4} colors={FLAG_COLORS}/>
        </svg>
        <div style={{marginTop:-18,opacity:0.55}}>
          <svg viewBox="0 0 700 52" style={{width:'100%',height:52,overflow:'visible'}}>
            <FlagString y={8} colors={[...FLAG_COLORS].reverse().slice(0,10)}/>
          </svg>
        </div>
      </div>

      {/* ── Lanternas ── */}
      <div aria-hidden="true" style={{position:'absolute',top:56,left:'6%',zIndex:5}}>
        <Lantern color1="#E97125" color2="#B25100" glowColor="rgba(233,113,37,0.7)" size={1.1} delay={0}/>
      </div>
      <div aria-hidden="true" style={{position:'absolute',top:62,left:'22%',zIndex:5}}>
        <Lantern color1="#8B5CF6" color2="#5B21B6" glowColor="rgba(139,92,246,0.6)" size={0.85} delay={0.8}/>
      </div>
      <div aria-hidden="true" style={{position:'absolute',top:52,right:'8%',zIndex:5}}>
        <Lantern color1="#15956D" color2="#0A5C3A" glowColor="rgba(21,149,109,0.7)" size={1} delay={1.4}/>
      </div>
      <div aria-hidden="true" style={{position:'absolute',top:68,right:'24%',zIndex:5}}>
        <Lantern color1="#EF4444" color2="#991B1B" glowColor="rgba(239,68,68,0.6)" size={0.8} delay={2.1}/>
      </div>

      {/* ══════════════════════════════════════════
          CONTEÚDO PRINCIPAL
      ══════════════════════════════════════════ */}
      <div style={{
        flex:1,
        display:'grid',
        gridTemplateColumns:'minmax(0,1.25fr) minmax(380px,0.75fr)',
        gap:'clamp(16px,3vw,56px)',
        padding:'clamp(16px,3vw,52px)',
        paddingTop:'clamp(100px,11vw,136px)',
        position:'relative', zIndex:10,
        maxWidth:1300, margin:'0 auto', width:'100%',
        alignItems:'center',
      }}>

        {/* ── LADO ESQUERDO: título + personagem ── */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>

          {/* Badge */}
          <div style={{
            display:'inline-flex',alignItems:'center',gap:8,
            padding:'8px 18px',borderRadius:999,
            background:'rgba(233,113,37,0.18)',
            border:'1px solid rgba(233,113,37,0.38)',
            color:'#FBBF80',
            fontSize:12,fontWeight:900,letterSpacing:'0.07em',textTransform:'uppercase',
            marginBottom:20,
          }}>
            <span style={{width:8,height:8,borderRadius:'50%',background:'#E97125',animation:'glowPulse 1.5s infinite'}}/>
            São João organizado, bonito e pronto
          </div>

          {/* Título + personagem lado a lado */}
          <div style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            gap:0,
            width:'100%',
          }}>
            {/* Título */}
            <h1 style={{
              margin:0,
              fontFamily:"'Manrope','Georgia',serif",
              fontSize:'clamp(72px,10vw,128px)',
              lineHeight:0.86,
              fontWeight:800,
              letterSpacing:'-3px',
              textAlign:'right',
              background:'linear-gradient(140deg, #FDE68A 0%, #F97316 35%, #FACC15 65%, #FEF3C7 100%)',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
              backgroundClip:'text',
              flexShrink:0,
            }}>
              Arraia<br/>Show
            </h1>

            {/* Personagem */}
            <div style={{
              flexShrink:0,
              width:'clamp(200px, 28vw, 340px)',
              animation:'charFloat 3s ease-in-out infinite',
              transformOrigin:'bottom center',
              /* leve sobreposição visual com o título */
              marginLeft:'-clamp(10px,2vw,24px)',
              filter:'drop-shadow(0 18px 40px rgba(0,0,0,0.5))',
            }}>
              <img
                src="/src/uploads/festa.png"
              
                style={{
                  width:'100%',
                  height:'auto',
                  display:'block',
                  objectFit:'contain',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── LADO DIREITO: FORMULÁRIO ── */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{
            width:'100%', maxWidth:460,
            borderRadius:24,
            background:'rgba(255,255,255,0.97)',
            backdropFilter:'blur(28px)',
            border:'1px solid rgba(255,255,255,0.55)',
            boxShadow:'0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)',
            padding:'clamp(26px,4vw,40px)',
          }}>
            {/* Header card */}
            <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:24}}>
              <div style={{
                width:52,height:52,borderRadius:16,
                background:'linear-gradient(135deg,#E97125,#B25100)',
                color:'#fff',display:'grid',placeItems:'center',fontSize:24,
                boxShadow:'0 8px 20px rgba(233,113,37,0.35)',
              }}>🎪</div>
              <div>
                <h2 style={{margin:0,fontFamily:"'Manrope',Arial,sans-serif",fontSize:24,fontWeight:800,color:'#111827',lineHeight:1.1}}>
                  {modo==='login'?'Entrar na festa':'Criar conta'}
                </h2>
                <p style={{margin:'4px 0 0',color:'#64748b',fontSize:13,fontWeight:600}}>
                  {modo==='login'?'Acesse sua área do Arraia Show.':'Crie seu acesso para participar.'}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,padding:6,
              border:'1.5px solid #f1f5f9',borderRadius:16,
              background:'#f8fafc',marginBottom:26,
            }}>
              {[['login','Entrar'],['register','Criar conta']].map(([item,label])=>(
                <button key={item} type="button"
                  onClick={()=>{setModo(item);setStatus('');}}
                  style={{
                    minHeight:46,borderRadius:12,border:0,cursor:'pointer',
                    background:modo===item?'#111827':'transparent',
                    color:modo===item?'#fff':'#64748b',
                    fontWeight:900,fontSize:14,
                    boxShadow:modo===item?'0 6px 18px rgba(17,24,39,0.22)':'none',
                    transition:'all .2s ease',
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Campos */}
            <form onSubmit={handleSubmit} noValidate>
              {modo==='register' && (
                <div style={{marginBottom:16}}>
                  <label style={{display:'block',marginBottom:7,color:'#64748b',fontSize:12,fontWeight:800,letterSpacing:'0.04em'}}>
                    NOME COMPLETO
                  </label>
                  <input value={nome} onChange={e=>setNome(e.target.value)}
                    placeholder="Ex: Maria Silva" autoComplete="name" autoFocus
                    style={INPUT_STYLE}
                    onFocus={e=>{e.target.style.borderColor='#E97125';e.target.style.boxShadow='0 0 0 4px rgba(233,113,37,0.14)';}}
                    onBlur={e=>{e.target.style.borderColor='#e2e8f0';e.target.style.boxShadow='none';}}/>
                </div>
              )}
              <div style={{marginBottom:16}}>
                <label style={{display:'block',marginBottom:7,color:'#64748b',fontSize:12,fontWeight:800,letterSpacing:'0.04em'}}>
                  E-MAIL
                </label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="seu@email.com" autoComplete="email"
                  autoFocus={modo==='login'}
                  style={INPUT_STYLE}
                  onFocus={e=>{e.target.style.borderColor='#E97125';e.target.style.boxShadow='0 0 0 4px rgba(233,113,37,0.14)';}}
                  onBlur={e=>{e.target.style.borderColor='#e2e8f0';e.target.style.boxShadow='none';}}/>
              </div>
              {modo==='register' && (
                <div style={{marginBottom:16}}>
                  <label style={{display:'block',marginBottom:7,color:'#64748b',fontSize:12,fontWeight:800,letterSpacing:'0.04em'}}>
                    EVENTO
                  </label>
                  <select value={eventoId} onChange={e=>setEventoId(e.target.value)} style={{...INPUT_STYLE, appearance:'none'}}>
                    {eventos.length === 0 ? (
                      <option value="">Carregando eventos...</option>
                    ) : (
                      eventos.map((evento) => (
                        <option key={evento.id} value={evento.id}>{evento.nome}</option>
                      ))
                    )}
                  </select>
                </div>
              )}
              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:7,color:'#64748b',fontSize:12,fontWeight:800,letterSpacing:'0.04em'}}>
                  SENHA
                </label>
                <div style={{position:'relative'}}>
                  <input type={senhaVis?'text':'password'} value={senha}
                    onChange={e=>setSenha(e.target.value)}
                    placeholder={modo==='login'?'Sua senha':'Mínimo 6 caracteres'}
                    autoComplete={modo==='login'?'current-password':'new-password'}
                    style={{...INPUT_STYLE,paddingRight:62}}
                    onFocus={e=>{e.target.style.borderColor='#E97125';e.target.style.boxShadow='0 0 0 4px rgba(233,113,37,0.14)';}}
                    onBlur={e=>{e.target.style.borderColor='#e2e8f0';e.target.style.boxShadow='none';}}/>
                  <button type="button" onClick={()=>setSenhaVis(v=>!v)}
                    style={{
                      position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',
                      minWidth:48,minHeight:36,border:0,borderRadius:10,
                      background:'#f1f5f9',color:'#64748b',fontSize:11,fontWeight:900,cursor:'pointer',
                    }}>
                    {senhaVis?'Ocultar':'Ver'}
                  </button>
                </div>
                {modo==='register' && <PasswordStrength senha={senha}/>}
              </div>

              <button type="submit" disabled={loading}
                onMouseEnter={e=>{if(!loading){e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 18px 40px rgba(233,113,37,0.45)';}}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 12px 32px rgba(233,113,37,0.38)';}}
                style={{
                  width:'100%',minHeight:52,border:0,borderRadius:14,
                  background:loading?'#94a3b8':'linear-gradient(135deg, #E97125 0%, #B25100 48%, #15956D 100%)',
                  color:'#fff',fontWeight:900,fontSize:16,
                  cursor:loading?'not-allowed':'pointer',
                  boxShadow:loading?'none':'0 12px 32px rgba(233,113,37,0.38)',
                  transition:'all .2s ease',
                  display:'flex',alignItems:'center',justifyContent:'center',gap:10,
                  letterSpacing:'0.02em',
                }}>
                {loading
                  ?(modo==='login'?'Entrando...':'Criando conta...')
                  :(modo==='login'?'🎉 Entrar na festa':'🎪 Criar minha conta')}
              </button>
            </form>

            {status && (
              <div style={{
                marginTop:16,padding:'13px 16px',borderRadius:14,
                background:statusType==='info'?'#f0fdf4':'#fff7ed',
                border:`1px solid ${statusType==='info'?'#bbf7d0':'#fed7aa'}`,
                color:statusType==='info'?'#166534':'#9a3412',
                fontSize:13,fontWeight:800,
              }}>
                {status}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gradiente de chão */}
      <div aria-hidden="true" style={{
        position:'absolute',bottom:0,left:0,right:0,height:80,
        background:'linear-gradient(0deg,rgba(6,26,16,0.95),transparent)',
        zIndex:8,pointerEvents:'none',
      }}/>
    </main>
  );
}