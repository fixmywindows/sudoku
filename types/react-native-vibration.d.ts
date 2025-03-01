declare module 'react-native-vibration' {
    export default class Vibration {
      static vibrate(duration: number): void;
      static cancel(): void;
    }
  }