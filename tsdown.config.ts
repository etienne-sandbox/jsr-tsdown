import { vanillaExtractPlugin } from "@vanilla-extract/rollup-plugin";
import { extname } from "node:path";
import { defineConfig } from "tsdown";

export default defineConfig({
  platform: "neutral",
  plugins: [
    tsSelfTypesPlugin(),
    vanillaExtractPlugin({
      extract: {
        name: "styles.css",
        sourcemap: false,
      },
    }),
  ],
  // Ensure CSS asset is emitted directly into dist as "bundle.css" (no hash, no assets subdir)
  outputOptions: {
    assetFileNames: (assetInfo: any) => {
      if (assetInfo.name === "styles.css") {
        return "styles.css";
      }
      // keep rollup defaults (or put other assets into assets/)
      return "assets/[name]-[hash][extname]";
    },
  },
});

function tsSelfTypesPlugin(): any {
  return {
    name: "ts-self-types",

    async generateBundle(_options: any, bundle: any) {
      for (const [_fileName, asset] of Object.entries(bundle)) {
        // Only process JavaScript output files
        if ((asset as any).type !== "asset" && "code" in (asset as any)) {
          const code = (asset as any).code;
          const fileName = (asset as any).fileName || "";

          // Skip if already has the header
          if (code.includes("@ts-self-types")) {
            continue;
          }

          // Determine the corresponding .d.ts file
          const ext = extname(fileName);
          const typeDefFile = fileName.replace(ext, ".d.ts");

          // Create the header
          const header = `/* @ts-self-types="./${typeDefFile}" */\n`;

          // Add header to the code
          (asset as any).code = header + code;
        }
      }
    },
  };
}
