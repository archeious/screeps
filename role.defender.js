var roleDefender = {
    sourceCount: 2,
    lastSource: 1,
    nextSource: function() {
        this.lastSource += 1;
        if (this.lastSource >= this.sourceCount) {
            this.lastSource = 0;
        }
        return this.lastSource;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            if(creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(hostiles[0]);
            }            
        } else {
            creep.moveTo(Game.flags['EastGate']);
        }
    },

};

module.exports = roleDefender;