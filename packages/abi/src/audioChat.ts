export const audioChatABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'audioEventId', type: 'bytes32' },
      { indexed: false, internalType: 'enum AudioChat.stateOptions', name: 'newState', type: 'uint8' },
    ],
    name: 'handleAudioChatStateChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'eventTimestamp', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'createdAt', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'cid_metadata', type: 'string' },
      { indexed: false, internalType: 'enum AudioChat.stateOptions', name: 'currentState', type: 'uint8' },
    ],
    name: 'handleNewAudioChat',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'audioEventId', type: 'bytes32' },
      { indexed: false, internalType: 'string', name: 'newCid', type: 'string' },
    ],
    name: 'handleUpdateMetadataCID',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'addressToAudioChat',
    outputs: [
      { internalType: 'bytes32', name: 'audioEventId', type: 'bytes32' },
      { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
      { internalType: 'string', name: 'cid_metadata', type: 'string' },
      { internalType: 'enum AudioChat.stateOptions', name: 'state', type: 'uint8' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'eventTimestamp', type: 'uint256' },
      { internalType: 'uint256', name: 'listAddressIndex', type: 'uint256' },
      { internalType: 'uint256', name: 'listStateIndex', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'eventTimestamp', type: 'uint256' },
      { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
      { internalType: 'string', name: 'cid_metadata', type: 'string' },
      { internalType: 'address', name: 'creator', type: 'address' },
    ],
    name: 'createNewAudioChat',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllOwnedIds',
    outputs: [{ internalType: 'bytes32[]', name: '', type: 'bytes32[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'id', type: 'bytes32' }],
    name: 'getAudioChatById',
    outputs: [
      { internalType: 'bytes32', name: 'audioEventId', type: 'bytes32' },
      { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
      { internalType: 'uint256', name: 'eventTimestamp', type: 'uint256' },
      { internalType: 'string', name: 'cid_metadata', type: 'string' },
      { internalType: 'enum AudioChat.stateOptions', name: 'state', type: 'uint8' },
      { internalType: 'address', name: 'creator', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'creator', type: 'address' }],
    name: 'getAudioChatsByAdress',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'audioEventId', type: 'bytes32' },
          { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
          { internalType: 'string', name: 'cid_metadata', type: 'string' },
          { internalType: 'enum AudioChat.stateOptions', name: 'state', type: 'uint8' },
          { internalType: 'address', name: 'creator', type: 'address' },
          { internalType: 'uint256', name: 'eventTimestamp', type: 'uint256' },
          { internalType: 'uint256', name: 'listAddressIndex', type: 'uint256' },
          { internalType: 'uint256', name: 'listStateIndex', type: 'uint256' },
        ],
        internalType: 'struct AudioChat.CreateAudioChat[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'enum AudioChat.stateOptions[]', name: 'options', type: 'uint8[]' }],
    name: 'getAudioChatsByState',
    outputs: [
      {
        components: [
          { internalType: 'bytes32', name: 'audioEventId', type: 'bytes32' },
          { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
          { internalType: 'string', name: 'cid_metadata', type: 'string' },
          { internalType: 'enum AudioChat.stateOptions', name: 'state', type: 'uint8' },
          { internalType: 'address', name: 'creator', type: 'address' },
          { internalType: 'uint256', name: 'eventTimestamp', type: 'uint256' },
          { internalType: 'uint256', name: 'listAddressIndex', type: 'uint256' },
          { internalType: 'uint256', name: 'listStateIndex', type: 'uint256' },
        ],
        internalType: 'struct AudioChat.CreateAudioChat[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'idToAudioChat',
    outputs: [
      { internalType: 'bytes32', name: 'audioEventId', type: 'bytes32' },
      { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
      { internalType: 'string', name: 'cid_metadata', type: 'string' },
      { internalType: 'enum AudioChat.stateOptions', name: 'state', type: 'uint8' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'eventTimestamp', type: 'uint256' },
      { internalType: 'uint256', name: 'listAddressIndex', type: 'uint256' },
      { internalType: 'uint256', name: 'listStateIndex', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'enum AudioChat.stateOptions', name: 'newChangedState', type: 'uint8' },
      { internalType: 'bytes32', name: 'audioChatId', type: 'bytes32' },
    ],
    name: 'stateChanged',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'enum AudioChat.stateOptions', name: '', type: 'uint8' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'stateToAudioChat',
    outputs: [
      { internalType: 'bytes32', name: 'audioEventId', type: 'bytes32' },
      { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
      { internalType: 'string', name: 'cid_metadata', type: 'string' },
      { internalType: 'enum AudioChat.stateOptions', name: 'state', type: 'uint8' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'eventTimestamp', type: 'uint256' },
      { internalType: 'uint256', name: 'listAddressIndex', type: 'uint256' },
      { internalType: 'uint256', name: 'listStateIndex', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
