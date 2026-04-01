import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST() {
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `人生ガチャの結果を1つ生成してください。以下のJSON形式で返してください。
{
  "rarity": 1〜5の数字,
  "job": "職業名",
  "birthplace": "出身地（時代・場所・星など自由に）",
  "era": "時代",
  "comment": "クスッとできる一言コメント（日本語）"
}
rarityが高いほど突拍子もない組み合わせにしてください。rarity5は全体の3%程度にしてください。JSONのみ返してください。`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const json = JSON.parse(text)

    return NextResponse.json(json)
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
