import {program} from "commander"
import { Config } from './config.js'

const messages = {
  url: 'Enter the URL of the page you want to scrape',
  match: 'Enter the URL pattern you want to match',
  selector: 'Enter the CSS selector you want to match',
  outputFileType: 'Enter the output file type',
}

async function handler(options: Config) {
  console.log(options)
}

program
  .option('-u, --url <url>', messages.url)
  .option('-m, --match <match>', messages.match)
  .option('-s, --selector <selector>', messages.selector)
  .option('-o, --outputFileType <outputFileType>', messages.outputFileType)
  .action(handler)

program.parse()
