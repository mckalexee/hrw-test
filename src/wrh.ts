import * as crypto from 'crypto';
import { Buffer } from 'buffer';

const murmurHash128x64 = require('murmurhash-native').murmurHash128x64;


export class Node {
  private _name: string;
  private _seed: number;
  private _weight: number;

  constructor(name: string, weight = 100) {
    this._name = name;
    this._weight = weight;
  }

  /** Returns a "score" based on the hash, which is essentailly a buffer of the hash */
  computeWeightedScore(key: string) {
    const hash: Buffer = murmurHash128x64( `${this._name}-${key}`, 'buffer');
    return hash;
  }

  toString() {
    return JSON.stringify({
      name: this._name
    });
  }

  get name() { return this._name; }
}

export class RendezvousHash {
  /** Picks a node based on who has the highest hash */
  static assignNode(nodes: Node[], key) {
    // Start with the first node as having the max score
    let maxIndex = 0;
    let maxScore = nodes[0].computeWeightedScore(key);

    // Loop through the remaining nodes and adjust where nessecary
    for (let i = 1; i < nodes.length; i++) {
      const score = nodes[i].computeWeightedScore(key);
      if (Buffer.compare(maxScore, score) < 0) {
        maxIndex = i;
        maxScore = score;
      }
    }
    // Send the max in
    return nodes[maxIndex];
  }

  /** Implementation with promises */
  static async assignNodeAsync(nodes: Node[], key) {
    return new Promise<Node>((resolve, reject) => {
      resolve(this.assignNode(nodes, key));
    });
  }


}

