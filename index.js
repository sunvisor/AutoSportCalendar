/**
 * index.js
 *
 * Created by sunvisor on 2019-03-23.
 */
const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({
        headless: true
    });

    async function getMonthCalendar(year, month) {
        const page = await browser.newPage();
        await page.goto(`https://www.as-web.jp/calendar?cy=${year}&cm=${month}`);
        const table = await page.$('div.tableArea table');
        const trs = await table.$$('tr');
        let day;
        let records = [];
        for (let i = 0; i < trs.length; i++) {
            const tr = trs[i];
            let day = null;
            const tds = await tr.$$('td').catch();
            if (tds.length === 0) continue;
            const daysEl = await tds[0].$('span.date').catch();
            if (daysEl) {
                const daysCont = await daysEl.getProperty('textContent');
                day = await daysCont.jsonValue();
                const d = ('00' + day).slice(-2);
                const m = ('00' + month).slice(-2);
                // day = `${year}-${m}-${d}`
                day = `${m}/${d}/${year}`
            }
            const eventEls = await tds[1].$$('.event');
            let events = [];
            for (let e = 0; e < eventEls.length; e++) {
                const eventEl = eventEls[e];
                const eventCont = await eventEl.getProperty('textContent');
                const event = await eventCont.jsonValue();
                events.push(event)
            }
            if (day && events.length) {
                records.push({
                    day,
                    events
                });
            }
        }
        return records;
    }

    function googleCalendarHeader() {
        return [
            'Subject',
            'Start Date',
            'Start Time',
            'End Date',
            'End Time',
            'All Day Event',
            'Description',
            'Location',
            'Private',
        ];
    }

    function toGoogleCalendarCsv(data) {
        let result = [];

        result.push(googleCalendarHeader());
        data.forEach(datum => {
            datum.events.forEach(event => {
                result.push([
                    event,
                    datum.day,
                    '',
                    datum.day,
                    '',
                    'True',
                    'motor sports',
                    '',
                    'False'
                ]);
            });
        });

        return result;
    }

    const year = 2019;
    let result = [];
    for (let month = 1; month < 13; month++) {
        const cal = await getMonthCalendar(year, month);
        result = result.concat(cal);
    }


    //process.stdout.write(JSON.stringify(result));
    const rows = toGoogleCalendarCsv(result);
    rows.forEach(row => {
        process.stdout.write(row + "\n");
    });

    setTimeout(() => {
        browser.close()
    }, 1000);
})();
