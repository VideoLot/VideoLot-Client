const path = require('path')
const fs = require('fs/promises')

// get all required prisma files (schema + engine)
async function getPrismaFiles(from) {
  const filterRegex = /schema\.prisma|engine/
  const prismaFiles = await fs.readdir(from)

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

                        const prismaDir = path.resolve(compiler.context, 'node_modules\\@videolot\\videolot-prisma\\client');
                        const prismaFiles = await getPrismaFiles(prismaDir);

                        prismaFiles.forEach((f) => {
                            const from = path.join(prismaDir, f);
                            fromDestPrismaMap[path.join(assetDir, f)] = from;
                        })
                    })

                    await Promise.all(jsAsyncActions)
                }
            );
        });

        compiler.hooks.done.tapPromise('CopyPrisma', async () => {
            const asyncActions = Object.entries(fromDestPrismaMap).map(async ([dest, from]) => {
                // only copy if file doesn't exist, necessary for watch mode
                const dir = path.dirname(dest);
                
                await fs.access(dir).catch(async ()=> await fs.mkdir(dir, {recursive: true}));

                if ((await fs.access(dest).catch(() => false)) === false) {
                    return fs.copyFile(from, dest);
                }
            })

            await Promise.all(asyncActions);
        })
    }
}

module.exports = { CopyPrisma };