
const ATOM_RADIUS=.16, CELL_HALF=.46;
function atomOffset(count,index,time=0,motion=true){if(count<=1)return [0,0,0];const angle=index/count*Math.PI*2+(motion?time*.0007:0),radius=Math.min(.265,ATOM_RADIUS*.98/Math.sin(Math.PI/count)),tilt=motion?.38*Math.sin(time*.0014):.18;return [Math.cos(angle)*radius,Math.sin(angle)*radius*Math.sin(tilt),Math.sin(angle)*radius*Math.cos(tilt)]}
function flightProgress(time,start,duration){const k=Math.max(0,Math.min(1,(time-start)/duration));return k*k*(3-2*k)}
class Reactor {
 constructor(n=6,players=2,mode="3d"){if(!["2d","3d"].includes(mode)||!Number.isInteger(n)||n<2||n>10||!Number.isInteger(players)||players<2||players>8)throw Error("Invalid reactor setup");this.n=n;this.players=players;this.mode=mode;this.cells=Array.from({length:mode==="2d"?n*n:n**3},()=>({owner:-1,count:0}));this.turn=0;this.moves=0;this.played=Array(players).fill(false);this.eliminated=Array(players).fill(false);this.winner=null;this.draw=false;}
 index(x,y,z){return this.mode==="2d"?x+this.n*z:x+this.n*(z+this.n*y)}
 coords(i){if(this.mode==="2d")return [i%this.n,0,Math.floor(i/this.n)];return [i%this.n,Math.floor(i/(this.n*this.n)),Math.floor(i/this.n)%this.n]}
 neighbors(i){const [x,y,z]=this.coords(i);return (this.mode==="2d"?[[-1,0,0],[1,0,0],[0,0,1],[0,0,-1]]:[[-1,0,0],[1,0,0],[0,0,1],[0,0,-1],[0,1,0],[0,-1,0]]).map(([a,b,c])=>[x+a,y+b,z+c]).filter(v=>v.every(k=>k>=0&&k<this.n)).map(v=>this.index(...v))}
 criticalMass(i){return this.neighbors(i).length}
 counts(){const a=Array(this.players).fill(0);this.cells.forEach(c=>{if(c.owner>=0)a[c.owner]+=c.count});return a}
 victory(){const a=this.counts();for(let p=0;p<this.players;p++)if(this.played[p]&&a[p]===0)this.eliminated[p]=true;if(!this.played.every(Boolean))return null;const alive=a.map((v,p)=>!this.eliminated[p]&&v>0?p:-1).filter(p=>p>=0);if(alive.length===1)this.winner=alive[0];return this.winner}
 canPlace(i){return Number.isInteger(i)&&i>=0&&i<this.cells.length&&this.winner===null&&!this.draw&&!this.eliminated[this.turn]&&(this.cells[i].owner===-1||this.cells[i].owner===this.turn)}
 begin(i){if(!this.canPlace(i))throw Error('Choose an empty cell or a cell you own.');this.played[this.turn]=true;this.cells[i].count++;this.cells[i].owner=this.turn;this.moves++;return this.turn}
 burst(i,p){const c=this.cells[i],ns=this.neighbors(i);const threshold=this.criticalMass(i);if(c.count<threshold)return null;c.count-=threshold;c.owner=c.count>0?p:-1;return ns}
 *reaction(i,p){let sources=this.cells.map((c,j)=>c.count>=this.criticalMass(j)?j:-1).filter(j=>j>=0),steps=0;const seen=new Set();while(sources.length){const key=this.cells.map(c=>`${c.count}:${c.owner}`).join("|");if(seen.has(key)){const error=new Error("The reaction is repeating and cannot settle.");error.code="REACTION_CYCLE";throw error}seen.add(key);if((steps+=sources.length)>100000)throw Error("This reaction cannot be stabilized safely. The move was restored.");const bursts=sources.map(source=>({source,targets:this.burst(source,p)})),transfers=bursts.flatMap(({source,targets})=>targets.map(target=>({source,target}))),captures=[...new Set(transfers.filter(({target})=>this.cells[target].count>0&&this.cells[target].owner!==p).map(({target})=>target))];yield {type:'wave',bursts,transfers,captures};for(const {target} of transfers){this.cells[target].owner=p;this.cells[target].count++}yield {type:'arrival',captures};sources=this.cells.map((c,j)=>c.count>=this.criticalMass(j)?j:-1).filter(j=>j>=0)}}
 finish(){if(this.victory()!==null)return;do{this.turn=(this.turn+1)%this.players}while(this.eliminated[this.turn]);}
 snapshot(){return JSON.stringify({n:this.n,players:this.players,mode:this.mode,cells:this.cells,turn:this.turn,moves:this.moves,played:this.played,eliminated:this.eliminated,winner:this.winner,draw:this.draw})}
 restore(s){Object.assign(this,JSON.parse(s))}
}

export {Reactor};
