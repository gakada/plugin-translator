module.exports = {
  '*.{es,js}': ['eslint --fix', 'git add'],
  '*.md': ['prettier --write', 'git add'],
}
