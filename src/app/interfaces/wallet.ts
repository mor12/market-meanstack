export interface IWallet {
    _id?: string;
    type?: string;
    quantity?: number;
    after?: number;
    before?: number;
    reason?: string;
    createdAt?: Date;
}