'use strict';

const puppeteer = require('puppeteer');
const math = require('mathjs')
const fs = require('fs');

if ( process.argv.length < 3 ) {
    console.log( 'ERROR: specify target URL' );
    console.log( `

Usage:
    node_page_get $target_url [ number_of_trials ]

    `);
    process.exit();
}
const target_url = process.argv[2];
if ( ! target_url.match( /^https?:\/\// ) ) {
    console.log( 'ERROR: doubtful URL: ' + target_url );
    process.exit();
}
const times = process.argv[3] || 10;

(async() => {
    let browser = await puppeteer.launch({args: ['--no-sandbox']});
    console.log( target_url );

    let total_hrend = [ 0, 0 ];
    let whole_hrend_sec = [];
    let whole_hrend_nsec = [];
    for( let i=0; i<times; i++ ) {
        await (async() => {
            let page = await browser.newPage();
            let hrstart = process.hrtime();
            await page.goto( target_url );
            page.waitForFunction( ( target_url ) => {
                const locationCondition =
                    window.location.href === target_url
                ;
                const readyStateCondition =
                    window.document.readyState === 'interactive'
                    || window.document.readyState === 'complete'
                ;
                return locationCondition && readyStateCondition;
            } );
            let hrend = process.hrtime( hrstart );
            console.info( 
                '    %ds %dms', hrend[0], hrend[1] / 1000000
            );
            total_hrend[0] += hrend[0];
            total_hrend[1] += hrend[1];
            whole_hrend_sec.push( hrend[0] );
            whole_hrend_nsec.push( hrend[1] );
            page = null;
        })();
    }
    console.info( 
        'TOTAL Execution time (hr): %ds %dms',
            total_hrend[0],
            total_hrend[1] / 1000000
    );
    console.info( 
        '             average (hr): %ds %dms',
            total_hrend[0] / times,
            total_hrend[1] / 1000000 / times
    );
    console.info(
        '              median (hr): %ds %dms',
            math.median( whole_hrend_sec ),
            math.median( whole_hrend_nsec ) / 1000000
    );

    process.exit();
})();
