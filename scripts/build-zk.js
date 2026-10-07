const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CIRCUITS_DIR = path.join(__dirname, '../circuits');
const BUILD_DIR = path.join(__dirname, '../public/zk'); // Frontend needs to access wasm and zkey

if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

function run(cmd) {
  console.log(`Executing: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

async function buildCircuit(circuitName) {
  const circuitPath = path.join(CIRCUITS_DIR, circuitName, `${circuitName}.circom`);
  const outputDir = path.join(CIRCUITS_DIR, circuitName, 'build');
  
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log(`\n--- Building ${circuitName} circuit ---`);
  
  // 1. Compile Circuit
  run(`circom ${circuitPath} --r1cs --wasm --sym --c -o ${outputDir}`);

  // 2. Setup (Groth16) - For demo, using dummy trusted setup
  const ptauFile = path.join(CIRCUITS_DIR, 'pot12_final.ptau');
  if (!fs.existsSync(ptauFile)) {
    console.log("Downloading Powers of Tau file...");
    // Download a pre-computed ptau file (usually required, but let's generate a small one for demo to avoid wget issues)
    run(`npx snarkjs powersoftau new bn128 12 pot12_0000.ptau -v`);
    run(`npx snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v -e="some random text"`);
    run(`npx snarkjs powersoftau prepare phase2 pot12_0001.ptau ${ptauFile} -v`);
  }

  const r1csFile = path.join(outputDir, `${circuitName}.r1cs`);
  const zkeyFile = path.join(outputDir, `${circuitName}_0000.zkey`);
  const finalZkeyFile = path.join(outputDir, `${circuitName}_final.zkey`);
  const vkeyFile = path.join(outputDir, `verification_key.json`);

  // 3. Setup and generate keys
  run(`npx snarkjs groth16 setup ${r1csFile} ${ptauFile} ${zkeyFile}`);
  run(`npx snarkjs zkey contribute ${zkeyFile} ${finalZkeyFile} --name="1st Contributor Name" -v -e="random text"`);
  run(`npx snarkjs zkey export verificationkey ${finalZkeyFile} ${vkeyFile}`);

  // 4. Copy to public dir for frontend
  const wasmPath = path.join(outputDir, `${circuitName}_js`, `${circuitName}.wasm`);
  fs.copyFileSync(wasmPath, path.join(BUILD_DIR, `${circuitName}.wasm`));
  fs.copyFileSync(finalZkeyFile, path.join(BUILD_DIR, `${circuitName}_final.zkey`));
  fs.copyFileSync(vkeyFile, path.join(BUILD_DIR, `${circuitName}_vkey.json`));
  
  console.log(`\n--- Successfully built ${circuitName} ---`);
}

async function main() {
  try {
    await buildCircuit('age');
    await buildCircuit('degree');
  } catch (error) {
    console.error("Error building circuits:", error);
  }
}

main();
