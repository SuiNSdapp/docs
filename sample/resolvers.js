import get from 'lodash/get';

const PACKAGE_ADDRESS = process.env.REACT_APP_PACKAGE_ADDRESS;
const REGISTRY_ADDRESS = process.env.REACT_APP_REGISTRY_ADDRESS;
const SENDER = '0x01'; // Replace this with a valid SUI address
const DEV_INSPECT_RESULT_PATH = 'results.Ok[0][1].returnValues[0][0]';
const DEV_INSPECT_RESULT_PATH_1 = 'results.Ok[0][1].returnValues[1][0]';

const suiProvider = new JsonRpcProvider(process.env.REACT_APP_FULL_NODE_URL);

const toHexString = (byteArray) =>
  byteArray?.length > 0 ? Array.from(byteArray, (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join('') : '';

const toString = (byteArray) =>
  byteArray?.length > 0 ? new TextDecoder().decode(Buffer.from(byteArray.slice(1)).buffer) : '';

const trimAddress = (address) => String(address?.match(/0x0{0,}([\w\d]+)/)?.[1]);

const toFullAddress = (trimmedAddress) =>
  trimmedAddress
    ? `0x${Array(40 - trimmedAddress.length)
        .fill(0)
        .join('')}${trimmedAddress}`
    : '';

export const getName = async (address, sender = SENDER) => {
  const resolverBytes = get(
    await suiProvider.devInspectMoveCall(sender, {
      packageObjectId: PACKAGE_ADDRESS,
      module: 'base_registry',
      function: 'get_record_by_key',
      typeArguments: [],
      arguments: [REGISTRY_ADDRESS, `${trimAddress(address)}.addr.reverse`],
    }),
    DEV_INSPECT_RESULT_PATH_1,
  );
  if (!resolverBytes) return '';

  const resolver = toFullAddress(toHexString(resolverBytes));
  const name = toString(
    get(
      await suiProvider.devInspectMoveCall(sender, {
        packageObjectId: PACKAGE_ADDRESS,
        module: 'resolver',
        function: 'name',
        typeArguments: [],
        arguments: [resolver, address],
      }),
      DEV_INSPECT_RESULT_PATH,
    ),
  );
  return name;
};

export const getAddress = async (domain, sender = SENDER) => {
  const resolverBytes = get(
    await suiProvider.devInspectMoveCall(sender, {
      packageObjectId: PACKAGE_ADDRESS,
      module: 'base_registry',
      function: 'get_record_by_key',
      typeArguments: [],
      arguments: [REGISTRY_ADDRESS, domain],
    }),
    DEV_INSPECT_RESULT_PATH_1,
  );
  if (!resolverBytes) return '';

  const resolver = toFullAddress(toHexString(resolverBytes));
  const addr = get(
    await suiProvider.devInspectMoveCall(sender, {
      packageObjectId: PACKAGE_ADDRESS,
      module: 'resolver',
      function: 'addr',
      typeArguments: [],
      arguments: [resolver, domain],
    }),
    DEV_INSPECT_RESULT_PATH,
  );
  return addr?.every((e) => !e) ? '' : toFullAddress(toHexString(addr));
};
