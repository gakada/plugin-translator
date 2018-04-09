module.exports = {
  modules: {
    ships: 'Player ship modules',
    enemies: 'Enemy ship modules',
    bosses: { category: 'Enemy boss ship modules', move_to: 'enemies' },
    equipment: 'Equipment modules',
    enemy_equipment: 'Enemy equipment modules',
    items: 'Item modules',
    misc: 'Misc data modules',
  },
  bot: {
    protocol: 'https',
    server: 'kancolle.wikia.com',
    concurrency: 100,
  },
  user: {
    name: '',
    password: '',
  },
}
