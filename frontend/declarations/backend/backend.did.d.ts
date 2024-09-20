import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : TaxPayer } |
  { 'err' : string };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export interface TaxPayer {
  'tid' : string,
  'address' : string,
  'lastName' : string,
  'firstName' : string,
}
export interface _SERVICE {
  'addTaxPayer' : ActorMethod<[string, string, string, string], Result_1>,
  'getAllTaxPayers' : ActorMethod<
    [bigint, bigint],
    { 'total' : bigint, 'items' : Array<TaxPayer> }
  >,
  'searchTaxPayer' : ActorMethod<[string], Result>,
  'searchTaxPayersByName' : ActorMethod<[string], Array<TaxPayer>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
