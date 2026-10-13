import { mkdir, rm, copyFile, cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const out = new URL('../dist/', import.meta.url)
await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })
for (const file of ['index.html','styles.css','app.js','buildOptions.js']) {
  await copyFile(new URL(`../${file}`, import.meta.url), new URL(file, out))
}
const publicDir = new URL('../public/', import.meta.url)
if (existsSync(publicDir)) await cp(publicDir, out, { recursive: true })
console.log('Built static Cloudflare bundle → dist/')
