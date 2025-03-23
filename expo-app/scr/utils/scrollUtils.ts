import { ScrollView } from "react-native";

export const handleHeaderScroll = (event: any, bodyScrollRef: React.RefObject<ScrollView>) => {
    if (bodyScrollRef.current) {
      bodyScrollRef.current.scrollTo({ x: event.nativeEvent.contentOffset.x, animated: false });
    }
  };
  
  export const handleBodyScroll = (event: any, headerScrollRef: React.RefObject<ScrollView>) => {
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollTo({ x: event.nativeEvent.contentOffset.x, animated: false });
    }
  };
  