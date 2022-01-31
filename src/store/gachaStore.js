import {defineStore} from 'pinia'

export const useLimitCharacterStore = defineStore('limitGacha', {
	state: () => {
		return {
			fiveStarCount: 0,
			fourStarCount: 0,
			threeStarCount: 0,
			fourStarWeaponCount: 0,
			res: [],
			initState: false
		}
	},
	actions: {
		setLimitCharacterData(tempRes) {
			for (let i = 0; i < tempRes.length; i++) {
				switch (tempRes[i].rank_type) {
					case '5':
						this.fiveStarCount++
						break
					case '4':
						this.fourStarCount++
						break
					case '3':
						this.threeStarCount++
						break
					default:
						console.log('break')
						break
				}
				this.res.push(tempRes[i])
			}
		}
	}
})

export const useCommonCharacterStore = defineStore('commitGacha', {
	state: () => {
		return {
			fiveStarCount: 0,
			fourStarCount: 0,
			threeStarCount: 0,
			fourStarWeaponCount: 0,
			res: [],
			initState: false
		}
	},
	actions: {
		setLimitCharacterData(tempRes) {
			for (let i = 0; i < tempRes.length; i++) {
				switch (tempRes[i].rank_type) {
					case '5':
						this.fiveStarCount++
						break
					case '4':
						this.fourStarCount++
						break
					case '3':
						this.threeStarCount++
						break
					default:
						console.log('break')
						break
				}
				this.res.push(tempRes[i])
			}
		}
	}
})

export const useWeaponStore = defineStore('weaponGacha',{
	state: () => {
		return {
			fiveStarCount: 0,
			fourStarCount: 0,
			threeStarCount: 0,
			fourStarCharacterCount: 0,
			res: [],
			initState: false
		}
	},
	actions: {
		setLimitCharacterData(tempRes) {
			for (let i = 0;i < tempRes.length;i++){
				switch (tempRes[i].rank_type) {
					case '5':
						this.fiveStarCount++
						break
					case '4':
						this.fourStarCount++
						break
					case '3':
						this.threeStarCount++
						break
					default:
						console.log('break')
						break
				}
				this.res.push(tempRes[i])
			}
		}
	}
})