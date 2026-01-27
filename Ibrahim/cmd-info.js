
/*const { bwmxmd } = require('../adams/commandHandler');
const axios = require('axios');

bwmxmd({
  pattern: "getcmd",
  aliases: ["get", "plugin"],
  description: "Fetch a command snippet from the remote repository",
  category: "owner",
  filename: __filename
}, async (from, client, conText) => {
  const { q, reply, isSuperUser } = conText;

  if (!isSuperUser) {
    return reply("❌ You are not authorized to use this command.");
  }

  if (!q) {
    return reply("⚠️ Provide the name of the command.\n\nExample: getcmd block");
  }

  try {
    const apiUrl = XMD.GITHUB_REMOTE_CMDS;
    const response = await axios.get(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const files = response.data.filter(item =>
      item.type === 'file' && item.name.endsWith('.js')
    );

    for (const file of files) {
      const fileResponse = await axios.get(file.download_url);
      const content = fileResponse.data;

      const regex = new RegExp(`keith\\s*\\(\\s*{[^}]*pattern\\s*:\\s*["'\`]${q}["'\`]`, 'i');
      if (regex.test(content)) {
        const startIndex = content.search(regex);
        const snippet = content.slice(startIndex);
        const nextBlock = snippet.indexOf('keith(', 1);
        const endIndex = nextBlock !== -1 ? startIndex + nextBlock : content.length;
        const commandCode = content.slice(startIndex, endIndex).trim();

        return reply(`// From ${file.name}\n\n${commandCode}`);
      }
    }

    reply(`❌ Command *${q}* not found in the repository.`);
  } catch (err) {
    console.error("getcmd error:", err);
    reply("❌ Failed to fetch commands from the repository.");
  }
});*/
//========================================================================================================================
//getcmd obfu
const _0x2f8ac4=_0x2846;function _0x299a(){const _0x2b5167=['❌\x20Command\x20*','file','trim','name','6616464alteUR','endsWith','download_url','625491sMBgQV','❌\x20You\x20are\x20not\x20authorized\x20to\x20use\x20this\x20command.','slice','6615525gcyhJL','get','⚠️\x20Provide\x20the\x20name\x20of\x20the\x20command.\x0a\x0aExample:\x20getcmd\x20block','//\x20From\x20','keith\x5cs*\x5c(\x5cs*{[^}]*pattern\x5cs*:\x5cs*[\x22\x27`]','filter','data','https://api.github.com/repos/keithghost/REMOTE/contents/Cmds','5222545lBDvuS','../adams/commandHandler','3080244tkqYqy','221030Yeuslv','*\x20not\x20found\x20in\x20the\x20repository.','owner','getcmd','3YgIHqd','plugin','error','type','Fetch\x20a\x20command\x20snippet\x20from\x20the\x20remote\x20repository','Mozilla/5.0','13004528cQmujg','axios','getcmd\x20error:'];_0x299a=function(){return _0x2b5167;};return _0x299a();}(function(_0x10bfde,_0x109795){const _0x12df32=_0x2846,_0x197dc5=_0x10bfde();while(!![]){try{const _0x259b0a=-parseInt(_0x12df32(0x123))/0x1*(parseInt(_0x12df32(0x11f))/0x2)+parseInt(_0x12df32(0x133))/0x3+-parseInt(_0x12df32(0x11e))/0x4+parseInt(_0x12df32(0x11c))/0x5+parseInt(_0x12df32(0x130))/0x6+parseInt(_0x12df32(0x136))/0x7+-parseInt(_0x12df32(0x129))/0x8;if(_0x259b0a===_0x109795)break;else _0x197dc5['push'](_0x197dc5['shift']());}catch(_0x15311a){_0x197dc5['push'](_0x197dc5['shift']());}}}(_0x299a,0x8c0d5));function _0x2846(_0x471f83,_0x5f0198){const _0x299afa=_0x299a();return _0x2846=function(_0x2846a8,_0x3e7097){_0x2846a8=_0x2846a8-0x118;let _0x5ad9a5=_0x299afa[_0x2846a8];return _0x5ad9a5;},_0x2846(_0x471f83,_0x5f0198);}const {bwmxmd}=require(_0x2f8ac4(0x11d)),axios=require(_0x2f8ac4(0x12a));bwmxmd({'pattern':_0x2f8ac4(0x122),'aliases':['get',_0x2f8ac4(0x124)],'description':_0x2f8ac4(0x127),'category':_0x2f8ac4(0x121),'filename':__filename},async(_0x46fe36,_0x28f956,_0x462d94)=>{const _0x562813=_0x2f8ac4,{q:_0x13f2f7,reply:_0x31167f,isSuperUser:_0x4be699}=_0x462d94;if(!_0x4be699)return _0x31167f(_0x562813(0x134));if(!_0x13f2f7)return _0x31167f(_0x562813(0x138));try{const _0x4745d3=_0x562813(0x11b),_0x32f906=await axios[_0x562813(0x137)](_0x4745d3,{'headers':{'User-Agent':_0x562813(0x128)}}),_0x51ee96=_0x32f906[_0x562813(0x11a)][_0x562813(0x119)](_0x542ce4=>_0x542ce4[_0x562813(0x126)]===_0x562813(0x12d)&&_0x542ce4[_0x562813(0x12f)][_0x562813(0x131)]('.js'));for(const _0x3aa012 of _0x51ee96){const _0x1cf10d=await axios[_0x562813(0x137)](_0x3aa012[_0x562813(0x132)]),_0x17811c=_0x1cf10d[_0x562813(0x11a)],_0x4b7f8a=new RegExp(_0x562813(0x118)+_0x13f2f7+'[\x22\x27`]','i');if(_0x4b7f8a['test'](_0x17811c)){const _0x49c6b5=_0x17811c['search'](_0x4b7f8a),_0x136b57=_0x17811c[_0x562813(0x135)](_0x49c6b5),_0x970269=_0x136b57['indexOf']('keith(',0x1),_0x56e527=_0x970269!==-0x1?_0x49c6b5+_0x970269:_0x17811c['length'],_0xe6100c=_0x17811c[_0x562813(0x135)](_0x49c6b5,_0x56e527)[_0x562813(0x12e)]();return _0x31167f(_0x562813(0x139)+_0x3aa012['name']+'\x0a\x0a'+_0xe6100c);}}_0x31167f(_0x562813(0x12c)+_0x13f2f7+_0x562813(0x120));}catch(_0x13a829){console[_0x562813(0x125)](_0x562813(0x12b),_0x13a829),_0x31167f('❌\x20Failed\x20to\x20fetch\x20commands\x20from\x20the\x20repository.');}});
