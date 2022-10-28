# Registry

[Source](https://github.com/SuiNSdapp/SuiNS-C/tree/main/sources/registry)

A single source of truth maintaining a list of names recording the owner, resolver, and TTL for each, and allows the owner of a domain to make changes to that data.

## Public functions can be called anywhere
### Set subdomain owner

```text
public entry fun set_subnode_owner(registry: &mut Registry, node: vector<u8>, label: vector<u8>, owner: address, ctx: &mut TxContext)
```
Parameters:
- registry: address of `Registry` share object
- node: domain name, e.g. `suins.sui`
- label: label for subdomain, e.g. `sub-name` (the domain to be set will be `sub-name.suins.sui`)
- owner: new owner address of the subdomain
- ctx: is automatically filled in by the network

Allows owner of a name to reassigns ownership of the `subdomain` identified by `node` and `label` to new `owner`.
Only callable by the current owner of the `node`.
Both `domain` (e.g. `suins.sui`) and `subdomain` (e.g. `sub-name.suins.sui`) must exist in the `Registry` beforehand.

Error codes:
- vec_map::1: `domain` or `subdomain` doesn't exist in the `Registry`
- base_registry::101: `sender` isn't the owner of `node`

Emits the following event:

```text
struct NewOwnerEvent has copy, drop {
    node: String,
    owner: address,
};
where "node" is the full domain (e.g. "sub-name.suins.sui")
```

### Set domain owner

```text
public entry fun set_owner(registry: &mut Registry, node: vector<u8>, owner: address, ctx: &mut TxContext)
```
Parameters:
- registry: address of `Registry` share object
- node: domain name, e.g. `suins.sui`
- owner: new owner address of the domain
- ctx: is automatically filled in by the network

Reassigns ownership of the `domain` identified by `node` to `owner`.
Only callable by the current owner of the `node`.
`Domain` (e.g. `suins.sui`) must exist in the `Registry` beforehand.

Error codes:
- vec_map::1: `node` doesn't exist in the `Registry`
- base_registry::101: `sender` isn't the owner of `node`

Emits the following event:

```text
struct NewOwnerEvent has copy, drop {
    node: String,
    owner: address,
};
where "node" is the domain (e.g. "suins.sui")
```

### Set resolver

```text
public entry fun set_resolver(registry: &mut Registry, node: vector<u8>, resolver: address, ctx: &mut TxContext)
```

Parameters:
- registry: address of `Registry` share object
- node: domain name, e.g. `suins.sui`
- resolver: new resolver address of the domain
- ctx: is automatically filled in by the network

Updates the resolver associated with the domain identified by `node` to `resolver`.
Only callable by the current owner of the `node`. `resolver` must specify the address of a resolver shared object.
`Domain` (e.g. `suins.sui`) must exist in the `Registry` beforehand.

Error codes:
- vec_map::1: `node` doesn't exist in the `Registry`
- base_registry::101: sender isn't the owner of `node`

Emits the following event:

```text
struct NewResolverEvent has copy, drop {
    node: String,
    resolver: address,
}
where "node" is the domain (e.g. "suins.sui")
```

### Set TTL

```text
public entry fun set_TTL(registry: &mut Registry, node: vector<u8>, ttl: u64, ctx: &mut TxContext)
```

Parameters:
- registry: address of `Registry` share object
- node: domain name, e.g. `suins.sui`
- ttl: time-to-live of name identified by `node`
- ctx: is automatically filled in by the network

Updates the caching time-to-live of the name identified by `node`.
Only callable by the current owner of the `node`.
`Domain` (e.g. `suins.sui`) must exist in the `Registry` beforehand.

Error codes:
- vec_map::1: `node` doesn't exist in the `Registry`
- base_registry::101: sender isn't the owner of `node`

Emits the following event:

```text
struct NewTTLEvent has copy, drop {
    node: String,
    ttl: u64,
}
where "node" is the domain (e.g. "suins.sui")
```

## Public functions can only be called within Sui smart contract
### Get Owner

```text
public fun owner(registry: &Registry, node: vector<u8>): address
```
Parameters:
- registry: address of `Registry` share object
- node: domain name, e.g. suins.sui

Returns the owner address of the domain specified by `node`.

Error codes:
- vec_map::1: `node` doesn't exist in the `Registry`

### Get Resolver

```text
public fun resolver(registry: &Registry, node: vector<u8>): address
```
Parameters:
- registry: address of `Registry` share object
- node: domain name, e.g. suins.sui

Returns the address of the resolver responsible for the name specified by `node`.

Error codes:
- vec_map::1: `node` doesn't exist in the `Registry`

### Get TTL

```text
public fun ttl(registry: &Registry, node: vector<u8>): u64
```
Parameters:
- registry: address of `Registry` share object
- node: domain name, e.g. suins.sui

Returns the caching time-to-live of the name specified by `node`.

Error codes:
- vec_map::1: `node` doesn't exist in the `Registry`
