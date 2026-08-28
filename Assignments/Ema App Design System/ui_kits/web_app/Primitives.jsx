// Primitives — aligned to @ema/design-system
// Button: cva matches Button.tsx (xs/sm/md/lg, h-6/7/9/11, r-4/6/6/8, text-*-bold)
// Badge: BADGE_VARIANTS matches variants.ts (pill/rounded \u00d7 8 variants \u00d7 sm/md/lg/xl)
const { useState } = React;

function Button({ children, variant='primary', color='brand', size='md', icon, iconRight, onClick, disabled, block, style={} }) {
  const sizes = {
    xs: { h:24, px:10, r:4, fs:12, lh:16, ig:12 },
    sm: { h:28, px:16, r:6, fs:12, lh:16, ig:14 },
    md: { h:36, px:16, r:6, fs:14, lh:20, ig:16 },
    lg: { h:44, px:16, r:8, fs:16, lh:24, ig:18 },
  };
  const s = sizes[size] || sizes.md;
  // Variant \u00d7 color matrix (primary/secondary/ghost \u00d7 brand/altBrand/aiMagic/destructive)
  const palette = {
    'primary/brand':       { bg:'var(--green-800)', hover:'var(--green-900)', color:'#fff', border:'0' },
    'primary/altBrand':    { bg:'var(--beige-200)', hover:'var(--beige-300)', color:'var(--beige-960)', border:'0' },
    'primary/aiMagic':     { bg:'var(--purple-800)', hover:'var(--purple-900)', color:'#fff', border:'0' },
    'primary/destructive': { bg:'var(--red-100)', hover:'var(--red-200)', color:'var(--red-900)', border:'1px solid var(--red-500)' },
    'secondary/brand':     { bg:'#fff', hover:'var(--beige-50)', color:'var(--fg1)', border:'1px solid var(--beige-500)' },
    'secondary/altBrand':  { bg:'#fff', hover:'var(--beige-100)', color:'var(--beige-960)', border:'1px solid var(--beige-500)' },
    'secondary/aiMagic':   { bg:'#fff', hover:'var(--purple-100)', color:'var(--purple-800)', border:'1px solid var(--purple-500)' },
    'secondary/destructive':{ bg:'#fff', hover:'var(--red-100)', color:'var(--red-900)', border:'1px solid var(--red-500)' },
    'ghost/brand':         { bg:'transparent', hover:'var(--beige-100)', color:'var(--fg1)', border:'0' },
    'ghost/aiMagic':       { bg:'transparent', hover:'var(--purple-100)', color:'var(--purple-800)', border:'0' },
    'ghost/destructive':   { bg:'transparent', hover:'var(--red-100)', color:'var(--red-900)', border:'0' },
  };
  const v = palette[`${variant}/${color}`] || palette['primary/brand'];
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        display: block ? 'flex':'inline-flex', width: block?'100%':'auto',
        alignItems:'center', justifyContent:'center', gap:6,
        height:s.h, padding:`0 ${s.px}px`, borderRadius:s.r,
        fontFamily:'inherit', fontSize:s.fs, lineHeight:`${s.lh}px`, fontWeight:700,
        background: disabled ? 'var(--beige-100)' : (hover ? v.hover : v.bg),
        color: disabled ? 'var(--beige-800)' : v.color,
        border: disabled ? '1px solid var(--beige-300)' : v.border,
        cursor: disabled ? 'not-allowed' : 'pointer',
        whiteSpace:'nowrap',
        transition:'background 150ms cubic-bezier(0.16,1,0.3,1)',
        ...style,
      }}>
      {icon && <i className={`ph ph-${icon}`} style={{fontSize:s.ig}}/>}
      {children}
      {iconRight && <i className={`ph ph-${iconRight}`} style={{fontSize:s.ig}}/>}
    </button>
  );
}

function IconButton({ icon, onClick, active=false, size='md', variant='ghost', color='brand', title }) {
  // icon-only: iconSm=28, icon=36, iconLg=44 per Button cva
  const dims = { sm: 28, md: 36, lg: 44 }[size] || 36;
  const fs   = { sm: 14, md: 16, lg: 20 }[size] || 16;
  const r    = size === 'lg' ? 8 : 6;
  const [hover, setHover] = useState(false);
  const variants = {
    'ghost/brand':   { bg:'transparent', hover:'var(--beige-100)', color:'var(--fg1)', border:'0' },
    'secondary/brand':{ bg:'#fff', hover:'var(--beige-50)', color:'var(--fg1)', border:'1px solid var(--beige-500)' },
    'primary/brand': { bg:'var(--green-800)', hover:'var(--green-900)', color:'#fff', border:'0' },
  };
  const v = variants[`${variant}/${color}`] || variants['ghost/brand'];
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        width:dims, height:dims, borderRadius:r,
        background: active ? 'var(--beige-200)' : (hover ? v.hover : v.bg),
        color: v.color, border: v.border,
        cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center',
        transition:'background 150ms',
      }}>
      <i className={`ph ph-${icon}`} style={{fontSize:fs}}/>
    </button>
  );
}

