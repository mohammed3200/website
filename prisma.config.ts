
export default {
  dataproxy: {
    url: process.env.DATABASE_URL,
  },
  // If the error message implied standard datasource config:
  datasource: {
    provider: 'mysql',
    url: process.env.DATABASE_URL,
  }
}
