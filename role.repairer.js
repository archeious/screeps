var roleRepairer = {
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
        creep.say("r");
	    if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	        creep.say('repairing');
	    }

	    if(creep.memory.repairing) {
	        var roomStructures = creep.room.find(FIND_STRUCTURES, {filter:function(st){
                return st.structureType == STRUCTURE_WALL ||  st.my;
            }});
            
            var roomStructureIndex;
            var roomStructuresCount = roomStructures.length;
            for(roomStructureIndex = 0; roomStructureIndex < roomStructuresCount; roomStructureIndex++) {
                var roomStructure = roomStructures[roomStructureIndex];
                if(roomStructure.hits < 5000) {
                    if(creep.repair(roomStructure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(roomStructure);
                        return;
                    } else {
                        return;
                    }
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if (typeof(creep.memory.source) == undefined) { creep.memory.source = 0; }
            if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.source]);
            }
	    }
	}
};

module.exports = roleRepairer;