import sys,subprocess,re,os,json,html,time,signal
# usage: python3 headtest.py test.js [screenshot.png] [mobile]
src=open('andes-v6.html').read()
js=open(sys.argv[1]).read()
mobile=len(sys.argv)>3 and sys.argv[3]=="mobile"
harness=f'''<pre id="__test"></pre><script>
window.addEventListener("load",()=>{{setTimeout(async()=>{{let out;try{{out=await (async()=>{{{js}}})();}}catch(e){{out={{ERROR:String(e),stack:String(e.stack).slice(0,600)}};}}
document.getElementById("__test").textContent="@"+"@"+JSON.stringify(out)+"@"+"@";document.title="DONE";}},1200);}});
</script>'''
open('__test.html','w').write(src+harness)
ud="/tmp/hp_"+str(os.getpid())
cmd=["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome","--headless=new","--disable-gpu","--no-sandbox","--hide-scrollbars","--window-size="+("390,844" if mobile else "1440,900"),"--user-data-dir="+ud,"--allow-file-access-from-files","--disable-component-update","--no-first-run","--virtual-time-budget=20000"]
if mobile: cmd.append("--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
shot=sys.argv[2] if len(sys.argv)>2 and sys.argv[2]!="-" else None
if shot and os.path.exists(shot): os.remove(shot)
if shot: cmd.append("--screenshot="+shot)
else: cmd.append("--dump-dom")
cmd.append("file://"+os.path.abspath("__test.html"))
out=open('__hp_out.txt','w');err=open('__hp_err.txt','w')
p=subprocess.Popen(cmd,stdout=out,stderr=err,start_new_session=True)
t0=time.time();res=None
while time.time()-t0<70:
    time.sleep(1)
    if shot and os.path.exists(shot) and os.path.getsize(shot)>1000: time.sleep(1);break
    txt=open('__hp_out.txt').read() if not shot else ""
    m=re.search(r'@@(.*?)@@',txt,re.S)
    if m: res=html.unescape(m.group(1));break
    if p.poll() is not None: break
try: os.killpg(p.pid,signal.SIGKILL)
except Exception: pass
subprocess.run(["rm","-rf",ud])
print(res if res else ("screenshot ok" if shot and os.path.exists(shot) else "NO RESULT\n"+open('__hp_err.txt').read()[-1200:]))
