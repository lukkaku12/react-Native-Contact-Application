export type RootStackParamList = {
    reset(arg0: { index: number; routes: { name: string; }[]; }): unknown;
    LoginStack: undefined;
    RegisterLogin:undefined;
    Home: undefined;
    HomeStack: undefined; 
    HomeTab: undefined;
    Details: { item: { id: number; name: string; last_name: string; phone_number: string; picture_uri: string} };
    mapOptions: { item: { id: number; name: string; last_name: string; phone_number: string; picture_uri: string} };
    newContact: undefined;
    config: {
      item: {
        id: number; name: string; last_name: string; phone_number: string; picture_uri: string
      };
    };
    
    
  };