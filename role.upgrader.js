var roleUpgrader = {
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
        creep.say("u");
        if (typeof(creep.memory.home) != 'undefined') {
            if (creep.room.name != creep.memory.home) {
                console.log (creep.name + " is away from " + creep.memory.home);
                creep.moveTo(Game.spawns['Spawn1']);
                return;
            } 
        } else {
                console.log(creep.name + " does not have a home stting to hardcoded value.");
                creep.memory.home = 'W36N68';
        }
        switch (creep.memory.state) {
        case 'claim':
            if (creep.carry.energy == 0) {
                creep.memory.source = this.nextSource();
                creep.memory.state = 'harvest';
            } else if (creep.upgradeController(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            break;
        case 'harvest':
    	    if(creep.carry.energy < creep.carryCapacity) {
                var sources = creep.room.find(FIND_SOURCES);
                if (typeof(creep.memory.source) == undefined) { creep.memory.source = 0; }
                var source = creep.memory.source;
                if(creep.harvest(sources[source]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[source]);
                }
            } else {
                creep.memory.state = 'claim';
            }
            break;
        default:
            creep.memory.state ='harvest';
        }
	}
};

module.exports = roleUpgrader;