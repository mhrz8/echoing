import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PATH_TO_ROOT = path.relative(process.cwd(), path.resolve(__dirname, '..'));
const PATH_TO_PROTO_GENERATED = path.join(PATH_TO_ROOT, 'generated');

async function fixAutoGen(filePath: string): Promise<void> {
  let code = await fsp.readFile(filePath, 'utf-8');

  // Add `.js` suffix to applicable imports
  code = code.replace(
    /((?:import(?:\s+type)?)|(?:export(?:\s+type)?))\s+(.*)\s+from\s+['"]((?:\.[./\\])+.+)['"]/g,
    (_, $1, $2, $3) => {
      const params: string = $3 as string;
      const hasExt = path.extname(params) !== '';
      const pathname = hasExt ? params : `${params}.js`;
      return `${$1} ${$2} from "${pathname}"`;
    },
  );

  // Convert `import` to `import type` for erroneous imports
  code = code.match(/\btype\s+ServerCallContext\b/)
    ? code
    : code.replace(
        /(import\s+{[^}]*\b)(ServerCallContext)(\b[^}]*})/g,
        (_, $1, $2, $3) => `${$1}type ${$2}${$3}`,
      );

  return fsp.writeFile(filePath, code);
}

async function generateIndexForNamespace(dir: string): Promise<void> {
  const output = path.join(dir, 'index.ts');

  const dirents = await fsp.readdir(dir, { withFileTypes: true });
  const rewrites: Promise<void>[] = [];

  let imports = '';

  for (const ent of dirents) {
    if (!ent.isFile() || !ent.name.endsWith('.ts') || ent.name === 'index.ts') {
      continue;
    }

    rewrites.push(fixAutoGen(path.join(dir, ent.name)));

    imports += `export * from './${ent.name.replace(/\.ts$/, '.js')}';\n`;
    // if (ent.name.endsWith('.client.ts')) {
    //   addClient(ent.name);
    // } else if (ent.name.endsWith('.server.ts')) {
    //   addServer(ent.name);
    // } else {
    //   addMessage(ent.name);
    // }
  }

  await Promise.all([...rewrites, fsp.writeFile(output, imports)]);

  // function addClient(fileName: string): void {
  //   addImport(fileName, 'client');
  // }

  // function addServer(fileName: string): void {
  //   addImport(fileName, 'server');
  // }

  // function addMessage(fileName: string): void {
  //   addImport(fileName, path.basename(fileName, path.extname(fileName)));
  // }

  // function addImport(fileName: string, name: string): void {
  //   imports += `export * as ${name} from './${fileName}';\n`;
  // }
}

async function generateIndexForGeneratedTypeScript(dir: string): Promise<Promise<void>[]> {
  const dirents = await fsp.readdir(dir, { withFileTypes: true });
  const promises: Promise<void>[] = [];

  for (const ent of dirents) {
    if (ent.isDirectory()) {
      const thisDir = path.join(dir, ent.name);
      const subDirents = await fsp.readdir(thisDir, { withFileTypes: true });
      for (const subEnt of subDirents) {
        if (subEnt.isDirectory()) {
          promises.push(generateIndexForNamespace(path.join(thisDir, subEnt.name)));
        }
      }
    }
  }

  return promises;
}

async function main(): Promise<void> {
  void (await generateIndexForGeneratedTypeScript(PATH_TO_PROTO_GENERATED));
}

void main();
