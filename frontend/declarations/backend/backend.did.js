export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const TaxPayer = IDL.Record({
    'tid' : IDL.Text,
    'address' : IDL.Text,
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : TaxPayer, 'err' : IDL.Text });
  return IDL.Service({
    'addTaxPayer' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'getAllTaxPayers' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Record({ 'total' : IDL.Nat, 'items' : IDL.Vec(TaxPayer) })],
        ['query'],
      ),
    'searchTaxPayer' : IDL.Func([IDL.Text], [Result], ['query']),
    'searchTaxPayersByName' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(TaxPayer)],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
