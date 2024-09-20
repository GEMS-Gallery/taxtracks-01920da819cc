import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Nat "mo:base/Nat";

actor TaxPayerManager {
  public type TaxPayer = {
    tid: Text;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  private stable var taxPayerEntries : [(Text, TaxPayer)] = [];
  private var taxPayers = HashMap.HashMap<Text, TaxPayer>(0, Text.equal, Text.hash);

  system func preupgrade() {
    taxPayerEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayers := HashMap.fromIter<Text, TaxPayer>(taxPayerEntries.vals(), 0, Text.equal, Text.hash);
  };

  public func addTaxPayer(tid: Text, firstName: Text, lastName: Text, address: Text) : async Result.Result<(), Text> {
    if (Text.size(tid) == 0 or Text.size(firstName) == 0 or Text.size(lastName) == 0 or Text.size(address) == 0) {
      return #err("All fields are required");
    };
    
    switch (taxPayers.get(tid)) {
      case (null) {
        let newTaxPayer : TaxPayer = {
          tid = tid;
          firstName = firstName;
          lastName = lastName;
          address = address;
        };
        taxPayers.put(tid, newTaxPayer);
        #ok()
      };
      case (?_) {
        #err("TaxPayer with this TID already exists")
      };
    }
  };

  public query func getAllTaxPayers(start: Nat, limit: Nat) : async {items: [TaxPayer]; total: Nat} {
    let allTaxPayers = Iter.toArray(taxPayers.vals());
    let total = allTaxPayers.size();
    let paginatedItems = Array.subArray(allTaxPayers, start, Nat.min(limit, total - start));
    {items = paginatedItems; total = total}
  };

  public query func searchTaxPayer(tid: Text) : async Result.Result<TaxPayer, Text> {
    switch (taxPayers.get(tid)) {
      case (null) { #err("TaxPayer not found") };
      case (?taxPayer) { #ok(taxPayer) };
    }
  };

  public query func searchTaxPayersByName(searchQuery: Text) : async [TaxPayer] {
    let lowerQuery = Text.toLowercase(searchQuery);
    Array.filter<TaxPayer>(Iter.toArray(taxPayers.vals()), func (tp: TaxPayer) : Bool {
      Text.contains(Text.toLowercase(tp.firstName), #text lowerQuery) or
      Text.contains(Text.toLowercase(tp.lastName), #text lowerQuery)
    })
  };
}
