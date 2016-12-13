var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleDefender = require('role.defender');

module.exports.loop = function () {
    console.log("Tick:" + Game.time);
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
            creep.memory.home = 'W77S34';
        switch (creep.memory.role) {
            case 'claim':
                roleUpgrader.run(creep);
            break;
            case 'defend':
                roleDefender.run(creep);
            break;
            case 'harvest':
                roleHarvester.run(creep);
            break;
            case 'repair':
                roleRepairer.run(creep);
            break;

            case 'build':
                roleBuilder.run(creep);
            break;
        } 
    }
    var minDefenders = 2;
    var numDefenders = _.sum(Game.creeps, (c) => c.memory.role == 'defend');
    var minHarvesters = 6;
    var numHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvest');
    var minRepairers = 1;
    var numRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repair');
    var minUpgraders = 10;
    var numUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'claim');
    var minBuilders = 2;
    var numBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'build');
    
    console.log("There are currently " + numDefenders + " of " + minDefenders + " defenders");
    console.log("There are currently " + numRepairers + " of " + minRepairers + " repairers");
    console.log("There are currently " + numHarvesters + " of " + minHarvesters + " harvesters");
    console.log("There are currently " + numUpgraders + " of " + minUpgraders + " upgraders");
    console.log("There are currently " + numBuilders + " of " + minBuilders + " builders");
    
    if (numHarvesters < minHarvesters) {
        var name = Game.spawns['Spawn1'].createCreep( [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], undefined, {role:'harvest', state:'harvest', home: 'W77S34', source: roleHarvester.nextSource()});
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as harvester");
        };
    }
    else if (numDefenders < minDefenders) {
        var name = Game.spawns['Spawn1'].createCreep( [ATTACK, RANGED_ATTACK, MOVE,  MOVE], undefined, {role:'defend', state:'defend', source: roleDefender.nextSource(), home: 'W77S34' });
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as defender");
        };
    }
    else if (numRepairers < minRepairers) {
        var name = Game.spawns['Spawn1'].createCreep( [WORK, WORK, WORK, CARRY, CARRY, MOVE,  MOVE], undefined, {role:'repair', state:'harvest', source: roleRepairer.nextSource(), home: 'W77S34' });
        if (!(name < 0)) {
            console.log("Spawned new creep: " + name + " as repairer");
        };
    }
    else if (numUpgraders < minUpgraders) {
        var name = Game.spawns['Spawn1'].createCreep( [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], undefined, {role:'claim', state:'harvest', source: roleUpgrader.nextSource(), home: 'W77S34' });
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