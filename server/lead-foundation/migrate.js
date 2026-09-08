const { openLeadDatabase, resolveLeadDatabasePath } = require('./database')

const filename = resolveLeadDatabasePath()
const db = openLeadDatabase({ filename })
try {
  const versions = db
    .prepare('SELECT version FROM schema_migrations ORDER BY version')
    .all()
    .map(({ version }) => version)
  console.log(JSON.stringify({ database: filename, migrations: versions }))
} finally {
  db.close()
}
