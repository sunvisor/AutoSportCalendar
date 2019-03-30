/**
 * autosport クローラー
 *
 * Created by sunvisor on 2019-03-29.
 */
const puppeteer = require('puppeteer');

module.exports = class {

    async openBrowser() {
        this._browser = await puppeteer.launch({
            headless: true
        });
        this._page = await this._browser.newPage();
    }

    closeBrowser() {
        this._browser.close()
    }

    async getMonthCalendar(url, year, month) {
        await this._page.goto(url, {
            waitFor: "div.tableArea table"
        });
        const table = await this._page.$('div.tableArea table');
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
                const event = await this._page.evaluate(element => {
                    let result = "";
                    for(const c of element.childNodes){
                        if(c.nodeName === "#text"){
                            result += c.nodeValue;
                        }
                    }
                    return result.trim() || element.innerText.trim();
                }, eventEl);
                events.push(event.trim())
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

    // noinspection JSMethodCanBeStatic
    googleCalendarHeader() {
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

    toGoogleCalendarCsv(data) {
        let result = [];

        result.push(this.googleCalendarHeader());
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
};
