var roleClaimer = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if (typeof(creep.memory.home) == 'undefined') {
            creep.memory.home = 'W77S34';
        }
        if (typeof(creep.memory.taget) == 'undefined') {
            creep.memory.target = 'W76S33';
        }
        switch (creep.memory.state) {
        case 'claim':
/*            if (creep.room.name == creep.memory.target) {
                if (creep.claimController(Game.rooms[creep.memory.target].controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.rooms[creep.memory.target].controller);
                }    
            } else {
             // move to target room
                var exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
*/
            var targetController = Game.getObjectById('5836b6968b8b9619519eef90');
            var result = creep.reserveController(targetController);
            creep.moveTo(Game.getObjectById('5836b6968b8b9619519eef90'));
            
            break;
        default:
            creep.memory.state ='claim';
        }
	}
};

module.exports = roleClaimer;