// Badge matches BADGE_VARIANTS \u2014 hugs content
function Badge({ children, variant='default', size='md', shape='pill', icon, iconWeight='bold' }) {
  const v = {
    default:   { c:'var(--gray-900)',    b:'var(--gray-300)',   g:'var(--gray-50)' },
    success:   { c:'var(--green-800)',   b:'var(--green-500)',  g:'var(--green-200)' },
    error:     { c:'var(--red-800)',     b:'var(--red-500)',    g:'var(--red-200)' },
    info:      { c:'var(--blue-800)',    b:'var(--blue-500)',   g:'var(--blue-200)' },
    warning:   { c:'var(--orange-800)',  b:'var(--orange-500)', g:'var(--orange-200)' },
    pending:   { c:'var(--yellow-930)',  b:'var(--yellow-500)', g:'var(--yellow-200)' },
    unresolved:{ c:'var(--beige-900)',   b:'var(--beige-500)',  g:'var(--beige-200)' },
    AIMagic:   { c:'var(--purple-800)',  b:'var(--purple-500)', g:'var(--purple-200)' },
  }[variant] || {};
  const sizes = {
    sm: { h:20, fs:12, lh:16 },
    md: { h:24, fs:14, lh:20 },
    lg: { h:28, fs:14, lh:20 },
    xl: { h:32, fs:16, lh:24 },
  }[size] || { h:24, fs:14, lh:20 };
  const pill = shape === 'pill';
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      width:'fit-content', maxWidth:'100%',
      height:sizes.h, padding: pill ? '0 8px' : '0 4px',
      borderRadius: pill ? 9999 : 6,
      border:`1px solid ${v.b}`, background:v.g, color:v.c,
      fontSize:sizes.fs, lineHeight:`${sizes.lh}px`, fontWeight:500,
      whiteSpace:'nowrap',
    }}>
      {icon && <i className={`ph-${iconWeight} ph-${icon}`} style={{fontSize:sizes.fs}}/>}
      <span style={{overflow:'hidden',textOverflow:'ellipsis'}}>{children}</span>
    </span>
  );
}

function StatusDot({ tone='success' }) {
  const colors = { success:'var(--green-800)', pending:'var(--yellow-800)', error:'var(--red-800)', idle:'var(--beige-700)', info:'var(--blue-800)', magic:'var(--purple-800)' };
  return <span style={{width:8,height:8,borderRadius:'50%',background:colors[tone],display:'inline-block',flex:'0 0 auto'}}/>;
}

function Avatar({ name='', src, size=28 }) {
  const initials = name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  return (
    <div style={{
      width:size,height:size,borderRadius:'50%',
      background: src ? `center/cover url(${src})` : 'var(--green-800)',
      color:'#fff',display:'inline-flex',alignItems:'center',justifyContent:'center',
      fontSize: Math.round(size*0.38),fontWeight:700,flex:'0 0 auto'
    }}>
      {!src && initials}
    </div>
  );
}

function Card({ children, variant='default', style={} }) {
  const base = { background:'#fff', borderRadius:12 };
  const variants = {
    default: { border:'1px solid var(--beige-300)' },
    folder:  { border:'1px solid var(--beige-300)', borderRadius:8, boxShadow:'0 1px 2px rgba(35,33,25,.06)' },
  };
  return <div style={{...base, ...(variants[variant]||variants.default), ...style}}>{children}</div>;
}

function Input({ value, onChange, placeholder, icon, size='md', state='default', style={} }) {
  const [focus, setFocus] = useState(false);
  const heights = { sm:28, md:36, lg:44 };
  const stateColors = {
    default: { border:'var(--beige-500)', ring:'var(--green-200)', focusBorder:'var(--green-500)' },
    success: { border:'var(--green-500)', ring:'var(--green-200)', focusBorder:'var(--green-500)' },
    error:   { border:'var(--red-500)',   ring:'var(--red-200)',   focusBorder:'var(--red-500)' },
  };
  const sc = stateColors[state];
  return (
    <div style={{
      display:'inline-flex',alignItems:'center',gap:8,
      height:heights[size], padding:'0 14px',
      background:'#fff', border:`1px solid ${focus?sc.focusBorder:sc.border}`,
      borderRadius:8,
      boxShadow: focus ? `0 0 0 3px ${sc.ring}` : 'none',
      transition:'all 150ms', ...style,
    }}>
      {icon && <i className={`ph ph-${icon}`} style={{fontSize:16,color:'var(--fg3)'}}/>}
      <input value={value} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{border:0,outline:0,background:'transparent',fontFamily:'inherit',fontSize:14,lineHeight:'20px',fontWeight:500,color:'var(--fg1)',flex:1,minWidth:0}}/>
    </div>
  );
}

// Table primitives
function Table({ children, style={} }) {
  return <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,fontSize:14,lineHeight:'20px',...style}}>{children}</table>;
}
function TH({ children, style={} }) {
  return <th style={{textAlign:'left',padding:'10px 14px',fontSize:12,fontWeight:700,letterSpacing:.4,textTransform:'uppercase',color:'var(--fg3)',borderBottom:'1px solid var(--beige-300)',background:'var(--beige-50)',...style}}>{children}</th>;
}
function TD({ children, style={} }) {
  return <td style={{padding:'12px 14px',borderBottom:'1px solid var(--beige-200)',color:'var(--fg1)',verticalAlign:'middle',...style}}>{children}</td>;
}

Object.assign(window, { Button, IconButton, Badge, StatusDot, Avatar, Card, Input, Table, TH, TD });
