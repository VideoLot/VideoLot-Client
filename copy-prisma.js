const path = require('path')
const fs = require('fs/promises')

// when client is bundled this gets its output path
// regex works both on escaped and non-escaped code
const prismaDirRegex =
  /\\?"?output\\?"?:\s*{(?:\\n?|\s)*\\?"?value\\?"?:(?:\\n?|\s)*\\?"(.*?)\\?",(?:\\n?|\s)*\\?"?fromEnvVar\\?"?/g

async function getPrismaDir(from) {
  // if we can find schema.prisma in the path, we are done
  if (await fs.stat(path.join(from, 'schema.prisma')).catch(() => false)) {
    return from
  }

  // otherwise we need to find the generated prisma client
  return path.dirname(require.resolve('.prisma/client', { paths: [from] }))
}

// get all required prisma files (schema + engine)
async function getPrismaFiles(from) {
  const prismaDir = await getPrismaDir(from)
  const filterRegex = /schema\.prisma|engine/
  const prismaFiles = await fs.readdir(prismaDir)

  return prismaFiles.filter((file) => file.match(filterRegex))
}

class CopyPrisma {
    constructor(options = {}) {
        this.options = options
    }

    /**
     * @param {import('webpack').Compiler} compiler
     */
    apply(compiler) {
        const { webpack } = compiler
        const { Compilation, sources } = webpack

        let schemaCount = 0
        const fromDestPrismaMap = {} // { [dest]: from }

        compiler.hooks.compilation.tap('CopyPrisma', (compilation) => {
            compilation.hooks.processAssets.tapPromise(
                {
                    name: 'CopyPrisma',
                    stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
                },
                async (assets) => {
                    const jsAssetNames = Object.keys(assets).filter((k) => k.endsWith('.js'))
                    const jsAsyncActions = jsAssetNames.map(async (assetName) => {
                        // prepare paths
                        const outputDir = compiler.outputPath
                        const assetPath = path.resolve(outputDir, assetName)
                        const assetDir = path.dirname(assetPath)

                        // get sources
                        const oldSourceAsset = compilation.getAsset(assetName);
                        const oldSourceContents = oldSourceAsset.source.source() + '';

                        // update sources
                        // TODO: We known location of the prisma directory no need extract it from source content
                        const matches = oldSourceContents.matchAll(prismaDirRegex);
                        for (const match of matches) {
                            const prismaDir = await getPrismaDir(match[1]);
                            const prismaFiles = await getPrismaFiles(match[1]);

                            prismaFiles.forEach((f) => {
                                const from = path.join(prismaDir, f);
                                fromDestPrismaMap[path.join(assetDir, f)] = from;
                            })
                        }
                    })

                    await Promise.all(jsAsyncActions)
                }
            );
        });

        compiler.hooks.done.tapPromise('CopyPrisma', async () => {
            const asyncActions = Object.entries(fromDestPrismaMap).map(async ([dest, from]) => {
                // only copy if file doesn't exist, necessary for watch mode
                if ((await fs.access(dest).catch(() => false)) === false) {
                    return fs.copyFile(from, dest)
                }
            })

            await Promise.all(asyncActions)
        })
    }
}

module.exports = { CopyPrisma };