declare module "@maniac-tech/react-native-expo-read-sms" {
  export function checkIfHasSMSPermission(): Promise<{
    hasReceiveSmsPermission: boolean;
    hasReadSmsPermission: boolean;
  }>;

  export function requestReadSMSPermission(): Promise<boolean>;

  export function startReadSMS(
    successCallback: (result: any) => void,
    errorCallback?: (error: any) => void,
  ): void;
}

declare module "react-native-android-sms-listener" {
  interface SmsListenerMessage {
    originatingAddress: string;
    body: string;
    timestamp: number;
  }

  interface CancellableSubscription {
    remove: () => void;
  }

  const SmsListener: {
    addListener: (
      listener: (message: SmsListenerMessage) => void,
    ) => CancellableSubscription;
  };

  export default SmsListener;
}
