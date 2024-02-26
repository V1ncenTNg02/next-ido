import { ethers } from 'ethers'
import keccak256 from 'keccak256'
import { MerkleTree } from 'merkletreejs'

export class MerkleTreeService {
  addresses: string[]
  tree: any

  constructor(addresses: string[]) {
    this.addresses = addresses
  }

  encodeAddress(address: string) {
    return keccak256(ethers.utils.defaultAbiCoder.encode(['address'], [address]))
  }

  createTree() {
    const leaves = this.addresses.map(addr => this.encodeAddress(addr))
    this.tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
    return this.tree
  }

  getRoot() {
    return `0x${this.tree.getRoot().toString('hex')}`
  }

  checkWhitelist(addressToVerify: string) {
    const leafToVerify = this.encodeAddress(addressToVerify)
    const proof = this.tree.getHexProof(leafToVerify)
    return this.tree.verify(proof, leafToVerify, this.tree.getRoot())
  }

  generateProof(addressToVerify: string) {
    const leafToVerify = this.encodeAddress(addressToVerify)
    return this.tree.getHexProof(leafToVerify)
  }
}
