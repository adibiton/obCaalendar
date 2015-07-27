demo.app.utils = (function(){
	"use strict";
	
	/**
	 * Calculate least common multiple for an array of numbers
	 * @param  {Array}  aNumbers  array of numbers
	 * @return Integer  least common multiple for all numbers
	 */
	function calcLcm(aNumbers) {
		if (aNumbers.length > 1) {
			aNumbers.push( lcm( aNumbers.shift() , aNumbers.shift() ) );
			return calcLcm(aNumbers);
		} else {
		return aNumbers[0];
		}
	}	
	function lcm(a, b){
		var x = gcd(a, b);
		return (a * b) / x;
	}
	function gcd(a, b){
		if(!b){
			return a;
		}
		return gcd(b, a%b);
	}	
	/**
	 * Calculate whether two events are overlapping
	 * @param  {event}  oEvent1
	 * @param  {event}  oEvent2
	 * @return {Boolean}  
	 */
	function isEventsOverlapping(oEvent1, oEvent2){
		return oEvent1.end > oEvent2.start && oEvent1.start < oEvent2.end; 
	}
	return {
		isEventsOverlapping : isEventsOverlapping,		
		calcLcm : calcLcm
	}
}());