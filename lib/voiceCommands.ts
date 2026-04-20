export interface VoiceCommand {
  pattern: RegExp | string;
  action: string;
  description: string;
  examples: string[];
}

export const VOICE_COMMANDS: VoiceCommand[] = [
  {
    pattern: /(?:i(?:'m| am)|feeling|i feel)\s+(energetic|pumped|hyped|excited|powerful)/i,
    action: 'SET_MOOD_ENERGETIC',
    description: 'Switch to Energetic mood',
    examples: ["I'm feeling energetic", 'I feel pumped', 'I am hyped'],
  },
  {
    pattern: /(?:i(?:'m| am)|feeling|i feel)\s+(calm|relaxed|peaceful|chill|zen)/i,
    action: 'SET_MOOD_CALM',
    description: 'Switch to Calm mood',
    examples: ["I'm calm", 'feeling relaxed', 'I feel peaceful'],
  },
  {
    pattern: /(?:i(?:'m| am)|feeling|i feel)\s+(focused|concentrating|working|productive)/i,
    action: 'SET_MOOD_FOCUSED',
    description: 'Switch to Focused mood',
    examples: ["I'm focused", 'need to concentrate', 'I feel productive'],
  },
  {
    pattern: /(?:i(?:'m| am)|feeling|i feel)\s+(happy|joyful|great|amazing|good)/i,
    action: 'SET_MOOD_HAPPY',
    description: 'Switch to Happy mood',
    examples: ["I'm happy", 'feeling great', 'I feel amazing'],
  },
  {
    pattern: /(?:i(?:'m| am)|feeling|i feel)\s+(tired|exhausted|sleepy|drained|fatigued)/i,
    action: 'SET_MOOD_TIRED',
    description: 'Switch to Tired mood',
    examples: ["I'm tired", 'feeling exhausted', 'I feel sleepy'],
  },
  {
    pattern: /(?:show|tell me about|what is)\s+(?:the\s+)?(?:x1\s+max|max)/i,
    action: 'SHOW_PRODUCT_X1_MAX',
    description: 'Show X1 Max product details',
    examples: ['show me the X1 Max', 'tell me about X1 Max', 'what is the Max'],
  },
  {
    pattern: /(?:show|tell me about|what is)\s+(?:the\s+)?(?:x1\s+pro|pro)/i,
    action: 'SHOW_PRODUCT_X1_PRO',
    description: 'Show X1 Pro product details',
    examples: ['show X1 Pro', 'tell me about the Pro'],
  },
  {
    pattern: /(?:show|tell me about|what is)\s+(?:the\s+)?x1(?!\s+(?:pro|max))/i,
    action: 'SHOW_PRODUCT_X1',
    description: 'Show X1 product details',
    examples: ['show the X1', 'what is X1'],
  },
  {
    pattern: /(?:turn on|enable|activate)\s+(?:bass(?:\s+boost)?)/i,
    action: 'SET_AUDIO_BASS',
    description: 'Activate Bass Boost mode',
    examples: ['turn on bass boost', 'enable bass', 'activate bass boost'],
  },
  {
    pattern: /(?:turn on|enable|activate)\s+(?:spatial|3d|surround)/i,
    action: 'SET_AUDIO_SPATIAL',
    description: 'Activate Spatial Audio mode',
    examples: ['enable spatial audio', 'turn on 3D sound'],
  },
  {
    pattern: /(?:turn on|enable|activate)\s+(?:anc|noise\s+cancell?ing?|noise\s+cancel)/i,
    action: 'SET_AUDIO_ANC',
    description: 'Activate Active Noise Cancellation',
    examples: ['turn on ANC', 'enable noise cancelling'],
  },
  {
    pattern: /(?:turn on|enable|activate)\s+studio/i,
    action: 'SET_AUDIO_STUDIO',
    description: 'Activate Studio mode',
    examples: ['enable studio mode', 'activate studio'],
  },
  {
    pattern: /(?:open|show|launch)\s+(?:assistant|ai|chat|help)/i,
    action: 'OPEN_ASSISTANT',
    description: 'Open the AI assistant',
    examples: ['open assistant', 'show chat', 'launch AI'],
  },
  {
    pattern: /(?:close|hide|dismiss)\s+(?:assistant|ai|chat)/i,
    action: 'CLOSE_ASSISTANT',
    description: 'Close the AI assistant',
    examples: ['close assistant', 'hide chat'],
  },
  {
    pattern: /(?:compare|comparison|vs|versus)\s+(?:products?|headphones?|all)/i,
    action: 'SCROLL_TO_COMPARISON',
    description: 'Scroll to comparison table',
    examples: ['compare products', 'show comparison', 'headphones vs'],
  },
  {
    pattern: /(?:scroll to|go to|show)\s+(?:top|beginning|start|hero)/i,
    action: 'SCROLL_TO_TOP',
    description: 'Scroll to the top of the page',
    examples: ['scroll to top', 'go to start', 'show beginning'],
  },
];

export function matchVoiceCommand(transcript: string): VoiceCommand | null {
  const normalised = transcript.trim();
  for (const cmd of VOICE_COMMANDS) {
    if (cmd.pattern instanceof RegExp) {
      if (cmd.pattern.test(normalised)) return cmd;
    } else {
      if (normalised.toLowerCase().includes(cmd.pattern.toLowerCase())) return cmd;
    }
  }
  return null;
}
