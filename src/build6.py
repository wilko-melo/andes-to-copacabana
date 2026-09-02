import json, base64, os, re
geo=json.load(open('sa_paths.json'))
stops_js=open('data_stops.js').read()
ids=re.findall(r'\{id:"(\w+)"',stops_js+open('data_stops_extra.js').read()+open('data_south.js').read())
imgs={k:"data:image/jpeg;base64,"+base64.b64encode(open(f'img/{k}.jpg','rb').read()).decode() for k in ids if os.path.exists(f'img/{k}.jpg')}
missing=[k for k in ids if k not in imgs]
imgt={k[:-4]:"data:image/jpeg;base64,"+base64.b64encode(open("imgt/"+k,"rb").read()).decode() for k in os.listdir("imgt") if k.endswith(".jpg")}
imgm={k[:-4]:"data:image/jpeg;base64,"+base64.b64encode(open("imgm/"+k,"rb").read()).decode() for k in os.listdir("imgm") if k.endswith(".jpg")}
img2={};
for k in os.listdir("img2"):
    if k.endswith(".jpg"):
        sid=k.rsplit("_",1)[0]; img2.setdefault(sid,[]).append("data:image/jpeg;base64,"+base64.b64encode(open("img2/"+k,"rb").read()).decode())
hoods={k[:-4]:"data:image/jpeg;base64,"+base64.b64encode(open('hood/'+k,'rb').read()).decode() for k in os.listdir('hood') if k.endswith('.jpg')}
head=open('t6_head.html').read().replace('__W__',str(geo['W'])).replace('__H__',str(geo['H']))
script="<script>\nconst CREDITS="+open("credits.json").read()+";\nconst IMG="+json.dumps(imgs)+";\nconst HOOD="+json.dumps(hoods)+";\nconst IMG2="+json.dumps(img2)+";\nconst IMGT="+json.dumps(imgt)+";\nconst IMGM="+json.dumps(imgm)+";\nconst GEO="+json.dumps(geo)+";\n"+stops_js+"\n"+open('data_stops_extra.js').read()+"\n"+open('data_climate.js').read()+"\n"+open('data_world.js').read()+"\n"+open('data_events.js').read()+"\n"+open('data_fixes.js').read()+"\n"+open('data_detours.js').read()+"\n"+open('data_south.js').read()+"\n"+open('data_hw.js').read()+"\n"+open('t6_app.js').read()+"\n</script>\n"
out=head+script
open('andes-v6.html','w').write(out)
print(len(out)//1024,'KB; stops',len(ids),'; missing imgs',missing)
# quick syntax check with node if available
