import telebot

token = "1147646527:AAFuN6dgHLIouVHdouQVgNdFU8J3kKFxPOs"
game_url = "https://anzxfukuoka.github.io/"

bot = telebot.TeleBot(token)

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
	bot.reply_to(message, "☼")

@bot.message_handler(func=lambda m: True)
def echo_all(message):
	bot.reply_to(message, message.text)

@bot.callback_query_handler(func=lambda call: True)
def query_handler(call):
    print(call)
    bot.answer_callback_query(callback_query_id=call.id, url=game_url)


bot.polling()
