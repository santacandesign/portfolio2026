function Sidebar({ collapsed, onToggle, current, onNav }) {
  const nav = [
    { id:'dashboard', icon:'squares-four', label:'Dashboard' },
    { id:'runs',      icon:'flow-arrow',   label:'Runs' },
    { id:'knowledge', icon:'book-open',    label:'Knowledge' },
    { id:'policies',  icon:'shield-check', label:'Policies' },
    { id:'integrations', icon:'plugs-connected', label:'Integrations' },
  ];
  const W = collapsed ? 72 : 240;
  return (
    <aside style={{
      width:W, flex:`0 0 ${W}px`, height:'100%',
      background:'var(--beige-50)', borderRight:'1px solid var(--beige-300)',
      display:'flex', flexDirection:'column',
      transition:'width 200ms cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div style={{height:56,display:'flex',alignItems:'center',justifyContent: collapsed?'center':'space-between', padding: collapsed?'0':'0 16px', borderBottom:'1px solid var(--beige-300)', gap:10}}>
        {collapsed
          ? <img src="../../assets/logo-mark.svg?v=3" width="24" height="24" alt="Ema"/>
          : <img src="../../assets/logo.svg?v=3" height="22" alt="Ema"/>
        }
        {!collapsed && <IconButton icon="sidebar-simple" onClick={onToggle} size="sm" title="Collapse"/>}
      </div>

      <div style={{padding:12,flex:1,overflow:'auto'}}>
        {!collapsed && <div style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:1.2,color:'var(--fg3)',padding:'8px 10px 4px'}}>Workspace</div>}
        {nav.map(n=>{
          const active = current===n.id;
          return (
            <button key={n.id} onClick={()=>onNav(n.id)}
              title={collapsed ? n.label : undefined}
              style={{
                display:'flex',alignItems:'center',gap:12,width:'100%',
                padding: collapsed ? '0' : '8px 10px',
                height: collapsed ? 40 : 'auto',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: active ? 'var(--beige-200)' : 'transparent',
                color: active ? 'var(--fg1)' : 'var(--fg2)',
                border:0, borderRadius:8, cursor:'pointer',
                fontFamily:'inherit', fontSize:14, lineHeight:'20px',
                fontWeight: active?500:400,
                marginBottom:2,
              }}>
              <i className={`ph ph-${n.icon}`} style={{fontSize:18, color: active ? 'var(--green-800)' : 'var(--fg3)'}}/>
              {!collapsed && <span>{n.label}</span>}
              {!collapsed && active && <span style={{marginLeft:'auto',width:6,height:6,borderRadius:'50%',background:'var(--green-800)'}}/>}
            </button>
          );
        })}

        {!collapsed && <div style={{fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:1.2,color:'var(--fg3)',padding:'16px 10px 4px'}}>Recent</div>}
        {!collapsed && ['Tier-1 triage','Underwriting v3','Renewal outreach'].map(r=>(
          <button key={r} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'6px 10px',background:'transparent',border:0,borderRadius:6,cursor:'pointer',fontFamily:'inherit',fontSize:13,color:'var(--fg2)',textAlign:'left'}}>
            <StatusDot tone="success"/>{r}
          </button>
        ))}
      </div>

      <div style={{padding:12,borderTop:'1px solid var(--beige-300)',display:'flex',alignItems:'center',gap:10,justifyContent: collapsed?'center':'flex-start'}}>
        {collapsed ? (
          <IconButton icon="sidebar-simple" onClick={onToggle} size="sm" title="Expand sidebar"/>
        ) : (
          <>
            <Avatar name="Priya Shah" size={32}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:500,color:'var(--fg1)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Priya Shah</div>
              <div style={{fontSize:12,color:'var(--fg3)'}}>Workspace admin</div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

function Navbar({ title, breadcrumbs=[], onNewRun }) {
  return (
    <header style={{
      height:56, flex:'0 0 56px', background:'var(--beige-50)',
      borderBottom:'1px solid var(--beige-300)', display:'flex',
      alignItems:'center', padding:'0 20px', gap:14,
    }}>
      <div style={{display:'flex',alignItems:'center',gap:8,flex:1,minWidth:0}}>
        {breadcrumbs.length>0 && breadcrumbs.map((b,i)=>(
          <React.Fragment key={i}>
            <span style={{fontSize:13,color:'var(--fg2)',whiteSpace:'nowrap'}}>{b}</span>
            {i<breadcrumbs.length-1 && <i className="ph ph-caret-right" style={{fontSize:11,color:'var(--fg3)'}}/>}
          </React.Fragment>
        ))}
        {breadcrumbs.length===0 && <div style={{fontSize:18,fontWeight:500,color:'var(--fg1)'}}>{title}</div>}
      </div>
      <Input icon="magnifying-glass" placeholder="Search runs, policies, people…" style={{width:300}}/>
      <IconButton icon="bell" title="Notifications"/>
      <IconButton icon="question" title="Help"/>
      <Button variant="primary" color="brand" icon="plus" onClick={onNewRun}>Start a run</Button>
    </header>
  );
}

Object.assign(window, { Sidebar, Navbar });
