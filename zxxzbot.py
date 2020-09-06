import telebot
from flask import Flask, request
import os

token = "1147646527:AAFuN6dgHLIouVHdouQVgNdFU8J3kKFxPOs"
game_url = "https://anzxfukuoka.github.io/"

server = Flask(__name__)

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


@server.route('/' + token, methods=['POST'])
def getMessage():
    bot.process_new_updates([telebot.types.Update.de_json(request.stream.read().decode("utf-8"))])
    return "!", 200


@server.route("/")
def webhook():
    bot.remove_webhook()
    bot.set_webhook(url='https://zxxzzxxz.herokuapp.com/' + token)
    return "!", 200


if __name__ == "__main__":
    server.run(host="0.0.0.0", port=int(os.environ.get('PORT', 5000)))
    pass

#bot.polling()
