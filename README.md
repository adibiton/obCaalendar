Calendar layout:
The following algorithm should solve the layout calendar problem:
1. Sort events objects by their start time
2. Calculate longestOverlapingChain (loc for shorten) for each event
explanantion:
	event can overlap other events. The above metric resamble the longest chain each event 
	belogns to. e.g. for the sample given to the assingment, event A has loc of 3 (since it
	overlap events B and C).
	event D has loc of 3, event G has loc of 1
3. In order to calculate the number of columns in the layout, we should find the least common multiple (lcm)
of all loc's, the lcm will be the number of columns we need in the layout.
The following algoritm will help us to calculate the lcm
 
	lcm = loc1*loc2*loc3/gcd(loc1,loc2,loc3,...)
	  
4. calculate the width for each column (720/lcm)
5. layout events according to the following algoritm, for each event:

	a. calculate the start column of each event
	b. calculate the end column of each event
	b. return array with positioning of each event
		1.left
		2.width
		3.top
		4.height

Results are being offseted for layouting:

totalwidth = totalwidth - 20
left + 10px
top + 10px



