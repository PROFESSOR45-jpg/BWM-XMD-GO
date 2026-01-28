const axios = require('axios');
const { bwmxmd } = require('../adams/commandHandler');
const s = require(__dirname + "/../config");
const XMD = require('../adams/xmd');

const BOT_NAME = s.BOT || 'BWM XMD';
const getGlobalContextInfo = () => XMD.getContextInfo();
const getContactMsg = (contactName, sender) => XMD.getContactMsg(contactName, sender);

bwmxmd({
  pattern: "movie",
  aliases: ["trailer", "movietrailer", "filmtrailer", "preview", "film"],
  category: "Movie",
  description: "Search for a movie and send its trailer video"
},
async (from, client, conText) => {
  const { q, mek, reply } = conText;

  if (!q) {
    return reply("Usage: .movie <movie name>\nExample: .movie As Good As Dead");
  }

  try {
    const { data: search } = await axios.get(XMD.API.MOVIE.SEARCH(q));

    if (!search.status || !search.result?.results?.length) {
      return reply("No movies found for that query.");
    }

    const movie = search.result.results[0];

    const { data: trailer } = await axios.get(XMD.API.MOVIE.TRAILER(movie.url));

    if (!trailer.status || !trailer.result?.trailerUrl) {
      return reply("Trailer not available.");
    }

    let movieId = '';
    try {
      const { data: movieData } = await axios.get(XMD.API.MOVIE.MOVI_SEARCH(q));
      if (movieData.data?.items?.length) {
        movieId = movieData.data.items[0].id;
      }
    } catch (e) {
      console.error("Movie ID fetch error:", e.message);
    }

    const streamLink = movieId ? XMD.API.MOVIE.STREAM(movieId) : '';
    
    const seasonMatch = movie.title.match(/S(\d+)/i);
    const seasonInfo = seasonMatch ? `\nSeason: ${seasonMatch[1]}` : '';
    
    const typeLabel = movie.type === 'series' ? 'Series' : 'Movie';
    
    let caption = `*${BOT_NAME} - MOVIE TRAILER*\n\n`;
    caption += `Title: ${movie.title}\n`;
    caption += `Rating: ${movie.rating}\n`;
    caption += `Type: ${typeLabel}${seasonInfo}\n\n`;
    caption += `${trailer.result.description}\n\n`;
    if (streamLink) {
      caption += `Stream/Download:\n${streamLink}\n\n`;
    }
    caption += `_For more visit ${XMD.WEB}_`;

    await client.sendMessage(from, {
      video: { url: trailer.result.trailerUrl },
      caption: caption,
      contextInfo: getGlobalContextInfo()
    }, { quoted: mek });

  } catch (err) {
    console.error("Movie error:", err);
    reply("An error occurred while fetching the trailer.");
  }
});
