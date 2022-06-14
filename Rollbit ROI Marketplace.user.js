// ==UserScript==
// @name         Rollbit ROI Marketplace
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ROI Calculation in the browser!
// @author       SmokeyLisa
// @match        https://rollbit.com/nft/sportsbot/marketplace*
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

        function compareSecondColumn(a, b) {
            if (a[1] === b[1]) {
                return 0;
            }
            else {
                return (a[1] < b[1]) ? -1 : 1;
            }
        }

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

            //Get Number of Bots on the page

            var loopLength = document.getElementsByClassName("css-midcvu").length;

            var arr = [
                ["Bot","ROI","Price","Freebet","Profitshare", "Link"]
            ];

            // append new value to the array


            //Loop through all elements

            for (let i = 1; i < loopLength+1; i++) {

                try {
                    //Get Bot Values
                    var index = i.toString();

                    var freebetRaw = getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[4]/div["+index+"]/div[4]/span[3]").innerHTML;
                    var profitshareRaw = getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[4]/div["+index+"]/div[4]/span[1]").innerHTML;
                    var priceRaw = getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[4]/div["+index+"]/div[6]/div[3]/div").innerHTML;
                    var bot = getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[4]/div["+index+"]/div[1]/div[1]/a/div").innerHTML;

                    //Process to actual Numbers

                    var price = convert(priceRaw);
                    var freebet = freebetRaw.replace("$","");
                    var profitshare = profitshareRaw.replace("$","");

                    //Configuration

                    var profitshareReduction = 0.7;
                    var ROFB = 0.48;
                    var roiThreshold = 50; //in %

                    //Calculate ROI based on ROFB & ProfitShareReduction

                    var ROI = 100 + ((((parseFloat(profitshare)*12*profitshareReduction) + (parseFloat(freebet)*ROFB)*12) - parseFloat(price))/parseFloat(price))*100;

                    //Display Message

                    var message = "ROI: " + ROI.toFixed(2) + "%";
                    getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[4]/div["+index+"]/div[4]/span[5]").innerHTML = message;

                    //Update Array

                    if (ROI > roiThreshold) {
                        arr.push([bot, ROI.toFixed(2), "$"+price, "$"+freebet, "$"+profitshare]);
                    }

                } catch(error) {

                }

            }

            alert("There are " + arr.length + " Rollbots with over "+roiThreshold+"% ROI\nCheck the console for more information.");
            var arrSorted = arr.sort(compareSecondColumn);
            console.log(arrSorted);

        }, delayInMilliseconds);

    }, false);
})();