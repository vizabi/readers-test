import * as path from "path";
import * as fs from "fs";
import * as mkdirp from 'mkdirp';

export function writeDiff(error: string, testIndex: number, fixtureDataStr, dataStr) {
  const dir = path.resolve(__dirname, '..', '..', 'test', 'result', `${testIndex}`);

  mkdirp.sync(dir);

  fs.writeFileSync(path.resolve(dir, 'original.json'), fixtureDataStr);
  fs.writeFileSync(path.resolve(dir, 'result.json'), dataStr + error);
}

export function writeDiagnostic(scriptFilePath, data) {
  const scriptFileName = path.basename(scriptFilePath);
  const scriptDirName = path.dirname(scriptFilePath);
  const dirPath = path.resolve(scriptDirName, 'diagnostics');
  const filePath = path.resolve(dirPath, `${scriptFileName}.diag.json`);

  mkdirp.sync(dirPath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
