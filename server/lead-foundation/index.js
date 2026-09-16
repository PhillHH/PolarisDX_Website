const constants = require('./constants')
const apiContract = require('./api-contract')
const {
  CrmAdapter,
  CrmRouter,
  DEFAULT_JOURNEY_ROUTES,
  NoProviderConfiguredCrmAdapter,
  createNoProviderConfiguredAdapter,
} = require('./crm')
const { applyMigrations, openLeadDatabase, resolveLeadDatabasePath } = require('./database')
const {
  classifyProviderError,
  crmLogFields,
  DeliveryTimeoutError,
  deliveryKeyFor,
  normalizeResult,
  withDeliveryGuards,
} = require('./crm-delivery')
const {
  dedupKeyFor,
  IdempotencyConflictError,
  LeadRepository,
  normalizeConsent,
  normalizeContext,
  requestHash,
  retentionDeleteAfter,
} = require('./repository')
const {
  DEFAULT_RETRY_POLICY,
  nextAttemptDelayMs,
  normalizePolicy,
  shouldRetry,
} = require('./retry-policy')
const { LeadDispatcher } = require('./dispatcher')
const {
  describeRuntimeIsolation,
  resolveDeliveryMode,
  resolveRuntimeEnvironment,
  RUNTIME_ENVIRONMENTS,
} = require('./environment')
const {
  LeadPrivacyService,
  RETENTION_POLICY_SOURCES,
  deleteCaseFiles,
  resolveRetentionPolicy,
  retentionDaysFromPolicy,
  retentionEnvName,
  runRetention,
} = require('./privacy')
const {
  DEFAULT_ALERT_THRESHOLDS,
  createLeadBackup,
  createLoggerAlertSink,
  describeBackupScope,
  dispatchAlerts,
  evaluateAlerts,
  verifyBackup,
} = require('./operations')
const { classifyThrownProviderError, LeadHandoffWorker, safeErrorClass } = require('./worker')

module.exports = {
  ...constants,
  ...apiContract,
  applyMigrations,
  createLeadBackup,
  createLoggerAlertSink,
  DEFAULT_ALERT_THRESHOLDS,
  deleteCaseFiles,
  describeBackupScope,
  describeRuntimeIsolation,
  dispatchAlerts,
  evaluateAlerts,
  LeadPrivacyService,
  resolveDeliveryMode,
  resolveRetentionPolicy,
  resolveRuntimeEnvironment,
  RETENTION_POLICY_SOURCES,
  retentionDaysFromPolicy,
  retentionEnvName,
  runRetention,
  RUNTIME_ENVIRONMENTS,
  verifyBackup,
  classifyProviderError,
  classifyThrownProviderError,
  createNoProviderConfiguredAdapter,
  crmLogFields,
  DEFAULT_RETRY_POLICY,
  DeliveryTimeoutError,
  deliveryKeyFor,
  CrmAdapter,
  dedupKeyFor,
  CrmRouter,
  DEFAULT_JOURNEY_ROUTES,
  IdempotencyConflictError,
  LeadDispatcher,
  LeadHandoffWorker,
  LeadRepository,
  NoProviderConfiguredCrmAdapter,
  nextAttemptDelayMs,
  normalizeConsent,
  normalizeContext,
  normalizePolicy,
  openLeadDatabase,
  normalizeResult,
  requestHash,
  resolveLeadDatabasePath,
  retentionDeleteAfter,
  safeErrorClass,
  shouldRetry,
  withDeliveryGuards,
}
