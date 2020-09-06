// ссылка на игру в сети интернет
let url = 'http://siteWithGame.com'

// название игры (то, что указывали в BotFather)
const gameName = "testgame"

// Matches /start
bot.onText(/\/start/, function onPhotoText(msg) {
  bot.sendGame(msg.chat.id, gameName);
});

// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id, { url });
});
