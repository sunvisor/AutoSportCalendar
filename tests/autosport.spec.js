/**
 * autosport.spec.js
 *
 * Created by sunvisor on 2019-03-30.
 */
const path = require('path');
const AutoSport = require('../crawler/autosport');

let target;

it('should ', (done) => {
    target = new AutoSport();
    const e = [
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
    const ret = target.googleCalendarHeader();
    expect(ret).toEqual(e);
        done();
});


it('should ', (done) => {
    target = new AutoSport();

    const data = [
        {
            day   : '03/31/2019',
            events:
                [
                    'スーパーGT富士公式テスト',
                    'MotoGP 第2戦アルゼンチンGP',
                    'F1 第2戦バーレーンGP',
                    'WRC第4戦ツール・ド・コルス（フランス）'
                ]
        }
    ];
    const e = [
        [
            'Subject',
            'Start Date',
            'Start Time',
            'End Date',
            'End Time',
            'All Day Event',
            'Description',
            'Location',
            'Private',
        ],
        ['スーパーGT富士公式テスト', '03/31/2019', '', '03/31/2019', '', 'True', 'motor sports', '', 'False'],
        ['MotoGP 第2戦アルゼンチンGP', '03/31/2019', '', '03/31/2019', '', 'True', 'motor sports', '', 'False'],
        ['F1 第2戦バーレーンGP', '03/31/2019', '', '03/31/2019', '', 'True', 'motor sports', '', 'False'],
        ['WRC第4戦ツール・ド・コルス（フランス）', '03/31/2019', '', '03/31/2019', '', 'True', 'motor sports', '', 'False'],
    ];
    const ret = target.toGoogleCalendarCsv(data);
    expect(ret).toEqual(e);

    done();
});

it('should ', async (done) => {
    target = new AutoSport();
    await target.openBrowser();
    const filePath = path.join(__dirname, 'sample.html');
    const ret = await target.getMonthCalendar(`file://${filePath}`, 2019, 3);

    expect(ret[0].day).toBe('03/01/2019');
    expect(ret[0].events[0]).toBe('F1公式テスト（バルセロナ）');
    expect(ret[3].events[0]).toBe('スーパーフォーミュラ公式テスト鈴鹿');
    done();
});

it('should ', (done) => {
    target.closeBrowser();
    done();
});
