/**
 * index.js
 *
 * Created by sunvisor on 2019-03-23.
 */
const AS = require('./crawler/autosport');

(async () => {

    const crawler = new AS();

    await crawler.openBrowser();
    const year = 2019;
    let result = [];
    for (let month = 1; month <= 12; month++) {
        const url = `https://www.as-web.jp/calendar?cy=${year}&cm=${month}`;
        const cal = await crawler.getMonthCalendar(url, year, month);
        result = result.concat(cal);
    }

    const rows = crawler.toGoogleCalendarCsv(result);
    rows.forEach(row => {
        process.stdout.write(row + "\n");
    });

    setTimeout(() => {
        crawler.closeBrowser();
    }, 1000);
})();
