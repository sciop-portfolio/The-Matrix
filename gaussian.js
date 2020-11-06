/**
  * @desc - Box-Muller transformation from a uniformly distributed RNG to a (pseudo-) gaussian RNG
  * @param Array $mean
  * @param Array $std_dev
  * @return Number - A random number
*/
let cache;
function gaussian(mean, std_dev) {
    if(cache !== undefined) {
        let ans = mean + cache*std_dev;
        cache = undefined;
        return ans;
    } else {
        let u, v, r;
        while(r == undefined || r < 0 || r >= 1) {
            u = 2*Math.random() - 1;
            v = 2*Math.random() - 1;
            r = u*u+v*v;
        }
        let c = Math.sqrt(-2*Math.log(r)/r);
        cache = v*c;

        return mean + u*c*std_dev;
    }
}
