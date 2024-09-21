import { Bot } from 'grammy'
import { run } from '@grammyjs/runner'
import 'dotenv/config'

const CHAT_ID_TO = process.env.CHAT_ID_TO
const CHAT_ID_FROM = process.env.CHAT_ID_FROM

const bot = new Bot(process.env.TOKEN)

bot.command('chatId', async ctx => {
	await ctx.reply(ctx.message.chat.id);
})

bot.on(['message:text', 'message:photo', 'message:video', 'message:audio', 'message:document'], async (ctx) => {
    const message = ctx.message;

    try {
		console.log(message)

		if (message.caption) {
			await bot.api.sendMessage(CHAT_ID_TO, message.caption);
		}

		if (ctx.chat.id == CHAT_ID_FROM) {
			if (message.text) {
				await bot.api.sendMessage(CHAT_ID_TO, message.text);
			} else if (message.photo) {
				// Отправляем фото
				const fileId = message.photo[message.photo.length - 1].file_id;
				await bot.api.sendPhoto(CHAT_ID_TO, fileId);
			} else if (message.video) {
				// Отправляем видео
				await bot.api.sendVideo(CHAT_ID_TO, message.video.file_id);
			} else if (message.audio) {
				// Отправляем аудио
				await bot.api.sendAudio(CHAT_ID_TO, message.audio.file_id);
			} else if (message.document) {
				// Отправляем документ
				await bot.api.sendDocument(CHAT_ID_TO, message.document.file_id);
			}

			try {
				await ctx.deleteMessage();
			} catch (error) {
				console.error('Ошибка при удалении сообщения:', error);
			}
		}
    } catch (error) {
        console.error('Ошибка при отправке:', error);
    }
});

run(bot)
console.log("Бот запущен!")
