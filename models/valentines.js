var db = require('../helpers/db');
var httpError = require('http-errors');

var Valentines = {};

Valentines.getPairs = function() {
	return db('valentines_pairs').select().orderBy('position', 'ASC');
}

Valentines.getSwaps = function(limit) {
	return db('valentines_swaps')
		.select()
		.limit(limit)
		.orderBy('created', 'DESC')
		.then(function(swaps){
			return Promise.all(swaps.map(function(swap) {
				return Promise.all([
					swap,
					db('valentines_pairs').first().where({id: swap.paira_id}),
					db('valentines_pairs').first().where({id: swap.pairb_id})
				]).then(function(data) {
					var newswap = data[0]
					newswap.paira = data[1]
					newswap.pairb = data[2]
					return newswap
				})
			}));
		});
}

Valentines.getDebt = function(username) {
	return db('valentines_swaps')
		.sum('cost')
		.where('username', username)
		.first()
		.then(function(data) {
			return data.sum
		});
}

Valentines.getTotalRaised = function() {
	return db('valentines_swaps')
		.sum('cost')
		.first()
		.then(function(data) {
			return data.sum
		});
}

Valentines.createSwap = function(paira_id, pairb_id, username, value) {
	return db('valentines_swaps').insert({
		paira_id: paira_id,
		pairb_id: pairb_id,
		username: username,
		cost: value
	})
}

Valentines.swapPairs = function(paira_id, pairb_id) {
	// I'm not proud of this query but it swaps the position of two pairs and updates their values
	return db.raw('UPDATE valentines_pairs vp1 SET position = vp2.position, value = vp2.value+50 FROM valentines_pairs vp2 WHERE vp1.id IN(?,?) AND vp2.id IN(?,?) AND vp1.id<>vp2.id RETURNING vp1.id, vp1.value', [paira_id, pairb_id, paira_id, pairb_id])
}

module.exports = Valentines;