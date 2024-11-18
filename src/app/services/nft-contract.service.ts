import { Injectable } from '@angular/core';
import { MetamaskService } from './metamask.service';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import NFTContractABI from '../../Contracts/CISI.json';

@Injectable({
  providedIn: 'root'
})
export class NFTContractService {
  private web3: Web3;
  private contract: any;
  private readonly CONTRACT_ADDRESS = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8';

  constructor(private metamaskService: MetamaskService) {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum as any);
      this.contract = new this.web3.eth.Contract(
        NFTContractABI.abi as AbiItem[],
        this.CONTRACT_ADDRESS
      );
    }
  }

  async createNFT(price: number) {
    const account = await this.metamaskService.getAccount();
    if (!account) {
      throw new Error('No se ha encontrado una cuenta conectada');
    }
    const priceWei = this.web3.utils.toWei(price.toString(), 'ether');
    return this.contract.methods.createNFT(priceWei).send({
      from: account
    });
  }

  async listNFTForSale(nftId: number, price: number) {
    const account = await this.metamaskService.getAccount();
    if (!account) {
      throw new Error('No se ha encontrado una cuenta conectada');
    }
    const priceWei = this.web3.utils.toWei(price.toString(), 'ether');
    return this.contract.methods.listNFTForSale(nftId, priceWei).send({
      from: account
    });
  }

  async withdrawNFTFromSale(nftId: number) {
    const account = await this.metamaskService.getAccount();
    if (!account) {
      throw new Error('No se ha encontrado una cuenta conectada');
    }
    return this.contract.methods.withdrawNFTFromSale(nftId).send({
      from: account
    });
  }

  async purchaseNFT(nftId: number, price: number) {
    const account = await this.metamaskService.getAccount();
    if (!account) {
      throw new Error('No se ha encontrado una cuenta conectada');
    }
    const priceWei = this.web3.utils.toWei(price.toString(), 'ether');
    return this.contract.methods.purchaseNFT(nftId).send({
      from: account,
      value: priceWei
    });
  }

  async withdrawFunds() {
    const account = await this.metamaskService.getAccount();
    if (!account) {
      throw new Error('No se ha encontrado una cuenta conectada');
    }
    return this.contract.methods.withdrawFunds().send({
      from: account
    });
  }

  async getUserNFTs(address: string) {
    return this.contract.methods.getUserNFTs(address).call();
  }

  async getNFTDetails(nftId: number) {
    return this.contract.methods.nfts(nftId).call();
  }

  async getBalance(address: string) {
    return this.contract.methods.balances(address).call();
  }
}
