import { telegramBot } from './telegramBot'

export async function listenTelegramCallbacks() {
  await telegramBot.onMessage('Hi', async () => {
    // await telegramBot.sendMessage(message)
  })
}
