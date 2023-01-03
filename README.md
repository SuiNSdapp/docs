# SuiNS

SuiNS is a distributed naming system based on the Sui blockchain built with a set of smart contracts.

## Architecture

```mermaid
flowchart TB
 name1-->resolver1
 name2-->resolver1
 reverse-->resolver2

 subgraph Resolvers
  resolver1
  resolver2
 end
 subgraph SuiNS Registry
  name1{{a-name.sui}}
  name2{{another-name.sui}}
  reverse{{1234....addr.reverse}}
 end
```

## Lookup for name

```mermaid
sequenceDiagram
Alice ->> SuiNS Registry: resolver('a-name.sui')?
Note right of SuiNS Registry: find the resolver value<br/> of coresponding name in the<br/> registry shared object.

SuiNS Registry ->> Alice: 0x1234...
Alice ->> Resolver@0x1234...: addr('a-name.sui')?
Note right of Resolver@0x1234...: resolver is also a shared object.
Note  over Alice,Resolver@0x1234...: find the address value<br/> of coresponding name in the<br/> resolver shared object.
Resolver@0x1234... ->> Alice: 0xf0f0...
```

## Lookup for default name

```mermaid
sequenceDiagram
Alice ->> SuiNS Registry: resolver('f0f0....addr.reverse')?
Note  over Alice,SuiNS Registry: address is a special name<br/> served for default name lookup.
Note right of SuiNS Registry: find the resolver value<br/> of coresponding name in the<br/> registry shared object.

SuiNS Registry ->> Alice: 0x9876...
Alice ->> Resolver@0x9876...: name('f0f0....addr.reverse')?
Note  over Alice,Resolver@0x9876...: find the name value of coresponding address <br/> in the resolver shared object.
Resolver@0x9876... ->> Alice: a-name.sui
Note  over Alice,Resolver@0x9876...: double check if a-name.sui is default name of f0f0... <br> by looking up the registry again to see if f0f0... own the name.
Alice ->> SuiNS Registry: does f0f0.... own a-name.sui?
```

## Contracts

On the contract publishing event, a `AdminCap` NFT is mint to the deployer address and transferable to anyone - only address holding this NFT can call admin features.

### Current contracts/objects:

- Package address: [0x501856c85fd4dc103b38c5d57df18923f16998c3](https://explorer.devnet.sui.io/objects/0x501856c85fd4dc103b38c5d57df18923f16998c3)
- Registry object: [0x2b59d1b740f3e4397caedbe18d8979ad51b7be8d](https://explorer.devnet.sui.io/objects/0x2b59d1b740f3e4397caedbe18d8979ad51b7be8d)
- Address resolver object [0x1c64a22e3253eeece53ea751f6ef85aff01869ad](https://explorer.devnet.sui.io/objects/0x1c64a22e3253eeece53ea751f6ef85aff01869ad)
- Name resolver object: [0x04ba2a83a578d9b233a6bff3c79e62815b295e56](https://explorer.devnet.sui.io/objects/0x04ba2a83a578d9b233a6bff3c79e62815b295e56)
- Configuration object: [0x7a7a3f2eb8a19389d68cfff0465f128f97953c8e](https://explorer.devnet.sui.io/objects/0x7a7a3f2eb8a19389d68cfff0465f128f97953c8e)

#### Registry

A single source of truth maintaining a list of names records the owner, resolver, and TTL for each, and allows the owner of a domain to make changes to that data.

All SuiNS lookups start by querying the registry.

More details: [Registry Contract](./contracts/registry.md)

#### Registrar

Contains the core functionality of the permanent registrar.

More details: [Registrar Contract](./contracts/registrar.md)

#### Controller

Built on top of the registrar contract containing logics for name validation, prevent frontrunning. This is the entry point for registering a new name. The contract also maintains funds collected from name purchases, only address holds the SuiNS Admin NFT can withdraw the funds.

More details: [Controller Contract](./contracts/controller.md).

#### Resolver

Implements a general-purpose SuiNS resolver that is suitable for standard SuiNS use-cases (allowing user to set data for the name, e.g: address, name, etc).

More details: [Resolver Contract](./contracts/resolver.md).

## Interact with contract

To buy a name, it requires 2 smart contract calls:

- check sample [commitment.cjs](./sample/commitment.cjs).

```bash

PACKAGE_ADDR=
SUI_REGISTRAR=
​
BASE_CONTROLLER=
REGISTRY=
// first value of: `sui client addresses`
OWNER_ADDR=

SECRET='random string'
DOMAIN_NAME='a-name'
SUI_DOMAIN_NAME="$DOMAIN_NAME.sui"

COIN_ADDRESS=

// generate commitment
SUI_COMMITMENT=$(node ./sample/commitment.cjs $SUI_DOMAIN_NAME $OWNER_ADDR $SECRET);

// first transaction: make commitment to buy a name
sui client call --package $PACKAGE_ADDR --module base_controller \
    --function make_commitment_and_commit \
    --args $BASE_CONTROLLER $SUI_COMMITMENT --gas-budget 20000

// final transaction: actual request to buy the name
sui client call --package $PACKAGE_ADDR --module base_controller \
    --function register \
    --args $BASE_CONTROLLER $SUI_REGISTRAR $REGISTRY $CONFIGURATION $DOMAIN_NAME \
    $OWNER_ADDR 365 $SECRET $COIN_ADDRESS --gas-budget 20000
```

For details full open functions of our smart contracts, let's explore in each contract document itself.

---
