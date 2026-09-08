const fs = require('node:fs')
const path = require('node:path')

/**
 * Aufloesung gegateter Assets (AP19 PT19.3).
 *
 * DER KERN: der Client nennt eine ASSET-ID, nie einen Dateipfad. Der Server
 * schlaegt die ID in der kanonischen Registry nach und baut den Pfad selbst.
 * Ein Request kann damit strukturell keinen Pfad waehlen — weder mit `../`,
 * noch prozentkodiert, noch absolut, noch mit Backslashes. Die Pruefung unten
 * ist die zweite Schicht, nicht die erste.
 */

/**
 * Die abgeleitete Registry aus `resourceInventory.ts`. `check:content-download`
 * laesst den Build scheitern, wenn sie von der Quelle abweicht.
 *
 * `POLARIS_RESOURCE_REGISTRY_PATH` ist ein serverseitiger Test-Seam derselben
 * Klasse wie `LEAD_DB_PATH` — er zeigt auf eine Registry-Datei, nie auf ein
 * Asset. Ohne ihn gilt die ausgelieferte Fassung.
 */
const registry = require(
  process.env.POLARIS_RESOURCE_REGISTRY_PATH
    ? path.resolve(process.env.POLARIS_RESOURCE_REGISTRY_PATH)
    : './resource-registry.json',
)

const DEFAULT_PROTECTED_DIR = path.join(__dirname, '..', 'storage', 'protected')

class AssetResolutionError extends Error {
  constructor(code) {
    super(code)
    this.name = 'AssetResolutionError'
    this.code = code
  }
}

function protectedRoot(env = process.env) {
  return path.resolve(env.POLARIS_PROTECTED_ASSET_DIR || DEFAULT_PROTECTED_DIR)
}

/**
 * Waehlt die Variante. `language` ist ein Wunsch, kein Pfad: passt sie nicht,
 * wird die erste reale Variante geliefert und die TATSAECHLICHE Sprache
 * zurueckgegeben. So kann keine Sprache behauptet werden, die es nicht gibt.
 */
function selectVariant(asset, language) {
  return asset.variants.find((variant) => variant.language === language) || asset.variants[0]
}

/**
 * Bindet die Aufloesung an eine Registry.
 *
 * Der Default arbeitet auf `resource-registry.json`. Die Fabrik existiert,
 * damit die Tests dieselbe Aufloesungslogik gegen ein gegatetes Fixture
 * fahren koennen — es gibt heute noch kein gegatetes Launch-Asset, und ein
 * ungetesteter Auslieferungspfad waere kein Auslieferungspfad.
 */
function createAssetResolver(source = registry) {
  const assets = new Map(source.assets.map((asset) => [asset.id, asset]))

  function getAsset(assetId) {
    // Kein Trim, kein Lowercasing, kein Fuzzy-Match: exakte ID oder nichts.
    if (typeof assetId !== 'string' || !assets.has(assetId)) {
      throw new AssetResolutionError('UNKNOWN_ASSET')
    }
    return assets.get(assetId)
  }

  /**
   * Vollstaendige Aufloesung fuer die geschuetzte Auslieferung.
   *
   * Wirft, wenn das Asset unbekannt, nicht gegatet, nicht geschuetzt abgelegt
   * oder physisch nicht vorhanden ist. Gibt niemals einen Pfad aus dem
   * Request zurueck.
   */
  function resolve(assetId, language, env = process.env) {
    const asset = getAsset(assetId)
    if (asset.deliveryClass !== 'GATED') throw new AssetResolutionError('ASSET_NOT_GATED')

    const variant = selectVariant(asset, language)
    if (!variant) throw new AssetResolutionError('ASSET_HAS_NO_VARIANT')
    if (variant.storage !== 'PROTECTED') throw new AssetResolutionError('ASSET_NOT_PROTECTED')

    const root = protectedRoot(env)
    // `variant.path` stammt aus der Registry. Die Normalisierung faengt
    // trotzdem ab, falls die Registry selbst je etwas Unsauberes enthaelt.
    const absolute = path.resolve(root, variant.path)
    if (absolute !== root && !absolute.startsWith(root + path.sep)) {
      throw new AssetResolutionError('ASSET_PATH_ESCAPES_ROOT')
    }
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      throw new AssetResolutionError('ASSET_FILE_MISSING')
    }

    return {
      assetId: asset.id,
      language: variant.language,
      mime: variant.mime,
      bytes: variant.bytes,
      filename: path.basename(variant.path),
      absolutePath: absolute,
    }
  }

  const gatedVariants = () =>
    source.assets
      .filter((asset) => asset.deliveryClass === 'GATED')
      .flatMap((asset) => asset.variants.map((variant) => ({ assetId: asset.id, ...variant })))

  return { assets, getAsset, gatedVariants, resolve }
}

const defaultResolver = createAssetResolver()

module.exports = {
  AssetResolutionError,
  DEFAULT_PROTECTED_DIR,
  createAssetResolver,
  gatedVariants: defaultResolver.gatedVariants,
  getAsset: defaultResolver.getAsset,
  protectedRoot,
  registry,
  resolveProtectedAsset: defaultResolver.resolve,
  selectVariant,
}
