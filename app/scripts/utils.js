/* global demo */
demo.app.utils = (function(){
	'use strict';


	/**
	 * Calculate greatest common divider for two numbers
	 * @param  {number}  a
	 * @param  {number}  b
	 * @return {number} gcd for a,b
	 */
	function gcd(a, b){
		if(!b){
			return a;
		}
		return gcd(b, a % b);
	}
	/**
	 * Calculate least common multiple for two numbers
	 * @param  {number}  a
	 * @param  {number}  b
	 * @return {number} least common multiple for a,b
	 */
	function lcm(a, b){
		var x = gcd(a, b);
		return (a * b) / x;
	}

	/**
	 * Calculate least common multiple for an array of numbers
	 * @param  {array}  aNumbers  array of numbers
	 * @return {number} least common multiple for all numbers
	 */
	function calcLcm(aNumbers) {
		if (aNumbers.length > 1) {
			aNumbers.push( lcm( aNumbers.shift(), aNumbers.shift() ) );
			return calcLcm(aNumbers);
		} else {
		return aNumbers[0];
		}
	}


	/**
	 * Calculate whether two events are overlapping
	 * @param  {event}  oEvent1
	 * @param  {event}  oEvent2
	 * @return {boolean}
	 */
	function isEventsOverlapping(oEvent1, oEvent2){
		return oEvent1.end > oEvent2.start && oEvent1.start < oEvent2.end;
	}
	return {
		isEventsOverlapping: isEventsOverlapping,
		calcLcm: calcLcm
	};
}());
