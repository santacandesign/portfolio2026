function Dashboard({ onOpenRun }) {
  const metrics = [
    { label:'Runs today', value:'1,284', delta:'\u2191 12%' },
    { label:'Auto-resolved', value:'73%', delta:'\u2191 4 pts' },
    { label:'Avg handle time', value:'2m 14s', delta:'\u2193 18s' },
    { label:'Handoffs', value:'142', delta:'\u2193 6%' },
  ];
  const runs = [
    { id:'r-284', workflow:'Tier-1 triage', channel:'Zendesk', actor:'Case #48221', status:'success', dur:'1m 42s', ago:'2m' },
    { id:'r-283', workflow:'Underwriting v3', channel:'Salesforce', actor:'Applicant \u00b7 Riley Chen', status:'pending', dur:'\u2014', ago:'3m' },
    { id:'r-282', workflow:'Renewal outreach', channel:'Outreach', actor:'Acme Corp', status:'success', dur:'3m 08s', ago:'6m' },
    { id:'r-281', workflow:'Tier-1 triage', channel:'Zendesk', actor:'Case #48220', status:'error', dur:'\u2014', ago:'8m' },
    { id:'r-280', workflow:'Analyst research', channel:'Internal', actor:'10-K summary \u00b7 NVDA', status:'success', dur:'5m 21s', ago:'12m' },
  ];
  const statusVariant = { success:'success', pending:'pending', error:'error' };
  const statusLabel   = { success:'Completed', pending:'Running', error:'Needs review' };
  const statusIcon    = { success:'check-circle', pending:'circle-notch', error:'warning' };

  return (
    <div style={{padding:'24px 28px',display:'flex',flexDirection:'column',gap:20}}>
      <div>
        <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:1.2,fontWeight:700,color:'var(--fg3)'}}>Overview</div>
        <div style={{fontSize:30,fontWeight:700,lineHeight:'36px',color:'var(--fg1)',marginTop:4}}>Good morning, Priya</div>
        <div style={{fontSize:14,color:'var(--fg2)'}}>Ema is on track across all active workflows.</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
        {metrics.map(m=>(
          <Card key={m.label} style={{padding:'14px 16px'}}>
            <div style={{fontSize:12,textTransform:'uppercase',letterSpacing:1.2,fontWeight:700,color:'var(--fg3)'}}>{m.label}</div>
            <div style={{fontSize:28,fontWeight:700,color:'var(--fg1)',marginTop:4}}>{m.value}</div>
            <div style={{fontSize:12,color:'var(--green-900)',marginTop:4}}>{m.delta} vs yesterday</div>
          </Card>
        ))}
      </div>

      <Card style={{padding:0,overflow:'hidden'}}>
        <div style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid var(--beige-300)'}}>
          <div style={{fontSize:16,fontWeight:500,color:'var(--fg1)'}}>Recent runs</div>
          <Badge variant="success" size="sm">Live</Badge>
          <div style={{flex:1}}/>
          <Button variant="secondary" color="brand" size="sm" icon="funnel">Filter</Button>
          <Button variant="ghost" color="brand" size="sm" iconRight="arrow-square-out">View all</Button>
        </div>
        <Table>
          <thead>
            <tr>
              <TH style={{width:40}}></TH>
              <TH>Workflow</TH>
              <TH>Subject</TH>
              <TH>Channel</TH>
              <TH>Status</TH>
              <TH style={{textAlign:'right'}}>When</TH>
              <TH style={{width:32}}></TH>
            </tr>
          </thead>
          <tbody>
            {runs.map((r,i)=>(
              <RunRow key={r.id} run={r} onClick={()=>onOpenRun(r)} last={i===runs.length-1}
                      statusVariant={statusVariant} statusLabel={statusLabel} statusIcon={statusIcon}/>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

function RunRow({ run, onClick, last, statusVariant, statusLabel, statusIcon }) {
  const [hover, setHover] = React.useState(false);
  return (
    <tr onClick={onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ background: hover ? 'var(--beige-100)' : 'transparent', cursor:'pointer', transition:'background 150ms' }}>
      <TD style={last?{borderBottom:0}:{}}>
        <StatusDot tone={run.status==='pending'?'pending':run.status==='error'?'error':'success'}/>
      </TD>
      <TD style={last?{borderBottom:0}:{}}>
        <div style={{fontSize:14,fontWeight:500,color:'var(--fg1)'}}>{run.workflow}</div>
        <div style={{fontSize:12,color:'var(--fg3)'}}>{run.id}</div>
      </TD>
      <TD style={{...(last?{borderBottom:0}:{}),fontSize:13,color:'var(--fg2)'}}>{run.actor}</TD>
      <TD style={last?{borderBottom:0}:{}}>
        <Badge variant="default" shape="rounded" size="sm" icon="plug-charging" iconWeight="regular">{run.channel}</Badge>
      </TD>
      <TD style={last?{borderBottom:0}:{}}>
        <Badge variant={statusVariant[run.status]} size="sm" icon={statusIcon[run.status]}>{statusLabel[run.status]}</Badge>
      </TD>
      <TD style={{...(last?{borderBottom:0}:{}),fontSize:12,color:'var(--fg3)',textAlign:'right'}}>{run.ago} ago</TD>
      <TD style={last?{borderBottom:0}:{}}>
        <i className="ph ph-caret-right" style={{fontSize:14,color:'var(--fg3)'}}/>
      </TD>
    </tr>
  );
}

Object.assign(window, { Dashboard, RunRow });
