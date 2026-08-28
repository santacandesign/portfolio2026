function RunDetail({ run, onBack }) {
  const steps = [
    { label:'Intake classified', status:'done', at:'11:42:01', detail:'Billing · Urgent' },
    { label:'Policy matched', status:'done', at:'11:42:03', detail:'Refund policy v4' },
    { label:'Knowledge retrieved', status:'done', at:'11:42:05', detail:'3 passages · Zendesk KB' },
    { label:'Drafted response', status:'done', at:'11:42:09', detail:'Reviewed by 2 guardrails' },
    { label:'Sent to customer', status:'done', at:'11:42:11', detail:'Zendesk #48221' },
  ];
  const transcript = [
    { role:'user', name:'Case #48221', text:'I was charged twice for my April invoice. Can you refund the duplicate?' },
    { role:'ema',  name:'Ema',        text:'Thanks for flagging this, Jordan. I can see two charges on Apr 14 — $129.00 each. Per our refund policy I\'ve initiated a reversal on the duplicate; it should land within 3 business days. I\'ll keep this ticket open until you confirm.' },
    { role:'user', name:'Case #48221', text:'Perfect, thank you!' },
  ];
  return (
    <div style={{padding:'20px 28px 28px',display:'flex',flexDirection:'column',gap:16,overflow:'auto'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <Button variant="ghost" color="brand" size="sm" icon="arrow-left" onClick={onBack}>Back</Button>
        <div style={{flex:1}}/>
        <Button variant="secondary" color="brand" size="sm" icon="arrow-bend-up-right">Handoff</Button>
        <Button variant="secondary" color="brand" size="sm" icon="arrow-clockwise">Re-run</Button>
        <Button variant="primary" color="aiMagic" size="sm" icon="magic-wand">Ask Ema why</Button>
      </div>

      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:44,height:44,borderRadius:10,background:'var(--green-200)',color:'var(--green-900)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <i className="ph ph-flow-arrow" style={{fontSize:22}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:24,fontWeight:500,color:'var(--fg1)',lineHeight:'32px'}}>{run.workflow}</div>
          <div style={{fontSize:13,color:'var(--fg3)',display:'flex',gap:10,alignItems:'center',marginTop:2}}>
            <span>{run.id}</span><span>·</span><span>{run.actor}</span><span>·</span><span>{run.dur||'running'}</span>
          </div>
        </div>
        <Badge variant={run.status==='pending'?'pending':run.status==='error'?'error':'success'} size="md"
               icon={run.status==='pending'?'circle-notch':run.status==='error'?'warning':'check-circle'}>
          {run.status==='pending'?'Running':run.status==='error'?'Needs review':'Completed'}
        </Badge>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.3fr 1fr',gap:16}}>
        <Card style={{padding:0}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid var(--beige-300)',display:'flex',alignItems:'center',gap:8}}>
            <div style={{fontSize:14,fontWeight:700}}>Transcript</div>
            <Badge variant="AIMagic" size="sm" icon="magic-wand">Drafted by Ema</Badge>
          </div>
          <div style={{padding:16,display:'flex',flexDirection:'column',gap:12}}>
            {transcript.map((m,i)=>(
              <div key={i} style={{display:'flex',gap:10}}>
                {m.role==='ema'
                  ? <div style={{width:28,height:28,borderRadius:'50%',background:'var(--purple-800)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flex:'0 0 auto'}}><i className="ph ph-magic-wand" style={{fontSize:14}}/></div>
                  : <Avatar name={m.name} size={28}/>}
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--fg2)'}}>{m.name}</div>
                  <div style={{fontSize:14,color:'var(--fg1)',lineHeight:'20px',marginTop:2}}>{m.text}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{padding:0}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid var(--beige-300)',fontSize:14,fontWeight:700}}>Steps</div>
          <div style={{padding:'8px 0'}}>
            {steps.map((s,i)=>(
              <div key={i} style={{display:'flex',gap:12,padding:'10px 16px',alignItems:'flex-start'}}>
                <div style={{width:20,display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:'var(--green-800)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <i className="ph ph-check" style={{fontSize:12}}/>
                  </div>
                  {i<steps.length-1 && <div style={{flex:1,width:1,background:'var(--beige-400)',minHeight:18,marginTop:2}}/>}
                </div>
                <div style={{flex:1,paddingBottom:i<steps.length-1?8:0}}>
                  <div style={{fontSize:13,fontWeight:500,color:'var(--fg1)'}}>{s.label}</div>
                  <div style={{fontSize:12,color:'var(--fg3)'}}>{s.detail}</div>
                </div>
                <div style={{fontSize:11,color:'var(--fg3)',fontFamily:'var(--font-mono)'}}>{s.at}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { RunDetail });
