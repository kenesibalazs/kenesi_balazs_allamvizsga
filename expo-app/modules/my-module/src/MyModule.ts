import { NativeModule, requireNativeModule } from 'expo';

import { MyModuleEvents } from './MyModule.types';

declare class MyModule extends NativeModule<MyModuleEvents> {
  generateKeyInSecureEnclave(): Promise<string>;
  signMessage(message: string): Promise<string>;
}

export default requireNativeModule<MyModule>('MyModule');