function Composer({ onSend, onClose }) {
  const [value, setValue] = React.useState('');
  const [messages, setMessages] = React.useState([
    { role:'ema', text:'I can help you build a new workflow. What outcome are we trying to reach?' },
  ]);
  const send = () => {
    if (!value.trim()) return;
    const q = value;
    setMessages(m=>[...m, {role:'user', text:q}]);
    setValue('');
    setTimeout(()=>{
      setMessages(m=>[...m, {role:'ema', text:'Got it. I\'ll draft a policy around "'+q+'" and surface the steps. Review before we deploy.'}]);
    }, 600);
  };
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(35,33,25,.32)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:10}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{width:640,maxHeight:'70%',background:'#fff',borderRadius:'16px 16px 0 0',boxShadow:'0 20px 25px -5px rgba(35,33,25,.12)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'12px 16px',borderBottom:'1px solid var(--beige-300)',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:'var(--purple-800)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><i className="ph ph-magic-wand" style={{fontSize:14}}/></div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700}}>Draft with Ema</div>
            <div style={{fontSize:11,color:'var(--fg3)'}}>Review before sending</div>
          </div>
          <IconButton icon="x" onClick={onClose} title="Close"/>
        </div>
        <div style={{flex:1,padding:16,overflow:'auto',display:'flex',flexDirection:'column',gap:12,minHeight:240}}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:'flex',gap:10,flexDirection: m.role==='user'?'row-reverse':'row'}}>
              {m.role==='ema'
                ? <div style={{width:26,height:26,borderRadius:'50%',background:'var(--purple-100)',color:'var(--purple-800)',display:'flex',alignItems:'center',justifyContent:'center',flex:'0 0 auto'}}><i className="ph ph-magic-wand" style={{fontSize:13}}/></div>
                : <Avatar name="Priya" size={26}/>}
              <div style={{
                maxWidth:'75%',padding:'8px 12px',borderRadius:10,fontSize:14,lineHeight:'20px',
                background: m.role==='user' ? 'var(--green-800)' : 'var(--beige-100)',
                color: m.role==='user' ? '#fff' : 'var(--fg1)',
              }}>{m.text}</div>
            </div>
          ))}
        </div>
        <div style={{padding:12,borderTop:'1px solid var(--beige-300)',display:'flex',gap:8,alignItems:'center'}}>
          <IconButton icon="paperclip" title="Attach"/>
          <input value={value} onChange={e=>setValue(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();send();}}}
            placeholder="Describe a workflow Ema should run…"
            style={{flex:1,border:'1px solid var(--beige-500)',borderRadius:8,padding:'8px 12px',fontFamily:'inherit',fontSize:14,outline:0,background:'#fff'}}/>
          <Button variant="primary" color="aiMagic" icon="paper-plane-tilt" onClick={send}>Send</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Composer });
