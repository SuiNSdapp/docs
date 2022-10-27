# Controller Contract

[Source](https://github.com/SuiNSdapp/SuiNS-C/blob/main/sources/controller/base_controller.move)

## Public functions can be called anywhere

### Make commitment

```text
public entry fun make_commitment_and_commit(controller: &mut BaseController, commitment: vector<u8>, ctx: &mut TxContext);
```

Parameters:

- controller: address of `BaseController` share object
- commitment: commitment bytes

Register for a name requires 2 steps, this is the first step to make commitment to buy a domain. Refer to this sample [commitment.js](../sample/commitment.js) to see how to generate commitment.
This function opens for everyone.

### Register

```text
public entry fun register(controller: &mut BaseController, registrar: &mut BaseRegistrar, registry: &mut Registry, config: &Configuration, label: vector<u8>, owner: address, duration: u64, secret: vector<u8>, payment: &mut Coin<SUI>, ctx: &mut TxContext);
```

Parameters:

- controller: address of `BaseController` share object
- registrar: address of `BaseRegistrar` share object
- registry: address of `Registry` share object
- config: address of `Configuration` share object
- label: label of domain, e.g. `suins`
- owner: owner of the domain
- duration: register duration in epoch
- secret: the secret string used to make commitment in the first transaction
- payment: coin object used to pay for the domain registration

Final step to register for a domain, this will add a new record into `Registry`, mints a new `RegistrationNFT` NFT represents for the owner of the domain and sends it to `owner` (anyone holds this NFT can claim for domain ownership).
This function opens for everyone.

Error codes:

- 311: invalid label ~ Name should have between 3 to 63 characters and contain only: lowercase (a-z), numbers (0-9), hyphen (-). A name may not start or end with a hyphen.
- 305: insufficient balance.
- 302: commitment does not exist (make commitment required before calling register).
- 308: domain is not available.
- 206: invalid duration.

Emits the following event:

```text
struct NameRegisteredEvent has copy, drop {
  node: String,
  label: String,
  owner: address,
  cost: u64,
  expiry: u64,
  nft_id: ID,
  resolver: address,
}
```

### Register with custom resolver

```text
public entry fun register(controller: &mut BaseController, registrar: &mut BaseRegistrar, registry: &mut Registry, config: &Configuration, label: vector<u8>, owner: address, duration: u64, secret: vector<u8>, resolver: address, payment: &mut Coin<SUI>, ctx: &mut TxContext);
```

Refers to `register` function. This function allows registering with custom resolver (does not use default).

### Renew

```text
public entry fun renew(controller: &mut BaseController, registrar: &mut BaseRegistrar, label: vector<u8>, duration: u64, payment: &mut Coin<SUI>, ctx: &mut TxContext)
```

Parameters:

- controller: address of `BaseController` share object
- registrar: address of `BaseRegistrar` share object
- label: label of domain, e.g. `suins`
- duration: renew duration in epoch

Renews for a domain.
This function opens for everyone even not the owner of the name can call this method but only domain's expiry will be updated ownership stays as-is.

Error codes:

- 305: insufficient balance.
- 207: domain not exist.
- 205: domain expired - this method can be called anytime before expired time + grace period (90 epoches).

Emits the following event:

```text
struct NameRenewedEvent has copy, drop {
  label: String,
  expiry: u64,
}
```

### Withdraw registering funds

```text
public entry fun withdraw(_: &AdminCap, controller: &mut BaseController, ctx: &mut TxContext)
```

Parameters:

- admin_cap: address of `AdminCap` owned object
- controller: address of `BaseController` share object

Withdraw registering funds and transfer to caller.
Only callable by the address holds `AdminCap` NFT.

Error codes:

- 310: no funds to withdraw.

### Set default resolver

```text
public entry fun set_default_resolver(_: &AdminCap, controller: &mut BaseController, resolver: address)
```

Parameters:

- admin_cap: address of `AdminCap` owned object
- controller: address of `BaseController` share object
- resolver: address of new default resolver

Sets default resolver for all registrations.
Only callable by the address holds `AdminCap` NFT.

Emits the following event:

```text
struct DefaultResolverChangedEvent has copy, drop {
  resolver: address,
}
```
