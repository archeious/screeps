var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
            creep.memory.home = 'W77S34';
        switch (creep.memory.role) {
            case 'claim':
                roleUpgrader.run(creep);
            break;
            case 'harvest':
                roleHarvester.run(creep);
            break;
            case 'build':
                roleBuilder.run(creep);
            break;
        } 
    }
    var minHarvesters = 3;
    var numHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvest');
    var minUpgraders = 4;
    var numUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'claim');
    var minBuilders = 4;
    var numBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'build');
    
    console.log("There are currently " + numHarvesters + " of " + minHarvesters + " harvesters");
    console.log("There are currently " + numUpgraders + " of " + minUpgraders + " upgraders");
    console.log("There are currently " + numBuilders + " of " + minBuilders + " builders");
    
    if (numHarvesters < minHarvesters) {
        var name = Game.spawns['Spawn1'].createCreep( [WORK, WORK, CARRY, MOVE], undefined, {role:'harvest', state:'harvest', home: 'W77S34', source: roleHarvester.nextSource()});
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as harvester");
        };
    }
    else if (numUpgraders < minUpgraders) {
        var name = Game.spawns['Spawn1'].createCreep( [WORK, WORK, CARRY, MOVE], undefined, {role:'claim', state:'harvest', source: roleUpgrader.nextSource(), home: 'W77S34' });
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as upgrader");
        };
    }
    else if (numBuilders < minBuilders) {
        var name = Game.spawns['Spawn1'].createCreep( [WORK, WORK, CARRY, MOVE], undefined, {role:'build', state:'harvest', source: roleBuilder.nextSource(), home: 'W77S34' });
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as builder");
        };
    }

    
    
}