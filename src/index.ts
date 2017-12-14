import { Node, RendezvousHash } from './wrh';
import * as fs from 'fs';
import * as path from 'path';


/** Generates a quantity of nodes */
function generateNodes(amountOfNodes: number) {
  const newNodes: Node[] = [];
  for (let i = 0; i < amountOfNodes; i++) {
    const node = new Node(`node-${i}`)
    newNodes.push(node);
  }
  return newNodes;
}

// Load Keys
const file = fs.readFileSync(path.join(__dirname, '../keys.json'), 'utf8');
const keys: string[] = JSON.parse(file);

// Assign 10000 keys to nodes, expanding by 5 nodes
for (let i = 5; i <= 100; i += 5) {
  let nodes: Node[] = generateNodes(i);
  console.time(`Nodes-${i}`);
  keys.forEach(key => {
    const node = RendezvousHash.assignNode(nodes, key);
  });
  console.timeEnd(`Nodes-${i}`);
}


