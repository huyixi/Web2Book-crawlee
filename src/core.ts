import { PlaywrightCrawler, enqueueLinks } from 'crawlee'
import { Config, configSchema } from './config.js'
import { Page } from 'playwright'

let crawler: PlaywrightCrawler

export function getPageHtml(page: Page, selector = 'body') {
  return page.evaluate((selector) => {
    if (selector.startsWith("/")) {
      const elements = document.evaluate(selector, document, null, XPathResult.ANY_TYPE, null);
      let result = elements.iterateNext();
      return result ? result.textContent || "" : null;
    } else {
      const element = document.querySelector(selector)
      return element ? element.innerHTML : ""
    }
  }, selector)
}

export async function waitForXPath(page: Page, xpath: string, timeout: number) {
  await page.waitForFunction((xpath) => {
    const elements = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
    return elements.iterateNext() !== null;
  }, xpath, { timeout })
}

export async function crawl(config: Config) {
  configSchema.parse(config)
  crawler = new PlaywrightCrawler({
    async requestHandler({ page, request, enqueueLinks, log, pushData }) {
      const title = await page.title()
      log.info(`Requesting ${request.loadedUrl} title: ${title}`)
      if (config.selector) {
        if (config.selector.startsWith("/")) {
          await waitForXPath(page, config.selector, config.waitForSelectorTimeout ?? 1000)
        } else {
          await page.waitForSelector(config.selector, { timeout: config.waitForSelectorTimeout ?? 1000 })
        }
      }
      const html = await getPageHtml(page, config.selector)
      await pushData({ title, url: request.loadedUrl, html })

      await enqueueLinks({
        globs:
          typeof config.match === "string" ? [config.match] : config.match,
        exclude:
          typeof config.exclude === "string"
            ? [config.exclude]
            : config.exclude ?? [],
      });
    }
  })
  await crawler.run([config.url])
}

class CrawlerCore {
  config: Config
  constructor(config: Config) {
    this.config = config
  }
  async crawl() {
    await crawl(this.config)
  }
}

export default CrawlerCore
