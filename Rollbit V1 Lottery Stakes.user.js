// ==UserScript==
// @name         Rollbit V1 Lottery Stakes
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Find the best Lottery Stakes per Dollar
// @author       SmokeyLisa
// @match        https://rollbit.com/nft/rollbot/marketplace*
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
                ["Bot","LS/$","Price","Lottery Stakes"]
            ];

            // append new value to the array


            //Loop through all elements

            for (let i = 1; i < loopLength+1; i++) {

                try {
                    //Get Bot Values
                    var index = i.toString();

                    var lotteryStakesRaw = getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[5]/div["+index+"]/div[4]/span[7]").innerHTML;
                    var priceRaw = getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[5]/div["+index+"]/div[6]/div[3]/div").innerHTML;
                    var bot = getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[5]/div["+index+"]/div[1]/div[1]/a/div").innerHTML;

                    //Process to actual Numbers

                    var price = convert(priceRaw);
                    var lotteryStakes = convert(lotteryStakesRaw);

                    //Calculate ROI based on ROFB & ProfitShareReduction

                    var LSR = (lotteryStakes / price).toFixed(2);

                    //Display Message

                    var message = + LSR + " LS/$";
                    getElementByXpath("/html/body/div[1]/div[6]/div[1]/div/div[5]/div["+index+"]/div[4]/span[3]").innerHTML = message;

                    //Config

                    var lsThreshold = 200;

                    //Update Array

                    if (LSR > lsThreshold) {
                        arr.push([bot, LSR, "$"+price, lotteryStakesRaw]);
                    }

                } catch(error) {

                }

            }

            alert("There are " + arr.length + " Rollbots with over "+lsThreshold+"LS/$\nCheck the console for more information.");
            var arrSorted = arr.sort(compareSecondColumn);
            console.log(arrSorted);

        }, delayInMilliseconds);

    }, false);
})();