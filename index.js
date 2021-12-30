const {
    Telegraf,
    Markup
} = require('telegraf')
require('dotenv').config()
const text = require('./const')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'таинсвенный незнакомец..'}`))
bot.help((ctx) => ctx.reply(text.commands))

bot.command('alarm', async(ctx) => {
    try {
        await ctx.replyWithHTML('<b>Аларм!</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback("🗺Регион", 'btn_region'), Markup.button.callback("⏰Доступное время", 'btn_time')],
                [Markup.button.callback("Пожертвовать", 'btn_charity')]
            ]
        ))
    } catch (error) {
        console.error(error)
    }
})

function addActionBot(name, src, text) {
    bot.action(name, async (ctx) => {
        try {
            await ctx.answerCbQuery()
            if (src !== false) {
                await ctx.replyWithPhoto({
                    source: src
                })
            }
            await ctx.replyWithHTML(text, {
                // disable_web_page_preview: true
            }) 
        } catch (error) {
            console.error(error)
        }
    })
}

addActionBot('btn_region', './img/1.jpg', text.text1)
addActionBot('btn_time', './img/2.jpg', text.text2)
addActionBot('btn_charity', false, text.text3)

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
