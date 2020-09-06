import telebot

token = "1147646527:AAFuN6dgHLIouVHdouQVgNdFU8J3kKFxPOs"
game_url = "https://google.com"

bot = telebot.TeleBot(token, parse_mode=None) # You can set parse_mode by default. HTML or MARKDOWN

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
	bot.reply_to(message, "☼")

@bot.message_handler(func=lambda m: True)
def echo_all(message):
	bot.reply_to(message, message.text)


@bot.inline_handler(func=lambda query: len(query.query) > 0)
def query_text(query):
    print("Query message is text")

@bot.inline_handler(lambda query: query.query == 'text')
def query_text(inline_query):
    print("Query message is text")

@bot.callback_query_handler(func=lambda call: True)
def query_handler(call):
    print(call)
    bot.answer_inline_query(call.id, game_url)


@bot.inline_handler(lambda query: query.query == 'text')
def query_text(inline_query):
    bot.answer_inline_query(inline_query.id, game_url)

bot.polling()
