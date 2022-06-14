// ==UserScript==
// @name         ROI UI Bot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ROI if you click on a bots page
// @author       You
// @match        https://rollbit.com/nft/eth*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {

        function getElementByXpath(path) {
            return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

        var delayInMilliseconds = 2000; //2 seconds


        function convert(value)
        {
            if (value.includes("K")) {
                 value=value.replace("K","").replace("$","") * 1000;
            }
            else {
                value=value.replace("$","");
            }
            return value;
        }

        setTimeout(function() {

            //Get Raw Values from the Page

            var priceRaw = getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[1]/div[2]/div[4]/div[1]/div[3]/div").innerHTML;
            var freebetRaw = getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[3]/div[2]/div[2]/div").innerHTML;
            var profitshareRaw = getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[3]/div[1]/div[2]/div").innerHTML;

            //Process to actual Numbers

            var multipliers = {k: 1000, m: 1000000};
            var string = priceRaw.replace("$","");
            var price = convert(priceRaw);
            var freebet = freebetRaw.replace("$","");
            var profitshare = profitshareRaw.replace("$","");

            //Configuration

            var profitshareReduction = 0.7;
            var ROFB = 0.48;

            //Calculate ROI based on ROFB & ProfitShareReduction

            var ROI = 100 + ((((parseFloat(profitshare)*12*profitshareReduction) + (parseFloat(freebet)*ROFB)*12) - parseFloat(price))/parseFloat(price))*100;

            //Display Message

            var message = "ROI: " + ROI.toFixed(2) + "%"
            getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[1]/div[2]/p").innerHTML = message;

        }, delayInMilliseconds);

    }, false);
})();