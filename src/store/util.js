const util = {
	sleep: (delay) => {
		for (let t = Date.now(); Date.now() - t <= delay;) ;
	}
}
export default util