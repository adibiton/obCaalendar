
**Calendar layout**  

The following algorithm should solve the layout calendar problem:  
1. Sort events objects by their start time ascending (and end time), e.g. three events with the following attributes:  
> {id:2, start: 60, end: 100}  
> {id:4, start: 60, end: 70}  
> {id:5, start: 70, end: 90}  

> ==> [4, 2, 5]  
 
2. Calculate longestOverlapingChain (loc for shorten) for each event 
> explanantion: event can overlap other events. The above metric
> resamble the longest chain each event belongs to.   e.g. for the
> sample given to the assingment, event A has loc of 3 (since it overlap
> events B and C). event D has loc of 3, event G has loc of 1  
> Events will have it's loc based on the max loc in the chain it belongs to 
  

3. In order to calculate the number of columns in the layout, we should find the least common multiple (lcm) of all loc's, the lcm will be the number of columns we need in the layout. The following algoritm will help us to calculate the lcm

> lcm = loc1*loc2*loc3/gcd(loc1,loc2,loc3,...)

4. calculate the width for each column (720/lcm)
5. layout events in the container, fore each event:
	1. calculate the start column of each event  
	2. calculate the end column of each event  
	3. return array with positioning of each event  
		a. left  
		b. width  
		c. top  
		d. height

Results are being offseted for layouting:

> totalwidth = totalwidth - 20  
> left = left + 10px  
> top = top
> height = end - start
