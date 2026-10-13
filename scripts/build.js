import { mkdir, rm, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const out = new URL('../dist/', import.meta.url)
await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })
for (const file of ['index.html','styles.css','app.js','buildOptions.js']) {
  await copyFile(new URL(`../${file}`, import.meta.url), new URL(file, out))
}
if (existsSync(new URL('../public/_headers', import.meta.url))) {
  await copyFile(new URL('../public/_headers', import.meta.url), new URL('_headers', out))
}
console.log('Built static Cloudflare bundle → dist/')
