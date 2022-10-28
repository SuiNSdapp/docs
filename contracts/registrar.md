# Registrar

Core functionality of the permanent registrar.

# Base registrar
[Source](https://github.com/SuiNSdapp/SuiNS-C/blob/main/sources/registrar/base_registrar.move)
## Public functions can be called anywhere
### Set new top-level domain (TLD)

```text
public entry fun new_tld(admin_cap: &AdminCap, tlds_list: &mut TLDsList, tld: vector<u8>, ctx: &mut TxContext)
```
Parameters:
- admin_cap: address of `AdminCap` owned object
- tlds_list: address of `TLDsList` share object
- tld: new TLD to be added
- ctx: is automatically filled in by the network

Creates a new top level domain like `sui` and `move`.
Only callable by the address holds AdminCap NFT.

Error codes:
- string::1: `tld` isn't a valid UTF8 string
- base_registrar::208: `tld` existed

### Reclaim domain

```text
public entry fun reclaim_by_nft_owner(registrar: &BaseRegistrar, registry: &mut Registry, nft: &RegistrationNFT, owner: address, ctx: &mut TxContext)
```
Parameters:
- registrar: address of `BaseRegistrar` share object
- registry: address of `Registry` share object
- nft: address of NFT representing domain ownership
- owner: new owner address of the domain
- ctx: this param is automatically filled in by the network

Allows owner of the name (address holds name NFT) to claim ownership of given name (update owner in `registry`).
Only callable by the address holds name NFT.

Error codes:
- vec_map::1: NFT domain doesn't exist in the `Registry`
- base_registrar::205: NFT expired
- base_registrar::207: NFT domain doesn't exist in `BaseRegistrar`
- base_registrar::209: NFT domain doesn't match `BaseRegistrar::base_node`

Emits the following event:

```text
struct NameReclaimedEvent has copy, drop {
    node: String,
    owner: address,
}
where "node" is the NFT domain
```

## Public functions can only be called within Sui smart contract
### Check domain availability

```text
public fun available(registrar: &BaseRegistrar, label: String, ctx: &TxContext): bool
```
Parameters:
- registrar: address of `BaseRegistrar` share object
- label: label of domain to be checked, e.g. `suins`
- ctx: this param is automatically filled in by the network

Returns availability status of the `domain` identified by `label` and `BaseRegistrar::base_node` (top level domain generated in `new_tld` function call).

### Get expiry time of a domain

```text
public fun name_expires(registrar: &BaseRegistrar, label: String): u64
```
Parameters:
- registrar: address of `BaseRegistrar` share object
- label: label of domain to be checked, e.g. `suins`

Returns expiry time of the `domain` identified by `label` and `BaseRegistrar::base_node` (top level domain generated in `new_tld` function call). 
Returns 0 for any non-existent domain. 

### Check if a domain exists

```text
public fun record_exists(registrar: &BaseRegistrar, label: String): bool
```
Parameters:
- registrar: address of `BaseRegistrar` share object
- label: label of domain to be checked, e.g. `suins`

Returns existence status of the `domain` identified by `label` and `BaseRegistrar::base_node` (top level domain generated in `new_tld` function call).

# Reverse Registrar
[Source](https://github.com/SuiNSdapp/SuiNS-C/blob/main/sources/registrar/reverse_registrar.move)
## Public functions can be called anywhere
### Set default resolver

```text
public entry fun set_default_resolver(_: &AdminCap, registrar: &mut ReverseRegistrar, resolver: address)
```

Parameters:

- admin_cap: address of `AdminCap` owned object
- registrar: address of `ReverseRegistrar` share object
- resolver: address of new default resolver

Sets default resolver for setting default name.
Only callable by the address holds `AdminCap` NFT.

Emits the following event:

```text
struct DefaultResolverChangedEvent has copy, drop {
  resolver: address,
}
```

### Claim reverse domain

```text
public entry fun claim(registrar: &mut ReverseRegistrar, registry: &mut Registry, owner: address, ctx: &mut TxContext) {
```

Parameters:

- registrar: address of `ReverseRegistrar` share object
- registry: address of `Registry` share object
- owner: owner of the reverse domain

Set default domain for an address requires 2 steps. 
This is the first step to register for a `reverse domain`. Any `reverse domain` has the form `<sender_address>.addr.reverse`.
This function is open to everyone.

Note: This step is only need to be called once for any sender address, calling it more than once will change `owner`.  

Emits the following event:

```text
struct ReverseClaimedEvent has copy, drop {
    addr: address,
    resolver: address,
}
```

### Claim reverse domain with custom resolver

```text
public entry fun claim_with_resolver(registry: &mut Registry, owner: address, resolver: address, ctx: &mut TxContext)
```

Refers to `claim` function. This function allows claiming with custom resolver (does not use default).
