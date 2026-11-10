const { Telegraf } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL;

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "👋 Welcome to Chopper Downloader!\n\nSend me a YouTube video link to get available download formats."
  );
});

bot.help((ctx) => {
  ctx.reply("Just send a YouTube video URL.");
});

bot.on("text", async (ctx) => {
  const url = ctx.message.text.trim();

  if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
    return ctx.reply("❌ Please send a valid YouTube link.");
  }

  try {
    await ctx.reply("⏳ Fetching available formats...");

    const response = await fetch(
      ${API_BASE_URL}/?url=${encodeURIComponent(url)}
    );

    const data = await response.json();

    if (!data.success  !Array.isArray(data.formats)  !data.formats.length) {
      return ctx.reply("❌ No formats found. Please try another link.");
    }

    const buttons = data.formats.map((format) => {
      const downloadUrl = format.url || format.download_url;

      return [{
        text: format.label  format.text  format.quality || "Download",
        url: downloadUrl
      }];
    }).filter((row) => row[0].url && /^https?:\/\//i.test(row[0].url));

    if (!buttons.length) {
      return ctx.reply("❌ Download links are unavailable.");
    }

    await ctx.reply("✅ Select your format:", {
      reply_markup: { inline_keyboard: buttons }
    });

  } catch (error) {
    console.error(error);
    ctx.reply("❌ Something went wrong. Try again later.");
  }
});

bot.launch();
console.log("Chopper Downloader Bot is running!");
