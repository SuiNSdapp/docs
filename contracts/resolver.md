# Resolver Contract

[Source](https://github.com/SuiNSdapp/SuiNS-C/blob/main/sources/resolver/resolver.move)

Implements a general-purpose SuiNS resolver that is suitable for standard SuiNS use-cases (allowing user to set data for the name, e.g: address, name, etc).

## Public functions can be called anywhere

### Set address

```text
public entry fun set_addr(base_resolver: &mut BaseResolver, registry: &Registry, node: vector<u8>, addr: address, ctx: &mut TxContext)
```

Parameters:

- base_resolver: address of `BaseResolver` share object
- registry: address of `Registry` share object
- node: domain name, e.g. `suins.sui`
- addr: new address to be set for `node`

Set new address for `node`. 
Only callable by the current owner of the `node`.
`domain` (e.g. `suins.sui`) must exist in the `Registry` beforehand.

Emits the following event:

```text
struct AddressChangedEvent has copy, drop {
    node: String,
    addr: address,
}
```

### Set default name

```text
public entry fun set_name(name_resolver: &mut NameResolver, registry: &Registry, addr: address, name: vector<u8>, ctx: &mut TxContext)
```

Parameters:

- name_resolver: address of `NameResolver` share object
- registry: address of `Registry` share object
- addr: address to be set new default name
- name: new default name

Set new default name for `addr`.
Only callable by the current owner of the `reverse domain` identified by `addr`.
`reverse domain` (e.g. `123af.addr.reverse`) must exist in the `Registry` beforehand.

Emits the following event:

```text
struct NameChangedEvent has copy, drop {
    addr: address,
    name: String,
}
```

### Unset default name

```text
public entry fun unset_name(name_resolver: &mut NameResolver, registry: &Registry, addr: address, ctx: &mut TxContext)
```

Parameters:

- name_resolver: address of `NameResolver` share object
- registry: address of `Registry` share object
- addr: address to be unset default name

Remove default name for `addr`.
Only callable by the current owner of the `reverse domain` identified by `addr`.
`reverse domain` (e.g. `123af.addr.reverse`) must exist in the `Registry` beforehand.

Emits the following event:

```text
struct NameRemovedEvent has copy, drop {
    addr: address,
}
```

## Public functions can only be called within Sui smart contract

### Get address that is set for a domain name

```text
public fun addr(base_resolver: &BaseResolver, node: vector<u8>): String
```

Parameters:

- base_resolver: address of `BaseResolver` share object
- node: domain name, e.g. `suins.sui`

Returns the address for `domain name`.
This function is open to everyone.

Error codes:
- vec_map::1: `node` hasn't set address

### Get default name that is set for a address

```text
public fun name(name_resolver: &NameResolver, addr: address): String
```

Parameters:

- name_resolver: address of `NameResolver` share object
- addr: address that you want to find its default name

Returns the default name for `addr`.
This function is open to everyone.

Error codes:
- vec_map::1: `addr` hasn't set default name
