interface DaumPostcode {
    open(): void;
    [key: string]: any;
  }
  
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: any) => void }) => DaumPostcode;
    };
  }