export const audioChatABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'audio_event_id', type: 'bytes32' },
      { indexed: false, internalType: 'enum AudioChat.stateOptions', name: 'new_state', type: 'uint8' },
    ],
    name: 'handleAudioChatChangedState',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'audio_event_id', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'start_at', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'created_at', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'cid_metadata', type: 'string' },
      { indexed: false, internalType: 'enum AudioChat.stateOptions', name: 'current_state', type: 'uint8' },
    ],
    name: 'handleNewAudioChat',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'bytes32', name: 'audio_event_id', type: 'bytes32' },
      { indexed: false, internalType: 'string', name: 'new_cid', type: 'string' },
    ],
    name: 'handleUpdateMetadataCID',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'address_to_audio_chat',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'enum AudioChat.stateOptions', name: 'new_changed_state', type: 'uint8' },
      { internalType: 'bytes32', name: 'audio_chat_id', type: 'bytes32' },
    ],
    name: 'changeState',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'start_at', type: 'uint256' },
      { internalType: 'uint256', name: 'created_at', type: 'uint256' },
      { internalType: 'string', name: 'cid_metadata', type: 'string' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'bool', name: 'is_indexed', type: 'bool' },
    ],
    name: 'createNewAudioChat',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'audio_event_id', type: 'bytes32' }],
    name: 'deleteTheAudioChat',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'id', type: 'bytes32' }],
    name: 'getAudioChatById',
    outputs: [
      { internalType: 'bytes32', name: 'audio_event_id', type: 'bytes32' },
      { internalType: 'uint256', name: 'created_at', type: 'uint256' },
      { internalType: 'uint256', name: 'start_at', type: 'uint256' },
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
          { internalType: 'bytes32', name: 'audio_event_id', type: 'bytes32' },
          { internalType: 'uint256', name: 'created_at', type: 'uint256' },
          { internalType: 'string', name: 'cid_metadata', type: 'string' },
          { internalType: 'enum AudioChat.stateOptions', name: 'state', type: 'uint8' },
          { internalType: 'bool', name: 'is_indexed', type: 'bool' },
          { internalType: 'address', name: 'creator', type: 'address' },
          { internalType: 'uint256', name: 'start_at', type: 'uint256' },
          { internalType: 'bool', name: 'exists', type: 'bool' },
          { internalType: 'uint256', name: 'id_index', type: 'uint256' },
          { internalType: 'uint256', name: 'state_index', type: 'uint256' },
          { internalType: 'uint256', name: 'address_index', type: 'uint256' },
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
          { internalType: 'bytes32', name: 'audio_event_id', type: 'bytes32' },
          { internalType: 'uint256', name: 'created_at', type: 'uint256' },
          { internalType: 'string', name: 'cid_metadata', type: 'string' },
          { internalType: 'enum AudioChat.stateOptions', name: 'state', type: 'uint8' },
          { internalType: 'bool', name: 'is_indexed', type: 'bool' },
          { internalType: 'address', name: 'creator', type: 'address' },
          { internalType: 'uint256', name: 'start_at', type: 'uint256' },
          { internalType: 'bool', name: 'exists', type: 'bool' },
          { internalType: 'uint256', name: 'id_index', type: 'uint256' },
          { internalType: 'uint256', name: 'state_index', type: 'uint256' },
          { internalType: 'uint256', name: 'address_index', type: 'uint256' },
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
    name: 'id_to_audio_chat',
    outputs: [
      { internalType: 'bytes32', name: 'audio_event_id', type: 'bytes32' },
      { internalType: 'uint256', name: 'created_at', type: 'uint256' },
      { internalType: 'string', name: 'cid_metadata', type: 'string' },
      { internalType: 'enum AudioChat.stateOptions', name: 'state', type: 'uint8' },
      { internalType: 'bool', name: 'is_indexed', type: 'bool' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'start_at', type: 'uint256' },
      { internalType: 'bool', name: 'exists', type: 'bool' },
      { internalType: 'uint256', name: 'id_index', type: 'uint256' },
      { internalType: 'uint256', name: 'state_index', type: 'uint256' },
      { internalType: 'uint256', name: 'address_index', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'audio_event_id', type: 'bytes32' },
      { internalType: 'string', name: 'new_cid', type: 'string' },
      { internalType: 'uint256', name: 'start_at', type: 'uint256' },
    ],
    name: 'updateTheAudioChat',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
