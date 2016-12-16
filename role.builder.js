var roleBuilder = {
    sourceCount: 2,
    lastSource: 1,
    nextSource: function() {
        this.lastSource += 1;
        if (this.lastSource >= this.sourceCount) {
            this.lastSource = 0;
        }
        return this.lastSource;
    },
    rooms: ["W77S34", "W76S34", "W76S33"],
    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
            creep.say("B");
            var targets = [];
            for (var i=0; i < this.rooms.length; i++) {
                var room = this.rooms[i];
                if (Game.rooms[room] != undefined) {                    
                    targets = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
                    if (targets.length > 0) { 
                        break; 
                    } 
                } 
            }
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                var exit = creep.room.findExitTo(this.rooms[1]);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
	    }
	    else {
            if (creep.memory.home != creep.room.name) {      
                creep.moveTo(Game.flags['EastGate']);
                return;
            }  

	        var sources = creep.room.find(FIND_SOURCES);
            if (creep.memory.source == undefined) { creep.memory.source = 0; }
            if(creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.source]);
            }

	    }
	},
    create: function(spawner, energy) {
        var body = [];
        body.push(WORK);
        body.push(MOVE);
        body.push(CARRY);
        energy -= 200;
        while (energy >= 200) {            
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
            energy -= 200;            
        }; 
        return spawner.createCreep( body, undefined, {role:'build', state:'harvest'});
    }
};

module.exports = roleBuilder;